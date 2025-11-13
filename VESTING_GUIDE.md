# LITTLE EINSTEIN Token Vesting Guide 🔐

Panduan lengkap untuk setup token vesting dengan **TGE 10%** dan release **10% setiap 30 hari**.

## 📊 Vesting Schedule Overview

**LITTLE EINSTEIN (LEINSTEIN)** menggunakan vesting schedule:

- **TGE (Token Generation Event)**: 10% immediately claimable
- **Monthly Release**: 10% setiap 30 hari
- **Total Duration**: 9 bulan (270 hari)
- **Total Vesting**: 100% dalam 10 periode

### Timeline Visual

```
TGE      Month 1   Month 2   Month 3   ... Month 9
 │          │         │         │            │
10%        10%       10%       10%    ...   10%
 └──────────┴─────────┴─────────┴──────────┴──> 100%
Day 0     Day 30    Day 60    Day 90      Day 270
```

## 🎯 Allocation Examples

Dengan total supply **250 Miliar LEINSTEIN**, contoh alokasi:

| Category | Allocation | TGE (10%) | Monthly (10%) | Duration |
|----------|------------|-----------|---------------|----------|
| Team & Advisors | 37.5B | 3.75B | 3.75B/month | 9 months |
| Investors | 25B | 2.5B | 2.5B/month | 9 months |
| Reserve | 12.5B | 1.25B | 1.25B/month | 9 months |
| **Total Vested** | **75B** | **7.5B** | **7.5B/month** | **9 months** |

*Sisanya (175B) bisa untuk liquidity, public sale, marketing, dll tanpa vesting*

## 🔧 Setup Vesting

### Step 1: Deploy Contracts

```bash
# Deploy token dan vesting contracts
npm run deploy:base-sepolia  # atau deploy:base untuk mainnet
```

Simpan addresses yang didapat:
- Token Address: `0x...`
- Vesting Address: `0x...`

### Step 2: Configure Environment

Tambahkan ke file `.env`:

```env
TOKEN_ADDRESS=0x...  # Token address dari deployment
VESTING_ADDRESS=0x...  # Vesting address dari deployment
```

### Step 3: Setup Beneficiaries

Edit file `scripts/setup-vesting.js` di bagian beneficiaries:

```javascript
const beneficiaries = [
  {
    address: "0xYourTeamWalletAddress",
    amount: "37500000000", // 37.5 billion LEINSTEIN
    category: "Team & Advisors",
    revocable: true  // Bisa direvoke jika diperlukan
  },
  {
    address: "0xInvestorWalletAddress",
    amount: "25000000000", // 25 billion LEINSTEIN
    category: "Investors",
    revocable: false  // Tidak bisa direvoke
  },
  {
    address: "0xReserveWalletAddress",
    amount: "12500000000", // 12.5 billion LEINSTEIN
    category: "Reserve",
    revocable: true
  },
  // Tambahkan beneficiary lain sesuai kebutuhan
];
```

### Step 4: Run Vesting Setup

```bash
npx hardhat run scripts/setup-vesting.js --network baseSepolia
# atau untuk mainnet:
npx hardhat run scripts/setup-vesting.js --network base
```

Script akan:
1. ✅ Approve tokens untuk vesting contract
2. ✅ Create vesting schedule untuk setiap beneficiary
3. ✅ Show release schedule timeline

## 📅 Release Schedule Calculator

Untuk menghitung release schedule:

**Formula:**
- TGE Amount = Total Amount × 10%
- Monthly Amount = Total Amount × 10%
- Release Date = Start Date + (Month × 30 days)

**Contoh untuk 37.5B tokens:**

| Period | Date | Amount | Cumulative |
|--------|------|--------|------------|
| TGE | Day 0 | 3.75B | 3.75B (10%) |
| Month 1 | Day 30 | 3.75B | 7.5B (20%) |
| Month 2 | Day 60 | 3.75B | 11.25B (30%) |
| Month 3 | Day 90 | 3.75B | 15B (40%) |
| Month 4 | Day 120 | 3.75B | 18.75B (50%) |
| Month 5 | Day 150 | 3.75B | 22.5B (60%) |
| Month 6 | Day 180 | 3.75B | 26.25B (70%) |
| Month 7 | Day 210 | 3.75B | 30B (80%) |
| Month 8 | Day 240 | 3.75B | 33.75B (90%) |
| Month 9 | Day 270 | 3.75B | 37.5B (100%) |

