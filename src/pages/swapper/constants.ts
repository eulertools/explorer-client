import { ISwapToken } from './types';

export const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
];

export const UNKNOWN_LABEL = '--';

export enum EDEXContrarError {
  PATH_ZERO = 'PATH_ZERO',
  INVALID_PATH = 'INVALID_PATH',
  UNDEFINED_PROXY = 'UNDEFINED_PROXY',
  INSUFFICIENT_INPUT_AMOUNT = 'INSUFFICIENT_INPUT_AMOUNT',
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',
  EXPIRED_TIMEOUT = 'EXPIRED_TIMEOUT',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  SUBSCRIPTION_ADDRESS_ZERO = 'SUBSCRIPTION_ADDRESS_ZERO',
  WRONG_INPUT_ETH = 'WRONG_INPUT_ETH',
  INSUFFICIENT_OUTPUT_AMOUNT = 'INSUFFICIENT_OUTPUT_AMOUNT',
  ETH_TRANSFER_FAILED = 'INSUFFICIENT_OUTPUT_AMOUNT',
}

// NULL Address
export const NETWORK_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const BNB_TOKEN_INFO = {
  name: 'BNB',
  symbol: 'BNB',
  address: NETWORK_TOKEN_ADDRESS,
};

export const baseTokenList: ISwapToken[] = [
  {
    name: 'Euler Tools',
    symbol: 'EULER',
    address: '0x3920123482070C1a2dff73AaD695c60e7c6F6862',
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
  {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  BNB_TOKEN_INFO,
  {
    name: 'Tether',
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  },
  {
    name: 'ApeSwap',
    symbol: 'BANANA',
    address: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
  },
  {
    name: 'PancakeSwap',
    symbol: 'CAKE',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  },
];
