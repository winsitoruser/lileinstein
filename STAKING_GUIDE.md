# 🎯 LITTLE EINSTEIN Staking Guide

Comprehensive guide untuk staking LEINSTEIN tokens dan earning rewards!

## 📊 Staking Overview

**LITTLE EINSTEIN (LEINSTEIN)** menawarkan **4 Staking Pools** dengan rewards bertingkat:

```
┌──────────────┬─────────┬─────────┬────────────────┐
│ Pool         │ APR     │ Lock    │ Min Stake      │
├──────────────┼─────────┼─────────┼────────────────┤
│ 🟢 Flexible  │ 12%     │ None    │ 1,000 tokens   │
│ 🟡 30-Day    │ 25%     │ 30 days │ 5,000 tokens   │
│ 🟠 90-Day    │ 50%     │ 90 days │ 10,000 tokens  │
│ 🔴 180-Day   │ 100%    │ 180 days│ 25,000 tokens  │
└──────────────┴─────────┴─────────┴────────────────┘
```

## 🌟 Key Features

### ✅ Multiple Pools
- **Flexible Pool**: Stake & unstake anytime with 12% APR
- **Locked Pools**: Higher APR for commitment (25%, 50%, 100%)

### ✅ Attractive Rewards
- Up to **100% APR** on 180-day pool
- **Double your tokens** in 6 months! (180-day lock)
- Rewards calculated per second for accuracy

### ✅ Flexible Management
- **Compound**: Reinvest rewards automatically
- **Claim**: Withdraw rewards without unstaking
- **Multiple Stakes**: Diversify across different pools

### ✅ Security Features
- **Audited Contract**: Battle-tested OpenZeppelin libraries
- **Emergency Withdraw**: Always get your funds back
- **Penalty System**: Fair 10% early withdrawal penalty
- **Pausable**: Admin can pause in emergencies

---

## 💰 How Staking Works

### 1. Choose Your Pool

**Flexible (12% APR)** 🟢
- ✅ No lock period
- ✅ Withdraw anytime
- ✅ Perfect for active traders
- ✅ Min: 1,000 LEINSTEIN

**30-Day Lock (25% APR)** 🟡
- ✅ 2x rewards vs Flexible
- ⏰ 30-day lock period
- ⚠️ 10% penalty if early withdrawal
- ✅ Min: 5,000 LEINSTEIN

**90-Day Lock (50% APR)** 🟠
- ✅ 4x rewards vs Flexible
- ⏰ 90-day lock period
- ⚠️ 10% penalty if early withdrawal
- ✅ Min: 10,000 LEINSTEIN

**180-Day Lock (100% APR)** 🔴
- ✅ 8x rewards vs Flexible
- ✅ **Double your tokens!**
- ⏰ 180-day lock period
- ⚠️ 10% penalty if early withdrawal
- ✅ Min: 25,000 LEINSTEIN

### 2. Stake Your Tokens

```javascript
// Example: Stake 10,000 LEINSTEIN in Flexible pool
1. Approve tokens
2. Call stake(10000 * 10^8, 0)  // 0 = Flexible
3. Start earning rewards immediately!
```

### 3. Earn Rewards

Rewards accrue **every second**:
- Flexible: ~0.0000038% per second
- 30-Day: ~0.0000079% per second
- 90-Day: ~0.0000158% per second
- 180-Day: ~0.0000317% per second

### 4. Claim or Compound

**Option A: Claim Rewards**
- Withdraw rewards to your wallet
- Keep your stake active
- Do this periodically

**Option B: Unstake Everything**
- Withdraw stake + rewards
- Close your position
- Must wait for lock period (if locked)

---

## 📈 Reward Calculator

### Example 1: Flexible Pool
**Stake**: 100,000 LEINSTEIN  
**APR**: 12%  
**Duration**: 90 days

**Rewards**: 100,000 × 12% × (90/365) = **2,959 LEINSTEIN**

### Example 2: 180-Day Lock
**Stake**: 100,000 LEINSTEIN  
**APR**: 100%  
**Duration**: 180 days

**Rewards**: 100,000 × 100% × (180/365) = **49,315 LEINSTEIN**

