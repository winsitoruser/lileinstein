# Deployment Guide 📘

Complete step-by-step guide for deploying your Base Chain Token.

## Prerequisites Checklist

- [ ] Node.js and npm installed
- [ ] MetaMask wallet installed
- [ ] Private key ready (never share this!)
- [ ] BaseScan API key (from https://basescan.org/myapikey)
- [ ] Testnet ETH on Base Sepolia (for testing)

## Step 1: Initial Setup

### 1.1 Install Dependencies

```bash
# In project root
npm install

# In frontend directory
cd frontend
npm install
cd ..
```

### 1.2 Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:

```env
# Your wallet private key (KEEP THIS SECRET!)
PRIVATE_KEY=your_private_key_here

# Optional: Custom RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# For contract verification
BASESCAN_API_KEY=your_basescan_api_key

# Token configuration
TOKEN_NAME=LITTLE EINSTEIN
TOKEN_SYMBOL=LEINSTEIN
INITIAL_SUPPLY=250000000000
TOKEN_DECIMALS=8
```

### 1.3 Get Your Private Key

**From MetaMask:**
1. Open MetaMask
2. Click three dots → Account details
3. Click "Export Private Key"
4. Enter password
5. Copy the private key

⚠️ **NEVER SHARE YOUR PRIVATE KEY!**

### 1.4 Get BaseScan API Key

1. Visit https://basescan.org/
2. Sign up for an account
3. Go to https://basescan.org/myapikey
4. Create a new API key
5. Copy and add to `.env`

## Step 2: Testing

### 2.1 Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 15 Solidity files successfully
```

### 2.2 Run Tests

```bash
npm test
```

All tests should pass:
```
✓ Should set the right token name and symbol
✓ Should transfer tokens between accounts
...
```

## Step 3: Deploy to Testnet

### 3.1 Get Testnet ETH

1. Visit Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your wallet
3. Request testnet ETH
4. Wait for confirmation

### 3.2 Deploy Contracts

```bash
npm run deploy:base-sepolia
```

Expected output:
```
🚀 Starting deployment on Base Chain...

📡 Network: base-sepolia (Chain ID: 84532)
👤 Deploying from: 0x...
💰 Account balance: 0.5 ETH

⏳ Deploying BaseToken contract...
✅ BaseToken deployed to: 0x...

⏳ Deploying TokenVesting contract...
✅ TokenVesting deployed to: 0x...

💾 Deployment info saved to: ./deployments/deployment-base-sepolia-1234567890.json
```

### 3.3 Save Deployment Addresses

Copy the contract addresses from the deployment output. You'll need them for:
- Contract verification
- Frontend configuration

## Step 4: Verify Contracts

### 4.1 Verify Token Contract

```bash
npx hardhat verify --network baseSepolia <TOKEN_ADDRESS> "LITTLE EINSTEIN" "LEINSTEIN" 250000000000 8
```

Replace `<TOKEN_ADDRESS>` with your deployed token address.

### 4.2 Verify Vesting Contract

```bash
npx hardhat verify --network baseSepolia <VESTING_ADDRESS> <TOKEN_ADDRESS>
```

Expected output:
```
Successfully verified contract on BaseScan.
https://sepolia.basescan.org/address/0x...#code
```

## Step 5: Configure Frontend

### 5.1 Get WalletConnect Project ID

1. Visit https://cloud.walletconnect.com
2. Sign up/Sign in
3. Create new project
4. Copy your Project ID

### 5.2 Update Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_TOKEN_ADDRESS=0x...  # Your deployed token address
NEXT_PUBLIC_VESTING_ADDRESS=0x...  # Your deployed vesting address
```

### 5.3 Test Frontend Locally

```bash
npm run dev
```

Visit http://localhost:3000

Test the following:
- [ ] Connect wallet
- [ ] View token balance
- [ ] Transfer tokens
- [ ] Burn tokens

## Step 6: Deploy to Mainnet (Production)

⚠️ **IMPORTANT: Only proceed when you're ready for production!**

### 6.1 Pre-deployment Checklist

- [ ] All tests passing
- [ ] Contracts verified on testnet
- [ ] Frontend tested thoroughly
- [ ] Security audit completed (recommended)
- [ ] Sufficient ETH for gas fees
- [ ] Token parameters finalized
- [ ] Team ready for launch

### 6.2 Update Configuration

Review your `.env` file and ensure token parameters are final:

```env
TOKEN_NAME=LITTLE EINSTEIN
TOKEN_SYMBOL=LEINSTEIN
INITIAL_SUPPLY=250000000000
TOKEN_DECIMALS=8
```

### 6.3 Deploy to Base Mainnet

```bash
npm run deploy:base
```

### 6.4 Verify on Mainnet

```bash
npx hardhat verify --network base <TOKEN_ADDRESS> "LITTLE EINSTEIN" "LEINSTEIN" 250000000000 8
npx hardhat verify --network base <VESTING_ADDRESS> <TOKEN_ADDRESS>
```

### 6.5 Update Frontend for Production

Update `frontend/.env.local` with mainnet addresses and redeploy.

## Step 7: Post-Deployment

### 7.1 Test on Mainnet

- [ ] Verify contract on BaseScan
- [ ] Test basic transfers
- [ ] Verify token appears in wallets
- [ ] Check frontend functionality

### 7.2 Add Token to MetaMask

1. Open MetaMask
2. Click "Import tokens"
3. Enter Token Contract Address
4. Symbol and decimals should auto-populate
5. Click "Add Custom Token"

### 7.3 Submit to Token Lists

Consider submitting your token to:
- CoinGecko
- CoinMarketCap
- Base token lists

## Troubleshooting

### "Insufficient funds" Error

- Check you have enough ETH for gas fees
- Gas fees vary; ensure you have 0.01+ ETH

### "Nonce too high" Error

- Reset MetaMask account: Settings → Advanced → Reset Account

### Contract Verification Failed

- Ensure constructor arguments match exactly
- Check Solidity version matches
- Verify on correct network

### Frontend Not Connecting

- Check WalletConnect Project ID
- Verify contract addresses
- Ensure correct network selected in wallet

## Gas Optimization Tips

1. Deploy during low network usage
2. Use recommended gas prices
3. Batch operations when possible
4. Consider deploying on testnet first

## Security Best Practices

1. **Never commit `.env` file to git**
2. **Keep private keys in secure location**
3. **Use hardware wallet for mainnet**
4. **Enable 2FA on all accounts**
5. **Regular security audits**
6. **Multi-signature wallets for ownership**

## Cost Estimation

**Testnet (Base Sepolia):**
- Free (testnet ETH)

**Mainnet (Base):**
- Token Contract: ~$5-15 (depends on gas)
- Vesting Contract: ~$10-20
- Contract Verification: Free
- Total: ~$15-35

*Prices are estimates and vary with ETH price and network congestion.*

## Next Steps After Deployment

1. **Marketing**: Announce your token
2. **Documentation**: Publish docs
3. **Community**: Build your community
4. **Listings**: Apply to exchanges
5. **Development**: Continue building features

## Support Resources

- [Base Documentation](https://docs.base.org/)
- [Hardhat Docs](https://hardhat.org/)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)
- [Base Discord](https://discord.gg/buildonbase)

## Emergency Procedures

### If You Need to Pause

The BaseToken contract is Ownable. As owner, you can:
- Stop minting
- Transfer ownership
- Execute emergency functions

### If Private Key Compromised

1. **Immediately** transfer all assets to new wallet
2. Transfer contract ownership
3. Notify community
4. Update all configurations

---

**Remember:** Take your time, test thoroughly, and never rush deployment to mainnet!

Good luck with your Base Chain Token deployment! 🚀
