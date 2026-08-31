interface IExtra {
  lpAddress: string;
  transactionToken: string;
  transactionAddress: string;
}

export interface ITvl {
  amount: number;
  usd?: number;
}

export interface IYieldInfo {
  apy: number;
}

export interface IFarm {
  id: string;
  name: string;
  provider: string;
  has_details: boolean;
  extra: IExtra;
  earns: string[];
  link: string;
  tvl: ITvl;
  yield: IYieldInfo;
}

interface IYieldRewardDepositInfo {
  symbol: string;
  amount: number;
  usd: number;
}

export interface ITopLevelFarm {
  deposit: IYieldRewardDepositInfo;
  farm: IFarm;
  rewards?: IYieldRewardDepositInfo[];
  icon?: string;
  farm_rewards?: number;
}

export interface IPlatform {
  id: string;
  label: string;
  url: string;
  icon: string;
  token: string;
  name: string;
  farms: ITopLevelFarm[];
  rewards: IYieldRewardDepositInfo[];
  rewards_total: number;
  usd: number;
}

export interface IYieldWallet {
  amount: number;
  symbol: string;
  token: string;
  usd: number;
}

export interface IYieldBalance {
  usd: number;
  token: string;
  contract: string;
  balance: number;
}

// All farms info per wallet
export interface IFarmsByWalletDTO {
  platforms: { [key: string]: ITopLevelFarm[] };
  wallet: IYieldWallet[];
  balances: IYieldBalance[];
}

// Single yield farm
export interface IAddressFarmYieldDTO {
  [key: string]: ITopLevelFarm[];
}

// All Farms
interface IFarmExtra {
  lpAddress: string;
  transactionToken: string;
  transactionAddress: string;
  pricePerFullShare?: number;
}
export interface IFarmsDTO {
  id: string;
  name: string;
  token: string;
  provider: string;
  link: string;
  has_details: boolean;
  extra: IFarmExtra;
  earns: string[];
  tvl: ITvl;
  yield?: IYieldInfo;
}
