const hre = require("hardhat");
require("dotenv").config();

/**
 * Setup Vesting Schedule untuk LITTLE EINSTEIN
 * TGE: 10% immediately claimable
 * Monthly: 10% setiap 30 hari untuk 9 bulan
 * Total: 100% vested dalam 10 bulan (TGE + 9 monthly releases)
 */

async function main() {
  console.log("🔐 Setting up Token Vesting Schedule...\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}\n`);

  // Contract addresses (update these after deployment)
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "YOUR_TOKEN_ADDRESS";
  const VESTING_ADDRESS = process.env.VESTING_ADDRESS || "YOUR_VESTING_ADDRESS";

  if (TOKEN_ADDRESS === "YOUR_TOKEN_ADDRESS" || VESTING_ADDRESS === "YOUR_VESTING_ADDRESS") {
    console.error("❌ Please set TOKEN_ADDRESS and VESTING_ADDRESS in .env file");
    process.exit(1);
  }

  // Get contract instances
  const token = await hre.ethers.getContractAt("BaseToken", TOKEN_ADDRESS);
  const vesting = await hre.ethers.getContractAt("TokenVesting", VESTING_ADDRESS);

  console.log(`📄 Token Contract: ${TOKEN_ADDRESS}`);
  console.log(`📄 Vesting Contract: ${VESTING_ADDRESS}\n`);

  // Vesting configuration
  const VESTING_CONFIG = {
    // TGE: 10% immediately
    // Monthly: 10% every 30 days for 9 months
    tgePercent: 10,        // 10% at TGE
    monthlyPercent: 10,    // 10% per month
    monthlyReleases: 9,    // 9 monthly releases
    vestingPeriodDays: 30, // Release every 30 days
  };

  // Example beneficiaries (customize this for your team/investors)
  const beneficiaries = [
    {
      address: "0x1234567890123456789012345678901234567890", // Replace with actual address
      amount: "25000000000", // 25 billion LEINSTEIN
      category: "Team",
      revocable: true
    },
    {
      address: "0x2345678901234567890123456789012345678901", // Replace with actual address
      amount: "37500000000", // 37.5 billion LEINSTEIN
      category: "Investors",
      revocable: false
    },
    // Add more beneficiaries as needed
  ];

  console.log("📋 Vesting Schedule Configuration:");
  console.log(`   TGE Release: ${VESTING_CONFIG.tgePercent}%`);
  console.log(`   Monthly Release: ${VESTING_CONFIG.monthlyPercent}% every ${VESTING_CONFIG.vestingPeriodDays} days`);
  console.log(`   Number of Monthly Releases: ${VESTING_CONFIG.monthlyReleases}`);
  console.log(`   Total Vesting Period: ${VESTING_CONFIG.vestingPeriodDays * VESTING_CONFIG.monthlyReleases} days (${VESTING_CONFIG.vestingPeriodDays * VESTING_CONFIG.monthlyReleases / 30} months)\n`);

  // Calculate vesting parameters
  const decimals = await token.decimals();
  console.log(`   Token Decimals: ${decimals}\n`);

  // Confirm before proceeding
  console.log("⚠️  IMPORTANT: Review the beneficiary addresses before proceeding!");
  console.log("Press Ctrl+C to cancel, or wait 10 seconds to continue...\n");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Create vesting schedules for each beneficiary
  for (let i = 0; i < beneficiaries.length; i++) {
    const beneficiary = beneficiaries[i];
    
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Setting up vesting for: ${beneficiary.category}`);
    console.log(`Address: ${beneficiary.address}`);
    console.log(`Amount: ${beneficiary.amount} LEINSTEIN`);
    console.log(`${"=".repeat(60)}\n`);

    const totalAmount = hre.ethers.parseUnits(beneficiary.amount, decimals);
    
    // Calculate cliff (0 for TGE, beneficiaries can claim 10% immediately)
    const cliffDuration = 0; // No cliff - TGE allows immediate claim
    
    // Total duration for full vesting (9 months after TGE)
    const totalDuration = VESTING_CONFIG.vestingPeriodDays * VESTING_CONFIG.monthlyReleases * 24 * 60 * 60; // in seconds
    
    const startTime = Math.floor(Date.now() / 1000); // Current timestamp

    console.log(`⏰ Vesting Schedule:`);
    console.log(`   Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
    console.log(`   Cliff Duration: ${cliffDuration} seconds (immediate claim available)`);
    console.log(`   Total Duration: ${totalDuration} seconds (${totalDuration / (24 * 60 * 60)} days)`);
    console.log(`   Revocable: ${beneficiary.revocable}\n`);

    // Approve tokens first
    console.log(`⏳ Approving ${beneficiary.amount} LEINSTEIN for vesting contract...`);
    const approveTx = await token.approve(VESTING_ADDRESS, totalAmount);
    await approveTx.wait();
    console.log(`✅ Approval confirmed\n`);

    // Create vesting schedule
    console.log(`⏳ Creating vesting schedule...`);
    const vestingTx = await vesting.createVestingSchedule(
      beneficiary.address,
      totalAmount,
      startTime,
      cliffDuration,
      totalDuration,
      beneficiary.revocable
    );
    
    await vestingTx.wait();
    console.log(`✅ Vesting schedule created!\n`);

    // Show release schedule
    console.log(`📅 Release Schedule:`);
    const tgeAmount = (totalAmount * BigInt(VESTING_CONFIG.tgePercent)) / 100n;
    console.log(`   TGE (Immediate): ${hre.ethers.formatUnits(tgeAmount, decimals)} LEINSTEIN (${VESTING_CONFIG.tgePercent}%)`);
    
    for (let month = 1; month <= VESTING_CONFIG.monthlyReleases; month++) {
      const monthAmount = (totalAmount * BigInt(VESTING_CONFIG.monthlyPercent)) / 100n;
      const releaseDate = new Date((startTime + (month * VESTING_CONFIG.vestingPeriodDays * 24 * 60 * 60)) * 1000);
      console.log(`   Month ${month} (${releaseDate.toLocaleDateString()}): ${hre.ethers.formatUnits(monthAmount, decimals)} LEINSTEIN (${VESTING_CONFIG.monthlyPercent}%)`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ All vesting schedules created successfully!`);
  console.log(`${"=".repeat(60)}\n`);

  // Summary
  console.log("📊 SUMMARY:");
  console.log(`   Total Beneficiaries: ${beneficiaries.length}`);
  const totalVested = beneficiaries.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  console.log(`   Total Vested Amount: ${totalVested.toLocaleString()} LEINSTEIN`);
  console.log(`\n💡 TIP: Beneficiaries can call release() on the vesting contract to claim their tokens`);
  console.log(`   - TGE tokens (10%) can be claimed immediately`);
  console.log(`   - Monthly tokens (10% each) unlock every 30 days`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
