import { AxiosResponse } from 'axios';

export interface IFromToken {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}

export interface IToToken {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}

export interface ISwapRoute {
  percentage: number;
  amountIn: number;
  pools: string[];
  amountOut: number;
  factoryLabel: string[];
  tokenLabel: string[];
}

export interface IDexRouterDTO {
  fromToken: IFromToken;
  toToken: IToToken;
  toTokenAmount: number;
  fromTokenAmount: number;
  protocols: ISwapRoute[];
  gasEstimation: string;
}

export interface ISwapToken {
  name: string;
  symbol: string;
  address: string;
  image?: string;
}

export type TBalanceAndInfo = [Promise<AxiosResponse>, Promise<string>];
