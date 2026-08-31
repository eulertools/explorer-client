import { EChainIds } from 'src/hooks/useMetamaskAccount';

export interface Account {
  id: string;
  address: string;
  nameTag: string;
  balance: number;
  percentage: number;
  txnCount: number;
}

export interface Transaction {
  hash: string;
  status: number;
  block_number: number;
  block_timestamp: number;
  from: string;
  to: string;
  value: string;
  gas: string;
  gas_limit: number;
  gas_used: number;
  gas_price: string;
  nonce: number;
  input: string;
  methodID: string;
  transaction_index?: string;
  receipt_cumulative_gas_used?: string;
  receipt_contract_address?: string;
  receipt_root?: string;
  receipt_status?: string;
  block_hash?: string;
}

export interface PairTransaction {
  address: string;
  base_in: string;
  base_out: string;
  base_token: string;
  block_number: string;
  block_timestamp: string;
  log_index: string;
  price_base: string;
  price_bnb: string;
  price_usd: string;
  quote_in: string;
  quote_out: string;
  quote_token: string;
  transaction_hash: string;
  volume: string;
  base_price_usd: string;
  quote_price_usd: string;
  ratio: string;
}

export interface TokenTransaction {
  block_hash: string;
  block_number: string;
  block_timestamp: string;
  from_address: string;
  log_index: string;
  to_address: string;
  token_address: string;
  value: string;
  transaction_hash: string;
}

export interface Token {
  id: string;
  tokenName: string;
  address: string;
  logo: string;
  symbol: string;
  quantity: number;
  tokenPrice: number;
  change: number;
  valueInBNB: number;
  valueInUSD: number;
}

export interface InternalTxn {
  id: string;
  parentTxnHash: string;
  block: number;
  age: Date;
  from: string;
  to: string;
  value: number;
}

export interface Bep20TokenTxn {
  id: string;
  txnHash: string;
  age: Date;
  from: string;
  to: string;
  value: number;
  token: string;
  logo: string;
}

export interface IBlock {
  number: number;
  hash: string;
  parent_hash: string;
  nonce: string;
  sha3_uncles: string;
  miner: string;
  difficulty: string;
  total_difficulty: string;
  size: number;
  extra_data: string;
  gas_limit: number;
  gas_used: number;
  timestamp: number;
  transactions: string[];
}

export enum ESupportedNetworks {
  BNB = 'bsc',
  BNBTEST = 'bsctest',
  ETHEREUM = 'eth',
  POLYGON = 'polygon',
}

export const settingsSupportedNetworks = [
  {
    value: ESupportedNetworks.BNB,
    label: 'Build and Build',
    shortLabel: 'BNB',
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/bnb.png`,
  },
  {
    value: ESupportedNetworks.ETHEREUM,
    label: 'Ethereum',
    shortLabel: 'ETH',
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/eth.png`,
  },
  {
    value: ESupportedNetworks.POLYGON,
    label: 'Polygon',
    shortLabel: 'POLYGON',
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/polygon.png`,
  },
];

export const networkToChainIdMap = Object.freeze({
  [ESupportedNetworks.ETHEREUM]: 1,
  [ESupportedNetworks.BNB]: 56,
  [ESupportedNetworks.BNBTEST]: 97,
  [ESupportedNetworks.POLYGON]: 137,
});

export interface ISupportedChainsInfo {
  chainId: EChainIds;
  chainHex: string;
  chainName: string;
  rpcUrl: string;
  symbol: string;
  explorer: string;
  value: ESupportedNetworks;
  decimals: number;
  iconSrc: string;
}

export const supportedChains: ISupportedChainsInfo[] = [
  {
    chainId: EChainIds.ETH_MAINNET,
    chainHex: '0x01',
    chainName: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    value: ESupportedNetworks.ETHEREUM,
    decimals: 18,
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/eth.png`,
  },
  {
    chainId: EChainIds.BSC_MAINNET,
    chainHex: '0x38',
    chainName: 'Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    value: ESupportedNetworks.BNB,
    decimals: 18,
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/bnbwhite.svg`,
  },
  {
    chainId: EChainIds.BSC_TESTNET,
    chainHex: '0x61',
    chainName: 'BSC Testnet',
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    symbol: 'BNB',
    explorer: 'https://testnet.bscscan.com',
    value: ESupportedNetworks.BNBTEST,
    decimals: 18,
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/bnbwhite.svg`,
  },
  {
    chainId: EChainIds.POLYGON,
    chainHex: '0x89',
    chainName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com/',
    value: ESupportedNetworks.POLYGON,
    decimals: 6,
    iconSrc: `${process.env.REACT_APP_ASSETS_URL}/networks/polygon.svg`,
  },
];
