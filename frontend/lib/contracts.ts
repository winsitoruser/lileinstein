export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x...'
export const VESTING_ADDRESS = process.env.NEXT_PUBLIC_VESTING_ADDRESS || '0x...'

export const TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function batchTransfer(address[] recipients, uint256[] amounts) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const

export const VESTING_ABI = [
  'function createVestingSchedule(address beneficiary, uint256 totalAmount, uint256 startTime, uint256 cliffDuration, uint256 duration, bool revocable)',
  'function release()',
  'function revoke(address beneficiary)',
  'function getReleasableAmount(address beneficiary) view returns (uint256)',
  'function getVestedAmount(address beneficiary) view returns (uint256)',
  'function vestingSchedules(address) view returns (uint256 totalAmount, uint256 releasedAmount, uint256 startTime, uint256 cliffDuration, uint256 duration, bool revocable, bool revoked)',
  'event VestingScheduleCreated(address indexed beneficiary, uint256 totalAmount, uint256 startTime, uint256 cliffDuration, uint256 duration)',
  'event TokensReleased(address indexed beneficiary, uint256 amount)',
  'event VestingRevoked(address indexed beneficiary)',
] as const
