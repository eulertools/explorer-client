import BigNumber from 'bignumber.js';

export const DEFAULT_LABEL = '--';

// Use this value to approve euler token to manipulate the user tokens in order to place them in the staking contract
export const VERY_BIG_UINT256 = '100000000000000000000000000000000000000000000000000000000000000000000000000000';

export const PID = 0;

export const BSC_BLOCKS_PER_DAY = 28800;

export const EULER_AIRDROP_MIN = 40000;

export enum EMetamaskErrors {
  USER_DENIED_TRANSACTION = 4001,
  INTERNAL_JSON_RPC_ERROR = -32603,
}

export interface IWeb3ContractsGrouped {
  token: any;
  staking: any;
  allowance: BigNumber;
  poolInfo: IPoolInfo;
  userInfo: IGetUserInfo;
  minDepositAmount: BigNumber;
  totalUsersStaking: string;
}

export interface IPoolInfo {
  accEulerPerShare: string;
  allocPoint: string;
  depositedAmount: string;
  lastRewardBlock: string;
  lockupDuration: string;
  rewardsAmount: string;
}

export interface IUserInfo {
  amount: string;
  rewardDebt: string;
  pendingRewards: string;
  lastClaim: string;
}

export interface IGetUserInfo {
  amount: string;
  pendingRewards: string;
  eulerPerBlock: string;
  tvl: string;
  withdrawAvaliable: string;
}

export interface IStakingDTO {
  pendingRewards: string;
  userInfo: IUserInfo;
}

export interface IWaultUserInfo {
  amount: BigNumber;
  lastClaim: Date;
  pendingRewards: BigNumber;
  rewardDebt: string;
}
