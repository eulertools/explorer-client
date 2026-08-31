import { Transaction } from 'src/types/blockchain';

export enum EPortfolioItemType {
  TRANSACTION = 'transaction',
  CONTRACT = 'contract',
  TOKEN = 'token',
  MARKET = 'market',
  ADDRESS = 'address',
  PAIR = 'pair',
}

export interface ITokenTransfer {
  token_address: string;
  from_address: string;
  to_address: string;
  value: string;
  log_index: number;
}

export interface ITransactionLog {
  log_index: number;
  address: string;
  topics: string[];
  data: string;
}

export interface ITransactionDetailsItem extends Transaction {
  tokens_transfers: ITokenTransfer[];
  logs: ITransactionLog[];
}
