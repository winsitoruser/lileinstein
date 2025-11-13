# 🔐 Vesting Quick Reference - LITTLE EINSTEIN

## TGE 10% + Monthly 10% Release Schedule

### 📊 Schedule Overview

```
┌─────────┬──────────┬───────────┬────────────┐
│ Period  │ Day      │ Release % │ Total %    │
├─────────┼──────────┼───────────┼────────────┤
│ TGE     │ 0        │ 10%       │ 10%        │
│ Month 1 │ 30       │ 10%       │ 20%        │
│ Month 2 │ 60       │ 10%       │ 30%        │
│ Month 3 │ 90       │ 10%       │ 40%        │
│ Month 4 │ 120      │ 10%       │ 50%        │
│ Month 5 │ 150      │ 10%       │ 60%        │
│ Month 6 │ 180      │ 10%       │ 70%        │
│ Month 7 │ 210      │ 10%       │ 80%        │
│ Month 8 │ 240      │ 10%       │ 90%        │
│ Month 9 │ 270      │ 10%       │ 100% ✅    │
└─────────┴──────────┴───────────┴────────────┘
```

---

## 🚀 Quick Setup (3 Steps)

### 1️⃣ Deploy Contracts
```bash
npm run deploy:base-sepolia  # Testnet
# atau
npm run deploy:base          # Mainnet
```

**Simpan addresses:**
- Token: `0x...`
- Vesting: `0x...`

### 2️⃣ Configure .env
```env
TOKEN_ADDRESS=0x...
VESTING_ADDRESS=0x...
```

### 3️⃣ Setup Vesting
```bash
# Edit scripts/setup-vesting.js dengan beneficiary addresses
# Kemudian jalankan:

npm run setup-vesting:sepolia   # Testnet
# atau
npm run setup-vesting:mainnet   # Mainnet
```

---

## 💰 Example Allocations (250B Total)

| Category | Amount | TGE (10%) | Monthly (10%) |
|----------|--------|-----------|---------------|
| Team & Advisors | 37.5B | 3.75B | 3.75B |
| Investors | 25B | 2.5B | 2.5B |
| Reserve | 12.5B | 1.25B | 1.25B |
| **Total Vested** | **75B** | **7.5B** | **7.5B** |

*175B lainnya: Liquidity, Public Sale, Marketing (no vesting)*

---

## 📝 Edit Beneficiaries

File: `scripts/setup-vesting.js`

```javascript
const beneficiaries = [
  {
    address: "0xYourAddress",      // Wallet address
    amount: "37500000000",         // 37.5B tokens
    category: "Team & Advisors",   // Label
    revocable: true                // Can revoke?
  },
  // Add more...
];
```

---

## 🔑 Key Commands

```bash
# Deploy
npm run deploy:base-sepolia

# Setup vesting
npm run setup-vesting:sepolia

# Compile
npm run compile

# Test
npm test
```

---

## 💡 Beneficiary: Claim Tokens

### Via Smart Contract

```javascript
// Check claimable amount
const amount = await vestingContract.getReleasableAmount(yourAddress);

// Claim tokens
await vestingContract.release();
```

### Timeline
- **Day 0**: Claim 10% immediately
- **Day 30**: Claim 10% more
- **Every 30 days**: Claim another 10%
- **Day 270**: Claim final 10% (100% total)

---

## ⚠️ Important Notes

✅ **TGE = 10% immediate** - No cliff, can claim right away  
✅ **Monthly = 10% each** - Unlock setiap 30 hari  
✅ **Revocable** - Owner bisa revoke jika perlu (team/reserve)  
✅ **Non-revocable** - Tidak bisa revoke (investors)  

❌ **Cannot modify** - Vesting schedule tidak bisa diubah  
❌ **Need gas** - Beneficiary perlu ETH untuk claim  
❌ **One address** - Satu vesting schedule per address  

---

## 📚 Full Documentation

- **VESTING_GUIDE.md** - Complete vesting guide
- **TOKEN_INFO.md** - Token specifications
- **QUICKSTART.md** - Quick start guide

---

**LITTLE EINSTEIN (LEINSTEIN)**  
*TGE 10% + Monthly 10% Release* 🔐🧠
