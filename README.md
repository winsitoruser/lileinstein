# LITTLE EINSTEIN (LEINSTEIN) 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Chain](https://img.shields.io/badge/Base-Chain-blue)](https://base.org)
[![Tests](https://img.shields.io/badge/Tests-24%20Passing-brightgreen)]()
[![GitHub](https://img.shields.io/badge/GitHub-lileinstein-black?logo=github)](https://github.com/winsitoruser/lileinstein)

A complete meme token implementation on Base Chain L2 with smart contracts, testing suite, and modern web interface.

**Token Details:**
- Name: LITTLE EINSTEIN
- Symbol: LEINSTEIN
- Total Supply: 250,000,000,000 (250 Billion)
- Decimals: 8

## 🌟 Features

- **ERC20 Token** - Full-featured token with minting, burning, and batch transfers
- **Token Vesting** - TGE 10% + Monthly 10% release schedule (customizable)
- **Modern Frontend** - Next.js 14 with TailwindCSS and RainbowKit
- **Base Chain L2** - Deployed on Base (Ethereum L2)
- **Testing Suite** - Comprehensive test coverage with Hardhat
- **Type-Safe** - TypeScript throughout

### 🔐 Vesting Schedule
- **TGE**: 10% immediately claimable
- **Monthly**: 10% release every 30 days
- **Duration**: 9 months (270 days)
- **Total**: 100% vested in 10 periods

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH (for testing)

## 🚀 Quick Start

**Ingin cepat? Lihat [QUICKSTART.md](QUICKSTART.md) untuk panduan singkat!**

Untuk dokumentasi lengkap dan detail, lanjutkan membaca di bawah.

### 1. Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# - Add your private key
# - Add BaseScan API key (for verification)
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy to Base Sepolia (Testnet)

```bash
npm run deploy:base-sepolia
```

### 5. Setup Token Vesting (Optional)

```bash
# Edit scripts/setup-vesting.js with beneficiary addresses
# Add TOKEN_ADDRESS and VESTING_ADDRESS to .env

npm run setup-vesting:sepolia  # for testnet
# or
npm run setup-vesting:mainnet  # for mainnet
```

See [VESTING_GUIDE.md](VESTING_GUIDE.md) for complete vesting documentation.

### 6. Launch Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with deployed contract addresses
npm run dev
```

Visit `http://localhost:3000` to see your dApp!

## 📁 Project Structure

```
EINSTEINCHAIN/
├── contracts/              # Solidity smart contracts
│   ├── BaseToken.sol      # ERC20 token implementation
│   └── TokenVesting.sol   # Vesting contract
├── scripts/               # Deployment scripts
│   └── deploy.js         # Main deployment script
├── test/                  # Test files
│   ├── BaseToken.test.js
│   └── TokenVesting.test.js
├── frontend/              # Next.js frontend
│   ├── app/              # App router pages
│   ├── lib/              # Utilities and configs
│   └── public/           # Static assets
├── deployments/          # Deployment artifacts (generated)
├── hardhat.config.js     # Hardhat configuration
└── package.json          # Dependencies
```

## 🔧 Smart Contracts

### BaseToken.sol

ERC20 token with additional features:

- **Mintable** - Owner can mint new tokens
- **Burnable** - Token holders can burn their tokens
- **Batch Transfer** - Send to multiple addresses in one transaction
- **ERC20Permit** - Gasless approvals via signatures

### TokenVesting.sol

Time-locked token vesting with:

- **Cliff Period** - Initial lock period
- **Linear Vesting** - Gradual release over time
- **Revocable** - Optional revocation by owner
- **Multiple Schedules** - Support for multiple beneficiaries

## 📝 Deployment

### Local Network

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

### Base Sepolia Testnet

1. Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Configure `.env` with your private key
3. Deploy:

```bash
npm run deploy:base-sepolia
```

### Base Mainnet

```bash
# IMPORTANT: Double-check configuration before deploying to mainnet!
npm run deploy:base
```

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run specific test file:

```bash
npx hardhat test test/BaseToken.test.js
```

Run with coverage:

```bash
npx hardhat coverage
```

## 🔍 Contract Verification

After deployment, verify on BaseScan:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:

```bash
npx hardhat verify --network baseSepolia 0x123... "TokenName" "SYMBOL" 1000000 18
```

## 🎨 Frontend

The frontend is built with:

- **Next.js 14** - React framework
- **TailwindCSS** - Styling
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum hooks
- **Viem** - Ethereum utilities

### Features

- Connect wallet with RainbowKit
- View token balance and info
- Transfer tokens
- Burn tokens
- Batch transfers
- View on BaseScan

### Configuration

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_VESTING_ADDRESS=0x...
```

Get WalletConnect Project ID: https://cloud.walletconnect.com

## 🌐 Networks

### Base Sepolia (Testnet)
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### Base Mainnet
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

## 📚 Useful Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet
npm run deploy:base-sepolia

# Deploy to mainnet
npm run deploy:base

# Verify contract
npm run verify

# Start frontend
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## 🔐 Security

- Never commit your `.env` file
- Keep your private keys secure
- Audit contracts before mainnet deployment
- Test thoroughly on testnet first
- Consider professional security audit for production

## 📖 Resources

- [Base Docs](https://docs.base.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Next.js Docs](https://nextjs.org/docs)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always perform thorough testing before deploying to mainnet.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Base Chain documentation

---

Built with ❤️ on Base Chain L2
