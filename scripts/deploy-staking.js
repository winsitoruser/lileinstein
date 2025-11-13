const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying Token Staking Contract for LITTLE EINSTEIN...\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying from: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Get token address (should be deployed first)
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  
  if (!TOKEN_ADDRESS || TOKEN_ADDRESS === "YOUR_TOKEN_ADDRESS") {
    console.error("❌ ERROR: Please set TOKEN_ADDRESS in .env file");
    console.log("   Deploy the token contract first using: npm run deploy:base-sepolia");
    process.exit(1);
  }

  console.log(`📄 Token Address: ${TOKEN_ADDRESS}\n`);

  // Deploy Staking Contract
  console.log("📦 Deploying TokenStaking contract...");
  const TokenStaking = await hre.ethers.getContractFactory("TokenStaking");
  const staking = await TokenStaking.deploy(TOKEN_ADDRESS);
  
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();

  console.log(`✅ TokenStaking deployed to: ${stakingAddress}\n`);

  // Display pool information
  console.log("📊 Staking Pools Configuration:");
  console.log("─".repeat(80));
  
  const pools = [
    { type: 0, name: "Flexible" },
    { type: 1, name: "30-Day Lock" },
    { type: 2, name: "90-Day Lock" },
    { type: 3, name: "180-Day Lock" }
  ];

  for (const pool of pools) {
    const poolInfo = await staking.pools(pool.type);
    const lockDays = Number(poolInfo.lockDuration) / (24 * 60 * 60);
    const apr = Number(poolInfo.apr) / 100;
    const minStake = hre.ethers.formatUnits(poolInfo.minStake, 8);
    
    console.log(`\n🎯 ${pool.name} Pool:`);
    console.log(`   Lock Duration: ${lockDays} days`);
    console.log(`   APR: ${apr}%`);
    console.log(`   Min Stake: ${parseFloat(minStake).toLocaleString()} LEINSTEIN`);
    console.log(`   Status: ${poolInfo.active ? "✅ Active" : "❌ Inactive"}`);
  }

  console.log("\n" + "─".repeat(80));

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    tokenAddress: TOKEN_ADDRESS,
    stakingAddress: stakingAddress,
    timestamp: new Date().toISOString(),
    pools: {
      flexible: { apr: "12%", lock: "0 days", minStake: "1,000 LEINSTEIN" },
      lock30: { apr: "25%", lock: "30 days", minStake: "5,000 LEINSTEIN" },
      lock90: { apr: "50%", lock: "90 days", minStake: "10,000 LEINSTEIN" },
      lock180: { apr: "100%", lock: "180 days", minStake: "25,000 LEINSTEIN" }
    }
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${deploymentsDir}/staking-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${filename}\n`);

  // Instructions
  console.log("📋 NEXT STEPS:\n");
  console.log("1️⃣  Fund the reward pool:");
  console.log(`   Add STAKING_ADDRESS=${stakingAddress} to your .env file`);
  console.log(`   Then run: npx hardhat run scripts/fund-reward-pool.js --network ${network.name}\n`);
  
  console.log("2️⃣  Verify the contract on BaseScan:");
  console.log(`   npx hardhat verify --network ${network.name} ${stakingAddress} ${TOKEN_ADDRESS}\n`);

  console.log("3️⃣  Update frontend with staking address:");
  console.log(`   NEXT_PUBLIC_STAKING_ADDRESS=${stakingAddress}\n`);

  console.log("4️⃣  Start staking! Users can now:");
  console.log("   - Stake LEINSTEIN tokens");
  console.log("   - Earn up to 100% APR");
  console.log("   - Choose from 4 different pools");
  console.log("   - Claim rewards anytime\n");

  console.log("🎉 Deployment Complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
