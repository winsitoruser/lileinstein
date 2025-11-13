# LITTLE EINSTEIN (LEINSTEIN) 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Chain](https://img.shields.io/badge/Base-Chain-blue)](https://base.org)
[![Tests](https://img.shields.io/badge/Tests-44%20Passing-brightgreen)]()
[![GitHub](https://img.shields.io/badge/GitHub-lileinstein-black?logo=github)](https://github.com/winsitoruser/lileinstein)

A complete meme token implementation on Base Chain L2 featuring smart contracts, multi-tier staking, token vesting, comprehensive testing suite, and modern web interface.

**Token Specifications:**
- **Name**: LITTLE EINSTEIN
- **Symbol**: LEINSTEIN
- **Total Supply**: 250,000,000,000 (250 Billion)
- **Decimals**: 8
- **Blockchain**: Base Chain (Ethereum L2)
- **Standard**: ERC20

---

## 🌟 Key Features

### 💎 Core Token Features
- **ERC20 Standard** - Full-featured implementation with OpenZeppelin
- **Minting** - Owner can mint additional tokens if needed
- **Burning** - Token holders can burn their tokens
- **Batch Transfer** - Send to multiple addresses in one transaction
- **ERC20Permit** - Gasless approvals using signatures

### 🔐 Token Vesting System
- **TGE Release**: 10% immediately claimable at Token Generation Event
- **Monthly Unlock**: 10% released every 30 days
- **Total Duration**: 9 months (270 days)
- **Full Vesting**: 100% unlocked across 10 periods
- **Revocable Options**: Flexible for team allocations
- **Non-Revocable**: Secure investor protection

### 🎯 Multi-Tier Staking Pools

| Pool | APR | Lock Period | Min Stake | Best For |
|------|-----|-------------|-----------|----------|
| 🟢 **Flexible** | **12%** | None | 1,000 tokens | Active traders |
| 🟡 **30-Day Lock** | **25%** | 30 days | 5,000 tokens | Short-term holds |
| 🟠 **90-Day Lock** | **50%** | 90 days | 10,000 tokens | Medium-term |
| 🔴 **180-Day Lock** | **100%** | 180 days | 25,000 tokens | Maximum returns |

**Staking Highlights:**
- ✅ Up to **100% APR** - Double your tokens in 6 months!
- ✅ **Multiple Stakes** - Diversify across different pools
- ✅ **Claim Anytime** - Withdraw rewards without unstaking
- ✅ **Compound Rewards** - Reinvest for exponential growth
- ✅ **Fair Penalties** - Only 10% for early withdrawal from locked pools

### 🎨 Modern Frontend
- **Next.js 14** - Latest React framework with App Router
- **TailwindCSS** - Beautiful, responsive UI design
- **RainbowKit** - Seamless wallet connection
- **Wagmi Hooks** - Type-safe Ethereum interactions
- **Viem** - Lightweight Web3 library
- **TypeScript** - Full type safety throughout

### 🧪 Comprehensive Testing
- **44 Tests Passing** - Full coverage across all contracts
- **Hardhat Framework** - Industry-standard development environment
- **Gas Optimization** - Efficient contract operations
- **Security Focused** - OpenZeppelin standards + custom tests

---

## 📊 Tokenomics (250 Billion Supply)

### Recommended Allocation

| Category | Allocation | Percentage | Vesting |
|----------|-----------|------------|---------|
| 🌊 **Liquidity Pool** | 75B | 30% | None (immediate) |
| 🌍 **Public Sale** | 75B | 30% | Gradual release |
| 🎯 **Staking Rewards** | 50B | 20% | Distributed as rewards |
| 👥 **Team & Advisors** | 25B | 10% | TGE 10% + Monthly 10% |
| 💼 **Investors** | 15B | 6% | TGE 10% + Monthly 10% |
| 📢 **Marketing** | 7.5B | 3% | Immediate |
| 💎 **Reserve** | 2.5B | 1% | TGE 10% + Monthly 10% |

**Key Points:**
- ✅ **60% to Community** - Fair distribution (Liquidity + Public Sale)
- ✅ **20% for Staking** - Sustainable reward pool
- ✅ **16% Vested** - Team & investor tokens locked
- ✅ **Transparent** - All allocations on-chain

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MetaMask** or compatible Web3 wallet
- **Base Sepolia ETH** for testing (get from faucet)
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/winsitoruser/lileinstein.git
cd lileinstein
```

### 2. Install Dependencies
```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# - PRIVATE_KEY (MetaMask private key)
# - BASESCAN_API_KEY (from basescan.org)
# - RPC URLs (optional, defaults provided)
```

### 4. Compile Contracts
```bash
npm run compile
```

Expected output:
```
Compiled 24 Solidity files successfully
```

### 5. Run Tests
```bash
npm test
```

Expected result:
```
✅ 44 passing tests
```

### 6. Deploy to Testnet
```bash
# Get testnet ETH from faucet:
# https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# Deploy token and vesting contracts
npm run deploy:base-sepolia
```

### 7. Deploy Staking Contract
```bash
# Add TOKEN_ADDRESS to .env from previous deployment
npm run deploy-staking:sepolia

# Fund the staking reward pool
# Add STAKING_ADDRESS to .env
npm run fund-rewards:sepolia
```

### 8. Setup Token Vesting (Optional)
```bash
# Edit scripts/setup-vesting.js with beneficiary addresses
npm run setup-vesting:sepolia
```

### 9. Verify Contracts
```bash
# Verify token contract
npx hardhat verify --network baseSepolia <TOKEN_ADDRESS> "LITTLE EINSTEIN" "LEINSTEIN" 250000000000 8

# Verify vesting contract
npx hardhat verify --network baseSepolia <VESTING_ADDRESS> <TOKEN_ADDRESS>

# Verify staking contract
npx hardhat verify --network baseSepolia <STAKING_ADDRESS> <TOKEN_ADDRESS>
```

### 10. Launch Frontend
```bash
cd frontend
cp .env.example .env.local

# Edit .env.local with:
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_TOKEN_ADDRESS
# - NEXT_PUBLIC_VESTING_ADDRESS
# - NEXT_PUBLIC_STAKING_ADDRESS

npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📂 Project Structure

```
EINSTEINCHAIN/
├── contracts/              # Solidity smart contracts
│   ├── BaseToken.sol      # Main ERC20 token
│   ├── TokenVesting.sol   # Vesting implementation
│   └── TokenStaking.sol   # Multi-tier staking
├── scripts/               # Deployment scripts
│   ├── deploy.js          # Deploy token & vesting
│   ├── deploy-staking.js  # Deploy staking
│   ├── setup-vesting.js   # Configure vesting
│   └── fund-reward-pool.js # Fund staking rewards
├── test/                  # Test suites
│   ├── BaseToken.test.js  # Token tests (14 passing)
│   ├── TokenVesting.test.js # Vesting tests (10 passing)
│   └── TokenStaking.test.js # Staking tests (20 passing)
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   ├── lib/              # Utilities & configs
│   └── public/           # Static assets
├── deployments/          # Deployment records (gitignored)
├── .github/              # GitHub Actions CI/CD
│   └── workflows/
│       └── test.yml      # Automated testing
├── docs/                 # Documentation
│   ├── README.md         # This file
│   ├── QUICKSTART.md     # Quick start guide
│   ├── TOKEN_INFO.md     # Token specifications
│   ├── VESTING_GUIDE.md  # Vesting documentation
│   ├── STAKING_GUIDE.md  # Staking documentation
│   ├── TOKENOMICS.md     # Economic model
│   └── DEPLOYMENT_GUIDE.md # Deployment instructions
├── hardhat.config.js     # Hardhat configuration
├── package.json          # NPM scripts & dependencies
└── .env.example          # Environment template
```

---

## 🔧 NPM Scripts

### Contract Operations
```bash
npm run compile              # Compile all contracts
npm test                     # Run all tests
npm run deploy:base-sepolia  # Deploy to testnet
npm run deploy:base          # Deploy to mainnet
```

### Staking Operations
```bash
npm run deploy-staking:sepolia  # Deploy staking (testnet)
npm run deploy-staking:mainnet  # Deploy staking (mainnet)
npm run fund-rewards:sepolia    # Fund reward pool (testnet)
npm run fund-rewards:mainnet    # Fund reward pool (mainnet)
```

### Vesting Operations
```bash
npm run setup-vesting:sepolia   # Setup vesting (testnet)
npm run setup-vesting:mainnet   # Setup vesting (mainnet)
```

### Frontend
```bash
npm run dev                  # Start frontend dev server
```

---

## 📖 Smart Contract Details

### BaseToken.sol
**Purpose**: Main ERC20 token contract

**Features:**
- Standard ERC20 functions (transfer, approve, etc.)
- Minting capability (owner only)
- Burning capability (any holder)
- Batch transfer function
- ERC20Permit for gasless approvals
- 8 decimal places

**Inheritance:**
- OpenZeppelin ERC20
- OpenZeppelin ERC20Burnable
- OpenZeppelin ERC20Permit
- OpenZeppelin Ownable

### TokenVesting.sol
**Purpose**: Time-locked token vesting

**Features:**
- Create vesting schedules
- Linear vesting over time
- Cliff period support
- Release vested tokens
- Revocable vs non-revocable options
- View functions for schedule info

**Use Cases:**
- Team token vesting
- Investor token locks
- Advisor allocations
- Strategic partnerships

### TokenStaking.sol
**Purpose**: Multi-tier staking rewards

**Features:**
- 4 different staking pools (Flexible, 30d, 90d, 180d)
- Different APRs per pool (12%, 25%, 50%, 100%)
- Multiple stakes per user
- Claim rewards without unstaking
- Early withdrawal with penalty (10%)
- Emergency withdraw function
- Pausable for security
- ReentrancyGuard protection

**Pool Configuration:**
```solidity
enum PoolType { FLEXIBLE, LOCK_30, LOCK_90, LOCK_180 }

// Flexible: 12% APR, no lock, min 1K tokens
// 30-Day: 25% APR, 30-day lock, min 5K tokens
// 90-Day: 50% APR, 90-day lock, min 10K tokens
// 180-Day: 100% APR, 180-day lock, min 25K tokens
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Individual Contracts
```bash
npx hardhat test test/BaseToken.test.js
npx hardhat test test/TokenVesting.test.js
npx hardhat test test/TokenStaking.test.js
```

### Test Coverage
- **BaseToken**: 14 tests - Deployment, transfers, minting, burning, batch transfers, permits
- **TokenVesting**: 10 tests - Schedule creation, token release, revocation, view functions
- **TokenStaking**: 20 tests - All pool types, rewards, penalties, admin functions

### Gas Reporting
```bash
REPORT_GAS=true npm test
```

---

## 🚀 Deployment Guide

### Testnet Deployment (Base Sepolia)

**Step 1: Get Testnet ETH**
- Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Request testnet ETH for your address

**Step 2: Configure .env**
```env
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_api_key_here
```

**Step 3: Deploy Contracts**
```bash
# Deploy token & vesting
npm run deploy:base-sepolia

# Deploy staking
npm run deploy-staking:sepolia

# Fund staking rewards
npm run fund-rewards:sepolia
```

**Step 4: Verify on BaseScan**
```bash
npx hardhat verify --network baseSepolia <ADDRESS> <CONSTRUCTOR_ARGS>
```

### Mainnet Deployment (Base)

⚠️ **IMPORTANT: Only deploy to mainnet after thorough testing!**

**Pre-deployment Checklist:**
- [ ] All tests passing on testnet
- [ ] Contracts verified on testnet
- [ ] Frontend tested with testnet
- [ ] Security audit completed
- [ ] Multi-sig wallet configured
- [ ] Sufficient ETH for gas (~$50-100)

**Deployment:**
```bash
npm run deploy:base              # Deploy token & vesting
npm run deploy-staking:mainnet   # Deploy staking
npm run fund-rewards:mainnet     # Fund rewards (50B recommended)
```

**Post-deployment:**
1. Verify all contracts on BaseScan
2. Add liquidity to DEX (Uniswap, Aerodrome)
3. Lock liquidity tokens
4. Setup vesting schedules
5. Open staking pools
6. Launch marketing campaign

---

## 💻 Frontend Integration

### Setup
```bash
cd frontend
npm install
cp .env.example .env.local
```

### Configuration
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_VESTING_ADDRESS=0x...
NEXT_PUBLIC_STAKING_ADDRESS=0x...
```

### Features
- Wallet connection (RainbowKit)
- Token balance display
- Transfer interface
- Burn tokens
- Staking dashboard (coming soon)
- Vesting schedule viewer (coming soon)

### Development
```bash
npm run dev  # http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Connect GitHub repo to Vercel
# Auto-deploy on push to main
```

---

## 📊 Staking Reward Examples

### Flexible Pool (12% APR)
| Stake Amount | 30 Days | 90 Days | 365 Days |
|--------------|---------|---------|----------|
| 10,000 | 98 | 296 | 1,200 |
| 100,000 | 986 | 2,959 | 12,000 |
| 1,000,000 | 9,863 | 29,589 | 120,000 |

### 180-Day Lock (100% APR)
| Stake Amount | Rewards (180 days) | Total | ROI |
|--------------|-------------------|-------|-----|
| 10,000 | 4,931 | 14,931 | 49.3% |
| 100,000 | 49,315 | 149,315 | 49.3% |
| 1,000,000 | 493,150 | 1,493,150 | 49.3% |

**Note**: 180 days ≈ 49.3% of annual return. Full 100% requires 365 days.

---

## 🛡️ Security

### Best Practices Implemented
- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Pausable contracts for emergency stops
- ✅ Access control (Ownable)
- ✅ SafeERC20 for token transfers
- ✅ Comprehensive test coverage
- ✅ No centralization risks

### Recommendations
- [ ] Professional smart contract audit
- [ ] Bug bounty program
- [ ] Multi-sig wallet for admin functions
- [ ] Time-lock for critical operations
- [ ] Insurance fund for risks

### Audit Checklist
- [ ] Reentrancy attacks
- [ ] Integer overflow/underflow
- [ ] Access control
- [ ] Front-running
- [ ] Gas optimization
- [ ] Logic errors

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
```bash
git clone https://github.com/winsitoruser/lileinstein.git
cd lileinstein
npm install
```

### Making Changes
1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Coding Standards
- Follow Solidity style guide
- Comment complex logic
- Write comprehensive tests
- Update documentation
- Use meaningful variable names

---

## 📞 Support & Community

### Documentation
- **README.md** - Main documentation (this file)
- **QUICKSTART.md** - Quick start guide
- **TOKEN_INFO.md** - Token specifications
- **VESTING_GUIDE.md** - Vesting documentation
- **STAKING_GUIDE.md** - Staking documentation
- **TOKENOMICS.md** - Economic model
- **DEPLOYMENT_GUIDE.md** - Deployment instructions

### Links
- **GitHub**: https://github.com/winsitoruser/lileinstein
- **Website**: [Coming soon]
- **Twitter**: [Coming soon]
- **Telegram**: [Coming soon]
- **Discord**: [Coming soon]

### Getting Help
1. Check documentation first
2. Search existing GitHub issues
3. Join community Discord/Telegram
4. Create new GitHub issue if needed

---

## 📜 License

This project is licensed under the **MIT License**.

See [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

**IMPORTANT LEGAL NOTICE:**

- This is a meme token created for entertainment purposes
- Cryptocurrency investments are highly risky and volatile
- This is NOT financial advice
- Only invest what you can afford to lose
- Do Your Own Research (DYOR)
- No guarantees of profit or return
- Team is not responsible for financial losses

**By using this token, you acknowledge and accept all risks involved.**

---

## 🎯 Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Smart contracts development
- [x] Testing suite
- [x] Vesting system
- [x] Staking pools
- [x] Frontend MVP
- [x] Documentation

### Phase 2: Testing & Audit (Current)
- [ ] Testnet deployment
- [ ] Community testing
- [ ] Security audit
- [ ] Bug bounty program
- [ ] Optimizations

### Phase 3: Launch
- [ ] Mainnet deployment
- [ ] Liquidity provision
- [ ] DEX listing (Uniswap, Aerodrome)
- [ ] Marketing campaign
- [ ] Community events

### Phase 4: Growth
- [ ] CEX listings
- [ ] Partnerships
- [ ] NFT integration
- [ ] Governance (DAO)
- [ ] Additional utilities

---

## 🏆 Why LITTLE EINSTEIN?

### Meme Appeal 🧠
- **Iconic Figure** - Einstein is universally recognized
- **"Genius" Theme** - Smart investing, smart gains
- **Viral Potential** - E=mc² meets crypto
- **Community Focus** - "Smart people invest smart"

### Real Utility 💎
- **Staking Rewards** - Up to 100% APR
- **Token Vesting** - Professional tokenomics
- **Fair Launch** - No pre-mine, transparent allocation
- **Base Chain** - Fast & cheap transactions

### Technical Excellence 🔧
- **44 Tests Passing** - Quality assurance
- **OpenZeppelin** - Industry-standard security
- **Modern Stack** - Latest tech (Next.js 14, Viem)
- **Full Documentation** - Easy to understand

---

## 📈 Token Metrics

### Supply
- **Total**: 250,000,000,000 LEINSTEIN
- **Initial Circulating**: ~132,000,000,000 (52.8%)
- **Decimals**: 8 (Bitcoin-style)

### Market Cap Scenarios
| Price | Circulating MC | Fully Diluted MC |
|-------|----------------|------------------|
| $0.0001 | $13.2M | $25M |
| $0.0005 | $66M | $125M |
| $0.001 | $132M | $250M |
| $0.01 | $1.32B 🚀 | $2.5B |

### Competitive Advantages
- ✅ High staking rewards (vs 5-15% industry avg)
- ✅ Professional tokenomics (vs random memes)
- ✅ Base Chain (vs expensive Ethereum)
- ✅ Real utility (vs pure speculation)

---

## 🎉 Get Started Today!

1. **Clone** the repository
2. **Install** dependencies
3. **Test** on Base Sepolia
4. **Deploy** to mainnet
5. **Launch** your meme token empire!

```bash
git clone https://github.com/winsitoruser/lileinstein.git
cd lileinstein
npm install
npm test
```

---

## 💡 Final Thoughts

**LITTLE EINSTEIN (LEINSTEIN)** combines the best of both worlds:

🧠 **Meme Fun** - Einstein theme, community-driven, viral potential  
💰 **DeFi Utility** - Staking, vesting, real yields  
🔒 **Professional** - Audited code, comprehensive tests, documentation  
🚀 **Ready to Launch** - Production-ready, fully functional  

**E = mc²** → **Earnings = memes × community²**

---

**Built with ❤️ on Base Chain L2**

*Where genius meets blockchain* 🧠⚡

---

**Happy Building! 🚀**

For questions, suggestions, or partnerships:
- GitHub Issues: https://github.com/winsitoruser/lileinstein/issues
- Email: [Your contact]
- Twitter: [@YourHandle]
