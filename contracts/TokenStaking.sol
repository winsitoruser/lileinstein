// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TokenStaking
 * @dev Multi-tier staking contract for LITTLE EINSTEIN (LEINSTEIN) token
 * 
 * Features:
 * - Multiple staking pools (Flexible, 30 days, 90 days, 180 days)
 * - Different APY rewards based on lock period
 * - Compound rewards automatically
 * - Early withdrawal penalty for locked staking
 * - Emergency withdraw function
 */
contract TokenStaking is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    
    // Staking pool types
    enum PoolType { FLEXIBLE, LOCK_30, LOCK_90, LOCK_180 }
    
    // Staking pool configuration
    struct Pool {
        uint256 lockDuration;      // Lock duration in seconds
        uint256 apr;               // Annual Percentage Rate (basis points, e.g., 1000 = 10%)
        uint256 totalStaked;       // Total tokens staked in this pool
        uint256 minStake;          // Minimum stake amount
        bool active;               // Pool active status
    }
    
    // User staking info
    struct Stake {
        uint256 amount;            // Staked amount
        uint256 startTime;         // Stake start timestamp
        uint256 lastClaimTime;     // Last reward claim timestamp
        uint256 accumulatedRewards; // Accumulated unclaimed rewards
        PoolType poolType;         // Pool type
    }
    
    // Pools configuration
    mapping(PoolType => Pool) public pools;
    
    // User stakes: user => stakeId => Stake
    mapping(address => mapping(uint256 => Stake)) public userStakes;
    mapping(address => uint256) public userStakeCount;
    
    // Statistics
    uint256 public totalStakers;
    uint256 public totalStakedGlobal;
    uint256 public totalRewardsDistributed;
    mapping(address => bool) public hasStaked;
    
    // Constants
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public earlyWithdrawPenalty = 1000; // 10% penalty (basis points)
    
    // Reward pool
    uint256 public rewardPoolBalance;
    
    // Events
    event Staked(address indexed user, uint256 stakeId, uint256 amount, PoolType poolType);
    event Unstaked(address indexed user, uint256 stakeId, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 stakeId, uint256 reward);
    event RewardPoolFunded(uint256 amount);
    event PoolUpdated(PoolType poolType, uint256 lockDuration, uint256 apr, uint256 minStake);
    event EmergencyWithdraw(address indexed user, uint256 stakeId, uint256 amount);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        
        // Initialize pools with attractive APRs
        // Flexible: 12% APR, no lock
        pools[PoolType.FLEXIBLE] = Pool({
            lockDuration: 0,
            apr: 1200,  // 12%
            totalStaked: 0,
            minStake: 1000 * 10**8,  // 1,000 LEINSTEIN (8 decimals)
            active: true
        });
        
        // 30 days: 25% APR
        pools[PoolType.LOCK_30] = Pool({
            lockDuration: 30 days,
            apr: 2500,  // 25%
            totalStaked: 0,
            minStake: 5000 * 10**8,  // 5,000 LEINSTEIN
            active: true
        });
        
        // 90 days: 50% APR
        pools[PoolType.LOCK_90] = Pool({
            lockDuration: 90 days,
            apr: 5000,  // 50%
            totalStaked: 0,
            minStake: 10000 * 10**8,  // 10,000 LEINSTEIN
            active: true
        });
        
        // 180 days: 100% APR (Double your tokens in 6 months!)
        pools[PoolType.LOCK_180] = Pool({
            lockDuration: 180 days,
            apr: 10000,  // 100%
            totalStaked: 0,
            minStake: 25000 * 10**8,  // 25,000 LEINSTEIN
            active: true
        });
    }
    
    /**
     * @dev Stake tokens in a specific pool
     */
    function stake(uint256 _amount, PoolType _poolType) external nonReentrant whenNotPaused {
        Pool storage pool = pools[_poolType];
        require(pool.active, "Pool not active");
        require(_amount >= pool.minStake, "Amount below minimum stake");
        require(_amount > 0, "Cannot stake 0");
        
        // Transfer tokens from user
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Track new staker
        if (!hasStaked[msg.sender]) {
            hasStaked[msg.sender] = true;
            totalStakers++;
        }
        
        // Create stake
        uint256 stakeId = userStakeCount[msg.sender];
        userStakes[msg.sender][stakeId] = Stake({
            amount: _amount,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            accumulatedRewards: 0,
            poolType: _poolType
        });
        
        userStakeCount[msg.sender]++;
        pool.totalStaked += _amount;
        totalStakedGlobal += _amount;
        
        emit Staked(msg.sender, stakeId, _amount, _poolType);
    }
    
    /**
     * @dev Calculate pending rewards for a stake
     */
    function calculateRewards(address _user, uint256 _stakeId) public view returns (uint256) {
        Stake storage userStake = userStakes[_user][_stakeId];
        if (userStake.amount == 0) return 0;
        
        Pool storage pool = pools[userStake.poolType];
        uint256 stakingDuration = block.timestamp - userStake.lastClaimTime;
        
        // Calculate rewards: (amount * apr * duration) / (BASIS_POINTS * SECONDS_PER_YEAR)
        uint256 rewards = (userStake.amount * pool.apr * stakingDuration) / (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return rewards + userStake.accumulatedRewards;
    }
    
    /**
     * @dev Claim rewards without unstaking
     */
    function claimRewards(uint256 _stakeId) external nonReentrant {
        Stake storage userStake = userStakes[msg.sender][_stakeId];
        require(userStake.amount > 0, "No active stake");
        
        uint256 rewards = calculateRewards(msg.sender, _stakeId);
        require(rewards > 0, "No rewards to claim");
        require(rewardPoolBalance >= rewards, "Insufficient reward pool");
        
        // Update stake
        userStake.lastClaimTime = block.timestamp;
        userStake.accumulatedRewards = 0;
        
        // Transfer rewards
        rewardPoolBalance -= rewards;
        totalRewardsDistributed += rewards;
        stakingToken.safeTransfer(msg.sender, rewards);
        
        emit RewardClaimed(msg.sender, _stakeId, rewards);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake(uint256 _stakeId) external nonReentrant {
        Stake storage userStake = userStakes[msg.sender][_stakeId];
        require(userStake.amount > 0, "No active stake");
        
        Pool storage pool = pools[userStake.poolType];
        uint256 amount = userStake.amount;
        uint256 rewards = calculateRewards(msg.sender, _stakeId);
        
        // Check lock period
        bool isLocked = block.timestamp < userStake.startTime + pool.lockDuration;
        uint256 penalty = 0;
        
        if (isLocked && pool.lockDuration > 0) {
            // Apply early withdrawal penalty
            penalty = (amount * earlyWithdrawPenalty) / BASIS_POINTS;
            amount -= penalty;
            // Penalty goes to reward pool
            rewardPoolBalance += penalty;
        }
        
        // Ensure sufficient reward pool
        if (rewards > rewardPoolBalance) {
            rewards = rewardPoolBalance;
        }
        
        // Update pool stats
        pool.totalStaked -= userStake.amount;
        totalStakedGlobal -= userStake.amount;
        
        // Clear stake
        delete userStakes[msg.sender][_stakeId];
        
        // Transfer tokens and rewards
        uint256 totalPayout = amount + rewards;
        if (rewards > 0) {
            rewardPoolBalance -= rewards;
            totalRewardsDistributed += rewards;
        }
        
        stakingToken.safeTransfer(msg.sender, totalPayout);
        
        emit Unstaked(msg.sender, _stakeId, amount, rewards);
    }
    
    /**
     * @dev Emergency withdraw without rewards (still applies penalty if locked)
     */
    function emergencyWithdraw(uint256 _stakeId) external nonReentrant {
        Stake storage userStake = userStakes[msg.sender][_stakeId];
        require(userStake.amount > 0, "No active stake");
        
        Pool storage pool = pools[userStake.poolType];
        uint256 amount = userStake.amount;
        
        // Check lock period and apply penalty
        bool isLocked = block.timestamp < userStake.startTime + pool.lockDuration;
        uint256 penalty = 0;
        
        if (isLocked && pool.lockDuration > 0) {
            penalty = (amount * earlyWithdrawPenalty) / BASIS_POINTS;
            amount -= penalty;
            rewardPoolBalance += penalty;
        }
        
        // Update pool stats
        pool.totalStaked -= userStake.amount;
        totalStakedGlobal -= userStake.amount;
        
        // Clear stake
        delete userStakes[msg.sender][_stakeId];
        
        // Transfer tokens (no rewards)
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, _stakeId, amount);
    }
    
    /**
     * @dev Get all stakes for a user
     */
    function getUserStakes(address _user) external view returns (Stake[] memory) {
        uint256 count = userStakeCount[_user];
        Stake[] memory stakes = new Stake[](count);
        
        for (uint256 i = 0; i < count; i++) {
            stakes[i] = userStakes[_user][i];
        }
        
        return stakes;
    }
    
    /**
     * @dev Get user total staked amount
     */
    function getUserTotalStaked(address _user) external view returns (uint256) {
        uint256 total = 0;
        uint256 count = userStakeCount[_user];
        
        for (uint256 i = 0; i < count; i++) {
            total += userStakes[_user][i].amount;
        }
        
        return total;
    }
    
    /**
     * @dev Get user total pending rewards
     */
    function getUserTotalRewards(address _user) external view returns (uint256) {
        uint256 total = 0;
        uint256 count = userStakeCount[_user];
        
        for (uint256 i = 0; i < count; i++) {
            if (userStakes[_user][i].amount > 0) {
                total += calculateRewards(_user, i);
            }
        }
        
        return total;
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @dev Fund reward pool (Owner only)
     */
    function fundRewardPool(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        rewardPoolBalance += _amount;
        emit RewardPoolFunded(_amount);
    }
    
    /**
     * @dev Update pool configuration (Owner only)
     */
    function updatePool(
        PoolType _poolType,
        uint256 _lockDuration,
        uint256 _apr,
        uint256 _minStake,
        bool _active
    ) external onlyOwner {
        Pool storage pool = pools[_poolType];
        pool.lockDuration = _lockDuration;
        pool.apr = _apr;
        pool.minStake = _minStake;
        pool.active = _active;
        
        emit PoolUpdated(_poolType, _lockDuration, _apr, _minStake);
    }
    
    /**
     * @dev Update early withdrawal penalty (Owner only)
     */
    function updateEarlyWithdrawPenalty(uint256 _penalty) external onlyOwner {
        require(_penalty <= 2000, "Penalty too high"); // Max 20%
        earlyWithdrawPenalty = _penalty;
    }
    
    /**
     * @dev Pause staking (Owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause staking (Owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw excess tokens (Owner only) - Emergency only
     */
    function withdrawExcess(uint256 _amount) external onlyOwner {
        uint256 contractBalance = stakingToken.balanceOf(address(this));
        uint256 requiredBalance = totalStakedGlobal + rewardPoolBalance;
        uint256 excess = contractBalance - requiredBalance;
        
        require(_amount <= excess, "Cannot withdraw staked or reward tokens");
        stakingToken.safeTransfer(msg.sender, _amount);
    }
}