## 💰 Claiming Vested Tokens

### Untuk Beneficiaries

**Check Releasable Amount:**

```javascript
// Via contract call
const releasable = await vestingContract.getReleasableAmount(yourAddress);
console.log("Claimable:", ethers.formatUnits(releasable, 8), "LEINSTEIN");
```

**Claim Tokens:**

```javascript
// Release vested tokens
const tx = await vestingContract.release();
await tx.wait();
console.log("Tokens claimed!");
```

**Via Frontend:**

Frontend bisa ditambahkan interface untuk:
1. View vesting schedule
2. Check claimable amount
3. Claim button untuk release tokens

## 🔒 Security Features

### Revocable vs Non-Revocable

**Revocable (untuk Team/Reserve):**
- Owner bisa revoke vesting jika diperlukan
- Tokens yang sudah vested tetap bisa diklaim
- Unvested tokens dikembalikan ke owner

**Non-Revocable (untuk Investors):**
- Tidak bisa direvoke
- Memberikan kepercayaan kepada investors
- Tokens pasti akan vested sesuai schedule

### Revoke Vesting (Owner Only)

```javascript
// Only for revocable vestings
await vestingContract.revoke(beneficiaryAddress);
```

## 📝 Smart Contract Interface

### Key Functions

```solidity
// Create vesting schedule (Owner only)
createVestingSchedule(
  address beneficiary,
  uint256 totalAmount,
  uint256 startTime,
  uint256 cliffDuration,  // 0 untuk TGE immediate
  uint256 duration,       // 270 days total
  bool revocable
)

// Release vested tokens (Beneficiary)
release()

// Check releasable amount (View)
getReleasableAmount(address beneficiary) returns (uint256)

// Check total vested amount (View)
getVestedAmount(address beneficiary) returns (uint256)

// Revoke vesting (Owner only, if revocable)
revoke(address beneficiary)
```

## 🎯 Best Practices

### 1. Multi-Sig Wallet
Gunakan multi-sig wallet untuk owner address:
- Gnosis Safe on Base
- Minimum 3/5 signatures
- Protect vesting control

### 2. Transparent Communication
- Publish vesting schedules
- Update community regularly
- Show on-chain verification

### 3. Testing
- Test di testnet dulu
- Verify all calculations
- Check release schedules

### 4. Documentation
- Document all beneficiaries
- Keep record of allocations
- Track releases

## 🔍 Verification

### Verify Vesting Schedule On-Chain

```bash
# Get vesting schedule info
npx hardhat run scripts/verify-vesting.js --network base
```

### Check via BaseScan

1. Buka https://basescan.org/address/VESTING_ADDRESS
2. Go to "Read Contract"
3. Call `vestingSchedules(beneficiaryAddress)`

Akan menampilkan:
- totalAmount
- releasedAmount
- startTime
- cliffDuration
- duration
- revocable
- revoked

## 📊 Monitoring Dashboard

Buat dashboard untuk track:

1. **Total Locked Tokens**
2. **Released Tokens**
3. **Pending Releases**
4. **Next Release Date**
5. **Beneficiary List**

## ⚠️ Important Notes

1. **Clock Skew**: Blockchain timestamp bisa sedikit berbeda
2. **Gas Fees**: Release memerlukan gas, beneficiary perlu ETH
3. **Rounding**: Dengan 8 decimals, bisa ada sedikit rounding
4. **One-Time Setup**: Vesting schedule tidak bisa diubah setelah dibuat

## 🆘 Troubleshooting

### "No tokens to release"
- Belum waktunya (check schedule)
- Tokens sudah di-claim semua

### "No vesting schedule"
- Vesting belum di-setup untuk address tersebut
- Salah network

### "Vesting revoked"
- Owner sudah revoke vesting
- Cek dengan owner

## 📞 Support

Untuk pertanyaan tentang vesting:
1. Check dokumentasi ini
2. Verify on BaseScan
3. Contact team via official channels

---

**LITTLE EINSTEIN (LEINSTEIN)**  
*Fair & Transparent Token Vesting* 🔐

Built on Base Chain L2 with security in mind 🛡️
