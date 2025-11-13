# LITTLE EINSTEIN (LEINSTEIN) Token Information 🧠

## Token Specifications

| Parameter | Value |
|-----------|-------|
| **Name** | LITTLE EINSTEIN |
| **Symbol** | LEINSTEIN |
| **Total Supply** | 250,000,000,000 (250 Billion) |
| **Decimals** | 8 |
| **Blockchain** | Base Chain (L2) |
| **Standard** | ERC20 |

## Supply Breakdown

- **Total Tokens**: 250,000,000,000 LEINSTEIN
- **Smallest Unit**: 0.00000001 LEINSTEIN (1 Satoshi-style)
- **Human Readable Supply**: 250 Billion tokens

## Calculation Examples

With 8 decimals:
- 1 LEINSTEIN = 100,000,000 base units
- 0.00000001 LEINSTEIN = 1 base unit
- 250,000,000,000 LEINSTEIN = 25,000,000,000,000,000,000 base units

## Contract Features

✅ **Minting** - Owner dapat mint token tambahan jika diperlukan
✅ **Burning** - Holder bisa burn token mereka untuk mengurangi supply
✅ **Batch Transfer** - Kirim ke multiple address dalam 1 transaksi
✅ **ERC20Permit** - Gasless approvals menggunakan signatures
✅ **Token Vesting** - Vesting contract untuk lock dan release bertahap

## Deployment Configuration

File `.env` yang perlu dikonfigurasi:

```env
# Wallet Private Key
PRIVATE_KEY=your_private_key_here

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API Key
BASESCAN_API_KEY=your_basescan_api_key

# Token Configuration - LITTLE EINSTEIN
TOKEN_NAME=LITTLE EINSTEIN
TOKEN_SYMBOL=LEINSTEIN
INITIAL_SUPPLY=250000000000
TOKEN_DECIMALS=8
```

## Quick Deploy Commands

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run Tests
```bash
npm test
```

### 4. Deploy to Base Sepolia (Testnet)
```bash
npm run deploy:base-sepolia
```

### 5. Verify Contract
```bash
npx hardhat verify --network baseSepolia <ADDRESS> "LITTLE EINSTEIN" "LEINSTEIN" 250000000000 8
```

### 6. Deploy to Base Mainnet (Production)
```bash
npm run deploy:base
```

## Token Distribution Ideas

Contoh distribusi untuk 250 miliar tokens:

| Allocation | Amount | Percentage |
|------------|--------|------------|
| Public Sale | 100,000,000,000 | 40% |
| Liquidity Pool | 75,000,000,000 | 30% |
| Team & Advisors | 37,500,000,000 | 15% |
| Marketing | 25,000,000,000 | 10% |
| Reserve | 12,500,000,000 | 5% |
| **TOTAL** | **250,000,000,000** | **100%** |

*Ini hanya contoh - sesuaikan dengan strategi token Anda*

## Meme Token Strategy

Sebagai meme token, pertimbangkan:

1. **Community First** 🌐
   - Fokus pada community building
   - Aktif di social media
   - Engage dengan holders

2. **Fair Launch** 🚀
   - Transparent distribution
   - No pre-mine untuk founder (kecuali disclosed)
   - Clear tokenomics

3. **Liquidity** 💧
   - Lock liquidity untuk trust
   - Sufficient LP untuk trading
   - Consider DEX listing (Uniswap, etc.)

4. **Marketing** 📢
   - Meme creation & viral content
   - Influencer partnerships
   - Community contests

5. **Utility (Optional)** ⚡
   - NFT integration
   - Staking rewards
   - Governance features

## Smart Contract Addresses

Setelah deployment, catat addresses di sini:

### Base Sepolia (Testnet)
- **Token Contract**: `0x...`
- **Vesting Contract**: `0x...`
- **BaseScan**: `https://sepolia.basescan.org/address/0x...`

### Base Mainnet (Production)
- **Token Contract**: `0x...`
- **Vesting Contract**: `0x...`
- **BaseScan**: `https://basescan.org/address/0x...`

## Important Links

- **Website**: [Your website]
- **Twitter**: [@YourHandle]
- **Telegram**: [Your channel]
- **Discord**: [Your server]
- **GitHub**: https://github.com/[your-org]/EINSTEINCHAIN

## Security Checklist

Before mainnet deployment:

- [ ] Smart contracts audited
- [ ] All tests passing
- [ ] Testnet deployment successful
- [ ] Contract verified on BaseScan
- [ ] Ownership keys secured
- [ ] Multi-sig wallet setup (recommended)
- [ ] Liquidity locked
- [ ] Team allocation vested
- [ ] Emergency procedures documented

## Gas Optimization

Base Chain L2 sudah sangat murah, tapi tetap optimize:

- Batch transfers untuk airdrop
- Approve once, use multiple times
- Use ERC20Permit untuk gasless approvals

## Legal Disclaimer

⚠️ **IMPORTANT**: 
- This is a meme token for entertainment purposes
- Not financial advice
- DYOR (Do Your Own Research)
- Cryptocurrency is volatile and risky
- Only invest what you can afford to lose

---

**Built with ❤️ on Base Chain**

*E = mc² meets blockchain 🧠⚡*
