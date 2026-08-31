export enum EStakingNames {
  EULER = 'staking',
  PANCAKE = 'pancakeV2Liquidity',
}
export interface IAWS {
  region: string;
  cognito: {
    region: string;
    pool_id: string;
    client_id: string;
  };
}

export interface IURLS {
  api: string;
  private_api: string;
  ws: string;
  nft_api: string;
  directory_api: string;
  app: string;
}

export interface ISettingsDTO {
  aws: IAWS;
  gtm: {
    id: string;
  };
  urls: IURLS;
  external_links: { [key: string]: any };
  chain: { [key: string]: any };
  features: { [key: string]: boolean };
}

export interface ITVL {
  name: string;
  address: string;
}

export interface ITokenConfiguration {
  symbol: string;
  address: string;
  total_supply?: number;
  tvl?: ITVL[];
}

export interface IChain {
  chain_id: number;
  rpc: string;
  chain_token_address: string;
  chain_token_symbol: string;
  chain_token_name: string;
  chain_wrapper_token_address: string;
  chain_wrapper_token_symbol: string;
  tokens: Record<string, ITokenConfiguration>;
  company_wallet: string;
  products: {
    marketplace?: string;
    staking?: string;
    dex_agregator?: string;
    locked?: string;
    token?: string;
    locker?: string;
    manager_tax?: string;
  };
}