### Example 3: Multiple Stakes
**Stake 1**: 50,000 in Flexible (12% APR)  
**Stake 2**: 100,000 in 90-Day (50% APR)

**After 90 days:**
- Flexible: 50,000 × 12% × (90/365) = 1,479 LEINSTEIN
- 90-Day: 100,000 × 50% × (90/365) = 12,329 LEINSTEIN
- **Total**: 13,808 LEINSTEIN rewards

---

## 🎯 Staking Strategies

### Strategy 1: Safe & Steady (Conservative)
```
100% in Flexible Pool (12% APR)
- Full liquidity
- No lock risk
- Steady passive income
```

### Strategy 2: Balanced Growth (Moderate)
```
40% Flexible (12% APR)
60% 30-Day Lock (25% APR)
- Good liquidity
- Higher average APR (20%)
- Manageable lock periods
```

### Strategy 3: Maximum Gains (Aggressive)
```
20% Flexible (emergency fund)
30% 90-Day Lock (50% APR)
50% 180-Day Lock (100% APR)
- Highest returns
- 6-month commitment
- Average APR: ~75%
```

### Strategy 4: Ladder Approach (Recommended)
```
25% Flexible
25% 30-Day (expires month 1)
25% 90-Day (expires month 3)
25% 180-Day (expires month 6)
- Staggered unlocks
- Balanced risk/reward
- Flexible management
```

---

## 🚀 Quick Start Guide

### Step 1: Deploy Staking Contract
```bash
# Make sure TOKEN_ADDRESS is set in .env
npm run deploy-staking:sepolia  # Testnet
# or
npm run deploy-staking:mainnet  # Mainnet
```

### Step 2: Fund Reward Pool
```bash
# Add STAKING_ADDRESS to .env
# Set REWARD_POOL_AMOUNT (default: 50B)
npm run fund-rewards:sepolia
# or
npm run fund-rewards:mainnet
```

### Step 3: Start Staking!
Users can now stake via:
- Frontend dApp
- Direct contract interaction
- Web3 wallet

---

## 💻 Contract Interaction

### Stake Tokens
```javascript
// Approve first
await token.approve(stakingAddress, amount);

// Stake in desired pool
// 0=Flexible, 1=30Day, 2=90Day, 3=180Day
await staking.stake(amount, poolType);
```

### Check Rewards
```javascript
// Get pending rewards for specific stake
const rewards = await staking.calculateRewards(userAddress, stakeId);

// Get total rewards across all stakes
const totalRewards = await staking.getUserTotalRewards(userAddress);
```

### Claim Rewards
```javascript
// Claim rewards without unstaking
await staking.claimRewards(stakeId);
```

### Unstake
```javascript
// Unstake and claim all rewards
await staking.unstake(stakeId);
```

### Emergency Withdraw
```javascript
// Withdraw stake without rewards (penalty applies if locked)
await staking.emergencyWithdraw(stakeId);
```

---

## 🔒 Security & Penalties

### Early Withdrawal Penalty
**10% penalty** applies if you unstake before lock period ends:

**Example:**
- Stake: 100,000 LEINSTEIN in 90-Day pool
- Unstake after 45 days (early)
- Penalty: 10,000 LEINSTEIN (10%)
- Received: 90,000 LEINSTEIN + rewards

**Note:** 
- ✅ No penalty after lock period expires
- ✅ No penalty in Flexible pool (no lock)
- ⚠️ Penalty goes back to reward pool

### Emergency Withdraw
- Available anytime
- No rewards paid out
- Penalty still applies if locked
- Use only in emergencies

---

## 📊 Pool Statistics

### Check Pool Info
```javascript
const pool = await staking.pools(poolType);
// Returns: lockDuration, apr, totalStaked, minStake, active
```

### Global Statistics
```javascript
// Total number of stakers
const totalStakers = await staking.totalStakers();

// Total value locked (TVL)
const tvl = await staking.totalStakedGlobal();

// Total rewards distributed
const distributed = await staking.totalRewardsDistributed();
```

### Your Stakes
```javascript
// Get all your stakes
const stakes = await staking.getUserStakes(userAddress);

// Get total staked amount
const totalStaked = await staking.getUserTotalStaked(userAddress);

// Get total pending rewards
const totalRewards = await staking.getUserTotalRewards(userAddress);
```

