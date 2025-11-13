const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting deployment on Base Chain...\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying from: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Token configuration from environment or defaults
  const TOKEN_NAME = process.env.TOKEN_NAME || "LITTLE EINSTEIN";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "LEINSTEIN";
  const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY || "250000000000";
  const DECIMALS = process.env.TOKEN_DECIMALS || 8;

  console.log("📋 Token Configuration:");
  console.log(`   Name: ${TOKEN_NAME}`);
  console.log(`   Symbol: ${TOKEN_SYMBOL}`);
  console.log(`   Initial Supply: ${INITIAL_SUPPLY}`);
  console.log(`   Decimals: ${DECIMALS}\n`);

  // Deploy BaseToken
  console.log("⏳ Deploying BaseToken contract...");
  const BaseToken = await hre.ethers.getContractFactory("BaseToken");
  const token = await BaseToken.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY,
    DECIMALS
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  
  console.log(`✅ BaseToken deployed to: ${tokenAddress}\n`);

  // Deploy TokenVesting
  console.log("⏳ Deploying TokenVesting contract...");
  const TokenVesting = await hre.ethers.getContractFactory("TokenVesting");
  const vesting = await TokenVesting.deploy(tokenAddress);

  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  
  console.log(`✅ TokenVesting deployed to: ${vestingAddress}\n`);

  // Summary
  console.log("=" .repeat(60));
  console.log("📝 DEPLOYMENT SUMMARY");
  console.log("=" .repeat(60));
  console.log(`Token Name: ${TOKEN_NAME}`);
  console.log(`Token Symbol: ${TOKEN_SYMBOL}`);
  console.log(`BaseToken Address: ${tokenAddress}`);
  console.log(`TokenVesting Address: ${vestingAddress}`);
  console.log(`Network: ${network.name} (${network.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("=" .repeat(60));

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    token: {
      address: tokenAddress,
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      decimals: DECIMALS,
      initialSupply: INITIAL_SUPPLY
    },
    vesting: {
      address: vestingAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fileName = `deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    `./deployments/${fileName}`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Deployment info saved to: ./deployments/${fileName}`);

  // Verification instructions
  if (network.chainId === 8453n || network.chainId === 84532n) {
    console.log("\n📌 To verify contracts on BaseScan, run:");
    console.log(`npx hardhat verify --network ${network.name} ${tokenAddress} "${TOKEN_NAME}" "${TOKEN_SYMBOL}" ${INITIAL_SUPPLY} ${DECIMALS}`);
    console.log(`npx hardhat verify --network ${network.name} ${vestingAddress} ${tokenAddress}`);
  }
}

// Create deployments directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("./deployments")) {
  fs.mkdirSync("./deployments");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
