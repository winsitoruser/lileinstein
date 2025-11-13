const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenStaking", function () {
  let token, staking;
  let owner, user1, user2;
  const DECIMALS = 8;
  const INITIAL_SUPPLY = ethers.parseUnits("250000000000", DECIMALS); // 250 billion

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy token
    const BaseToken = await ethers.getContractFactory("BaseToken");
    token = await BaseToken.deploy(
      "LITTLE EINSTEIN",
      "LEINSTEIN",
      INITIAL_SUPPLY,
      DECIMALS
    );
    await token.waitForDeployment();

    // Deploy staking contract
    const TokenStaking = await ethers.getContractFactory("TokenStaking");
    staking = await TokenStaking.deploy(await token.getAddress());
    await staking.waitForDeployment();

    // Transfer tokens to users
    await token.transfer(user1.address, ethers.parseUnits("1000000", DECIMALS));
    await token.transfer(user2.address, ethers.parseUnits("1000000", DECIMALS));

    // Fund reward pool
    const rewardAmount = ethers.parseUnits("50000000", DECIMALS); // 50M for rewards
    await token.approve(await staking.getAddress(), rewardAmount);
    await staking.fundRewardPool(rewardAmount);
  });

  describe("Deployment", function () {
    it("Should set the correct staking token", async function () {
      expect(await staking.stakingToken()).to.equal(await token.getAddress());
    });

    it("Should initialize pools correctly", async function () {
      const flexiblePool = await staking.pools(0); // PoolType.FLEXIBLE
      expect(flexiblePool.apr).to.equal(1200); // 12%
      expect(flexiblePool.active).to.be.true;

      const lock30Pool = await staking.pools(1); // PoolType.LOCK_30
      expect(lock30Pool.apr).to.equal(2500); // 25%
      expect(lock30Pool.lockDuration).to.equal(30 * 24 * 60 * 60);
    });

    it("Should have correct reward pool balance", async function () {
      const balance = await staking.rewardPoolBalance();
      expect(balance).to.equal(ethers.parseUnits("50000000", DECIMALS));
    });
  });

  describe("Flexible Staking", function () {
    it("Should allow user to stake in flexible pool", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0); // PoolType.FLEXIBLE

      const stake = await staking.userStakes(user1.address, 0);
      expect(stake.amount).to.equal(stakeAmount);
      expect(stake.poolType).to.equal(0);
    });

    it("Should reject stake below minimum", async function () {
      const stakeAmount = ethers.parseUnits("500", DECIMALS); // Below 1000 min
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await expect(
        staking.connect(user1).stake(stakeAmount, 0)
      ).to.be.revertedWith("Amount below minimum stake");
    });

    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0);

      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const rewards = await staking.calculateRewards(user1.address, 0);
      // Expected: 10000 * 12% * (30/365) ≈ 98.6 LEINSTEIN
      expect(rewards).to.be.gt(ethers.parseUnits("95", DECIMALS));
      expect(rewards).to.be.lt(ethers.parseUnits("105", DECIMALS));
    });

    it("Should allow claiming rewards", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0);

      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const balanceBefore = await token.balanceOf(user1.address);
      await staking.connect(user1).claimRewards(0);
      const balanceAfter = await token.balanceOf(user1.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should allow unstaking without penalty (flexible)", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0);

      // Fast forward 10 days
      await time.increase(10 * 24 * 60 * 60);

      const balanceBefore = await token.balanceOf(user1.address);
      await staking.connect(user1).unstake(0);
      const balanceAfter = await token.balanceOf(user1.address);

      // Should get stake + rewards back
      expect(balanceAfter).to.be.gt(balanceBefore + stakeAmount);
    });
  });

  describe("Locked Staking (30 days)", function () {
    it("Should allow staking in 30-day pool", async function () {
      const stakeAmount = ethers.parseUnits("50000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 1); // PoolType.LOCK_30

      const stake = await staking.userStakes(user1.address, 0);
      expect(stake.amount).to.equal(stakeAmount);
      expect(stake.poolType).to.equal(1);
    });

    it("Should apply penalty for early withdrawal", async function () {
      const stakeAmount = ethers.parseUnits("50000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 1);

      // Try to unstake after 15 days (before lock expires)
      await time.increase(15 * 24 * 60 * 60);

      const balanceBefore = await token.balanceOf(user1.address);
      await staking.connect(user1).unstake(0);
      const balanceAfter = await token.balanceOf(user1.address);

      // Should get less than staked amount due to penalty
      const received = balanceAfter - balanceBefore;
      expect(received).to.be.lt(stakeAmount);
    });

    it("Should not apply penalty after lock period", async function () {
      const stakeAmount = ethers.parseUnits("50000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 1);

      // Wait for lock period to expire (30 days)
      await time.increase(31 * 24 * 60 * 60);

      const balanceBefore = await token.balanceOf(user1.address);
      await staking.connect(user1).unstake(0);
      const balanceAfter = await token.balanceOf(user1.address);

      // Should get stake + rewards, no penalty
      expect(balanceAfter).to.be.gte(balanceBefore + stakeAmount);
    });

    it("Should calculate higher rewards for locked pool", async function () {
      const stakeAmount = ethers.parseUnits("50000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 1); // 25% APR

      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const rewards = await staking.calculateRewards(user1.address, 0);
      // Expected: 50000 * 25% * (30/365) ≈ 1027 LEINSTEIN
      expect(rewards).to.be.gt(ethers.parseUnits("1000", DECIMALS));
    });
  });

  describe("Multiple Stakes", function () {
    it("Should allow user to have multiple stakes", async function () {
      const stake1 = ethers.parseUnits("10000", DECIMALS);
      const stake2 = ethers.parseUnits("50000", DECIMALS);

      // First stake: flexible
      await token.connect(user1).approve(await staking.getAddress(), stake1);
      await staking.connect(user1).stake(stake1, 0);

      // Second stake: 30-day lock
      await token.connect(user1).approve(await staking.getAddress(), stake2);
      await staking.connect(user1).stake(stake2, 1);

      expect(await staking.userStakeCount(user1.address)).to.equal(2);

      const userStake1 = await staking.userStakes(user1.address, 0);
      const userStake2 = await staking.userStakes(user1.address, 1);

      expect(userStake1.amount).to.equal(stake1);
      expect(userStake2.amount).to.equal(stake2);
    });

    it("Should calculate total staked correctly", async function () {
      const stake1 = ethers.parseUnits("10000", DECIMALS);
      const stake2 = ethers.parseUnits("50000", DECIMALS);

      await token.connect(user1).approve(await staking.getAddress(), stake1 + stake2);
      await staking.connect(user1).stake(stake1, 0);
      await staking.connect(user1).stake(stake2, 1);

      const totalStaked = await staking.getUserTotalStaked(user1.address);
      expect(totalStaked).to.equal(stake1 + stake2);
    });
  });

  describe("Statistics", function () {
    it("Should track total stakers", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);

      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0);

      await token.connect(user2).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user2).stake(stakeAmount, 0);

      expect(await staking.totalStakers()).to.equal(2);
    });

    it("Should track total staked globally", async function () {
      const stake1 = ethers.parseUnits("10000", DECIMALS);
      const stake2 = ethers.parseUnits("50000", DECIMALS);

      await token.connect(user1).approve(await staking.getAddress(), stake1);
      await staking.connect(user1).stake(stake1, 0);

      await token.connect(user2).approve(await staking.getAddress(), stake2);
      await staking.connect(user2).stake(stake2, 0);

      expect(await staking.totalStakedGlobal()).to.equal(stake1 + stake2);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update pool", async function () {
      await staking.updatePool(
        0, // PoolType.FLEXIBLE
        0,
        1500, // Change APR to 15%
        ethers.parseUnits("2000", DECIMALS),
        true
      );

      const pool = await staking.pools(0);
      expect(pool.apr).to.equal(1500);
    });

    it("Should not allow non-owner to update pool", async function () {
      await expect(
        staking.connect(user1).updatePool(0, 0, 1500, ethers.parseUnits("2000", DECIMALS), true)
      ).to.be.reverted;
    });

    it("Should allow owner to pause staking", async function () {
      await staking.pause();
      
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      
      await expect(
        staking.connect(user1).stake(stakeAmount, 0)
      ).to.be.reverted;
    });
  });

  describe("Emergency Withdraw", function () {
    it("Should allow emergency withdraw", async function () {
      const stakeAmount = ethers.parseUnits("10000", DECIMALS);
      
      await token.connect(user1).approve(await staking.getAddress(), stakeAmount);
      await staking.connect(user1).stake(stakeAmount, 0);

      const balanceBefore = await token.balanceOf(user1.address);
      await staking.connect(user1).emergencyWithdraw(0);
      const balanceAfter = await token.balanceOf(user1.address);

      // Should get stake back (minus penalty if locked)
      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });
});
