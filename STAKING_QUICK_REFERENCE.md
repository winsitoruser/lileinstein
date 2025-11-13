# 🎯 Staking Quick Reference - LEINSTEIN

## 📊 Pool Comparison

```
┌────────────┬─────┬─────────┬──────────┬─────────────┐
│ Pool       │ APR │ Lock    │ Min      │ Best For    │
├────────────┼─────┼─────────┼──────────┼─────────────┤
│ 🟢 Flexible│ 12% │ None    │ 1K       │ Liquidity   │
│ 🟡 30-Day  │ 25% │ 30 days │ 5K       │ Short-term  │
│ 🟠 90-Day  │ 50% │ 90 days │ 10K      │ Medium-term │
│ 🔴 180-Day │100% │ 180 days│ 25K      │ Max gains   │
└────────────┴─────┴─────────┴──────────┴─────────────┘
```

---

## 🚀 3-Step Setup

### 1️⃣ Deploy
```bash
npm run deploy-staking:sepolia
```

### 2️⃣ Fund Rewards
```bash
npm run fund-rewards:sepolia
```

### 3️⃣ Start Earning!
Users stake → Earn rewards → Claim anytime

---

## 💰 Reward Examples

### Flexible Pool (12% APR)
| Stake    | 30 Days | 90 Days | 365 Days |
|----------|---------|---------|----------|
| 10K      | 98      | 296     | 1,200    |
| 100K     | 986     | 2,959   | 12,000   |
| 1M       | 9,863   | 29,589  | 120,000  |

### 180-Day Lock (100% APR)
| Stake    | 180 Days | ROI     |
|----------|----------|---------|
| 10K      | 4,931    | 49.3%   |
| 100K     | 49,315   | 49.3%   |
| 1M       | 493,150  | 49.3%   |

**Note:** 180 days = 49.3% return, not full 100% (need full year)

---

## 📝 Key Commands

```bash
# Deploy staking
npm run deploy-staking:sepolia

# Fund reward pool
npm run fund-rewards:sepolia

# Run staking tests
npm test test/TokenStaking.test.js

# Verify contract
npx hardhat verify --network baseSepolia <ADDRESS> <TOKEN_ADDRESS>
```

---

## 🎯 Popular Strategies

### 🟢 Conservative (Low Risk)
```
100% Flexible → 12% APR
Full liquidity, withdraw anytime
```

### 🟡 Balanced (Medium Risk)
```
50% Flexible → 6% avg
50% 30-Day → 12.5% avg
Total: ~18.5% APR
```

### 🔴 Aggressive (High Reward)
```
20% Flexible → 2.4% avg
30% 90-Day → 15% avg
50% 180-Day → 50% avg
Total: ~67.4% APR
```

---

## ⚠️ Important Rules

### ✅ Allowed
- Multiple stakes per wallet
- Stake more anytime
- Claim rewards anytime
- Mix different pools

### ⚠️ Watch Out
- **10% penalty** if early withdrawal (locked pools)
- **Minimum stakes**: 1K, 5K, 10K, 25K
- **Lock periods enforced**: Can't bypass
- **Reward pool limit**: Check before staking

### 🚫 Not Allowed
- Can't modify stake after creation
- Can't transfer stake to others
- Can't change pool type

---

## 💻 Smart Contract Functions

### For Users
```solidity
stake(amount, poolType)           // Create new stake
claimRewards(stakeId)             // Claim without unstaking
unstake(stakeId)                  // Withdraw stake + rewards
emergencyWithdraw(stakeId)        // Emergency only, no rewards

// Read-only
calculateRewards(user, stakeId)   // Check pending rewards
getUserStakes(user)               // Get all stakes
getUserTotalStaked(user)          // Total staked
getUserTotalRewards(user)         // Total rewards
```

### For Admin
```solidity
fundRewardPool(amount)            // Add rewards
updatePool(...)                   // Change pool config
updateEarlyWithdrawPenalty(...)   // Change penalty
pause() / unpause()               // Emergency controls
```

---

## 🔢 Pool Type IDs

```
0 = Flexible
1 = 30-Day Lock
2 = 90-Day Lock
3 = 180-Day Lock
```

---

## 📊 Monitoring

```javascript
// TVL (Total Value Locked)
totalStakedGlobal()

// Reward pool health
rewardPoolBalance()

// Number of stakers
totalStakers()

// Rewards paid out
totalRewardsDistributed()
```

---

## 🎨 Frontend Example

```typescript
// Check if can claim
const rewards = await staking.calculateRewards(user, stakeId);
if (rewards > 0) {
  await staking.claimRewards(stakeId);
}

// Create new stake
await token.approve(stakingAddress, amount);
await staking.stake(amount, 0); // 0 = Flexible
```

---

## 💡 Pro Tips

1. **Start Small**: Test with Flexible pool first
2. **Diversify**: Don't put all in one pool
3. **Ladder Strategy**: Stagger unlock dates
4. **Claim Often**: Compound or withdraw regularly
5. **Emergency Fund**: Keep some in Flexible
6. **Monitor APR**: Check reward pool sustainability
7. **Long-term Thinking**: 180-day = best returns

---

## 🆘 Quick Fixes

**Can't stake?**
→ Check minimum stake amount
→ Approve tokens first
→ Ensure pool is active

**No rewards?**
→ Wait at least 1 day
→ Check reward pool balance
→ Verify stake is active

**Early withdrawal?**
→ 10% penalty applies
→ Wait for lock to expire
→ Or use emergencyWithdraw

**Want to exit fast?**
→ Flexible pool = instant
→ Locked pool = wait or pay penalty
→ Emergency withdraw available

---

## 📈 APR Comparison

**DeFi Average**: 5-15%  
**LEINSTEIN Flexible**: **12%** ✅  
**LEINSTEIN 30-Day**: **25%** 🔥  
**LEINSTEIN 90-Day**: **50%** 🔥🔥  
**LEINSTEIN 180-Day**: **100%** 🚀🚀🚀  

**Highly competitive rates!**

---

## 🎯 Ideal Allocation (250B Supply)

```
50B (20%) → Staking Rewards 🎯
75B (30%) → Liquidity Pool 💧
75B (30%) → Public Sale 🌍
50B (20%) → Vesting 🔐
```

---

## ⏰ Timeline Example

**Start**: Stake 100K in 180-Day pool

```
Day 0:   Stake 100K
Day 30:  Earned ~8,219 tokens
Day 60:  Earned ~16,438 tokens  
Day 90:  Earned ~24,657 tokens (can unstake other pools)
Day 120: Earned ~32,876 tokens
Day 150: Earned ~41,095 tokens
Day 180: Earned ~49,315 tokens ✅ Unlock!

Total: 149,315 tokens (49.3% gain!)
```

---

## 🎉 Ready to Stake?

1. Choose your pool
2. Approve tokens
3. Stake and earn
4. Claim rewards
5. Repeat! 🔄

**Happy Staking!** 🧠⚡💰

---

**LITTLE EINSTEIN (LEINSTEIN)**  
*Stake Smart, Earn More* 🎯
