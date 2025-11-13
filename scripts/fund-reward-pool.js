const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("💰 Funding Staking Reward Pool...\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 From: ${deployer.address}\n`);

  // Get addresses from env
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  const STAKING_ADDRESS = process.env.STAKING_ADDRESS;

  if (!TOKEN_ADDRESS || !STAKING_ADDRESS) {
    console.error("❌ ERROR: Please set TOKEN_ADDRESS and STAKING_ADDRESS in .env");
    process.exit(1);
  }

  console.log(`📄 Token Address: ${TOKEN_ADDRESS}`);
  console.log(`📄 Staking Address: ${STAKING_ADDRESS}\n`);

  // Get contract instances
  const token = await hre.ethers.getContractAt("BaseToken", TOKEN_ADDRESS);
  const staking = await hre.ethers.getContractAt("TokenStaking", STAKING_ADDRESS);

  // Check token balance
  const balance = await token.balanceOf(deployer.address);
  console.log(`💼 Your Token Balance: ${hre.ethers.formatUnits(balance, 8)} LEINSTEIN\n`);

  // Reward amount configuration
  // For 250B supply, allocate 50B (20%) for staking rewards
  const REWARD_AMOUNT = process.env.REWARD_POOL_AMOUNT 
    ? hre.ethers.parseUnits(process.env.REWARD_POOL_AMOUNT, 8)
    : hre.ethers.parseUnits("50000000000", 8); // 50 billion default

  console.log(`💎 Reward Amount: ${hre.ethers.formatUnits(REWARD_AMOUNT, 8)} LEINSTEIN`);
  console.log(`   (${(Number(REWARD_AMOUNT) / Number(balance) * 100).toFixed(2)}% of your balance)\n`);

  if (balance < REWARD_AMOUNT) {
    console.error("❌ Insufficient token balance!");
    process.exit(1);
  }

  // Confirm
  console.log("⚠️  This will transfer tokens to the staking contract reward pool.");
  console.log("⏳ Waiting 5 seconds... Press Ctrl+C to cancel.\n");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Approve
  console.log("⏳ Approving tokens...");
  const approveTx = await token.approve(STAKING_ADDRESS, REWARD_AMOUNT);
  await approveTx.wait();
  console.log("✅ Approval confirmed\n");

  // Fund reward pool
  console.log("⏳ Funding reward pool...");
  const fundTx = await staking.fundRewardPool(REWARD_AMOUNT);
  await fundTx.wait();
  console.log("✅ Reward pool funded!\n");

  // Check reward pool balance
  const rewardPoolBalance = await staking.rewardPoolBalance();
  console.log(`💰 Current Reward Pool Balance: ${hre.ethers.formatUnits(rewardPoolBalance, 8)} LEINSTEIN\n`);

  // Calculate APR sustainability
  console.log("📊 Reward Pool Analysis:");
  console.log("─".repeat(60));
  
  const pools = [
    { name: "Flexible (12% APR)", apr: 0.12, minStake: 1000 },
    { name: "30-Day (25% APR)", apr: 0.25, minStake: 5000 },
    { name: "90-Day (50% APR)", apr: 0.50, minStake: 10000 },
    { name: "180-Day (100% APR)", apr: 1.00, minStake: 25000 }
  ];

  const rewardPoolNum = Number(hre.ethers.formatUnits(rewardPoolBalance, 8));

  console.log("\nMaximum Sustainable Stake (if 100% in each pool):");
  for (const pool of pools) {
    const maxStake = rewardPoolNum / pool.apr;
    console.log(`  ${pool.name}: ${maxStake.toLocaleString()} LEINSTEIN`);
  }

  console.log("\n💡 TIPS:");
  console.log("  - Diversified staking across pools is ideal");
  console.log("  - Monitor reward pool balance regularly");
  console.log("  - Refill when needed to maintain APRs");
  console.log("  - Higher APRs need more careful monitoring\n");

  console.log("🎉 Reward Pool Successfully Funded!\n");
  console.log("Users can now:");
  console.log("  ✅ Stake LEINSTEIN tokens");
  console.log("  ✅ Earn rewards based on APR");
  console.log("  ✅ Compound or claim anytime\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
