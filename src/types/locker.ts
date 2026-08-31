export interface LockToken {
  address: string;
  balance: number | string;
  deadline: number;
  identifier: string;
  locked: number | string;
  name: string;
  price_usd: number;
  symbol: string;
  total_usd: number;
}

export interface LockBalances {
  balance_usd: number;
  balance_bnb: number;
}

export interface LockContractResponse {
  0: string;
  1: string;
  deadline: string;
  amount: string;
}