---

## 🎨 Frontend Integration

Example React component for staking:

```typescript
import { useContractWrite, useContractRead } from 'wagmi';

function StakingInterface() {
  // Read pool info
  const { data: flexiblePool } = useContractRead({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [0], // Flexible pool
  });

  // Stake function
  const { write: stake } = useContractWrite({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'stake',
  });

  // Check rewards
  const { data: rewards } = useContractRead({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'calculateRewards',
    args: [userAddress, stakeId],
  });

  return (
    <div>
      <h2>Flexible Pool</h2>
      <p>APR: {flexiblePool.apr / 100}%</p>
      <button onClick={() => stake([amount, 0])}>
        Stake Now
      </button>
    </div>
  );
}
```

---

## 🛠️ Admin Functions

### Fund Reward Pool
```javascript
await staking.fundRewardPool(amount);
```

### Update Pool Configuration
```javascript
await staking.updatePool(
  poolType,
  lockDuration,
  apr,
  minStake,
  active
);
```

### Update Early Withdrawal Penalty
```javascript
await staking.updateEarlyWithdrawPenalty(penalty); // max 20%
```

### Pause/Unpause
```javascript
await staking.pause();   // Emergency stop
await staking.unpause(); // Resume operations
```

---

## 📊 Reward Pool Management

### Initial Allocation
For **250B total supply**, recommended allocation:
- **50B (20%)** → Reward Pool
- **75B (30%)** → Liquidity
- **75B (30%)** → Public Sale
- **50B (20%)** → Vesting (Team, Investors)

### Monitoring
```javascript
// Check reward pool balance
const balance = await staking.rewardPoolBalance();

// Calculate burn rate
const totalStaked = await staking.totalStakedGlobal();
const avgAPR = 0.50; // Assume 50% average
const annualRewards = totalStaked * avgAPR;
const monthlyBurn = annualRewards / 12;
```

### Refilling Strategy
- Monitor weekly
- Refill when <25% remaining
- Announce refills to community
- Transparent tracking on-chain

---

## 🎯 Best Practices

### For Users
1. ✅ Start with Flexible pool
2. ✅ Understand lock periods
3. ✅ Diversify across pools
4. ✅ Claim rewards regularly
5. ✅ Don't withdraw early from locked pools

### For Projects
1. ✅ Fund adequate reward pool
2. ✅ Monitor pool balances
3. ✅ Communicate APR sustainability
4. ✅ Be transparent about locks
5. ✅ Regular security audits

---

## ⚠️ Important Notes

### Risk Factors
- Smart contract risk
- APR sustainability depends on reward pool
- Lock periods are enforced
- Early withdrawal = 10% penalty
- Market volatility affects token value

### Recommendations
- Only stake what you can afford to lock
- Diversify your strategy
- Claim rewards periodically
- Keep some tokens in Flexible pool
- DYOR (Do Your Own Research)

---

## 🆘 Troubleshooting

### "Amount below minimum stake"
- Check min stake for pool
- Flexible: 1,000 tokens
- 30-Day: 5,000 tokens
- 90-Day: 10,000 tokens
- 180-Day: 25,000 tokens

### "No rewards to claim"
- Wait for rewards to accrue
- Minimum 1 day for meaningful rewards
- Check if stake is active

### "Insufficient reward pool"
- Contact project team
- Pool needs refilling
- Temporarily pause new stakes

### "Cannot unstake"
- Check if locked period expired
- Use emergencyWithdraw if needed
- Penalty applies if early

---

## 📞 Support

Need help with staking?
1. Read this guide thoroughly
2. Check contract on BaseScan
3. Join community Discord/Telegram
4. Contact team for issues

---

## 🎉 Start Earning Now!

**LITTLE EINSTEIN Staking** offers:
- 🎯 Up to 100% APR
- 🔒 Secure smart contracts
- 💰 Multiple earning strategies
- 🚀 Passive income potential

**Choose your pool and start staking today!** 🧠⚡

---

**Built on Base Chain L2**  
*E = mc² meets DeFi* 🧠💰
