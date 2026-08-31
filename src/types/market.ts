export interface IMarketCreator {
  address: string;
  balance: number;
  percent: number;
}

export interface IMarketOwner {
  balance: number;
  change_balance: number;
  percent: number;
}

export interface IMarketSecurity {
  buy_tax: number;
  can_take_back_ownership: boolean;
  cannot_buy: boolean;
  cannot_sell_all: boolean;
  creator: IMarketCreator;
  external_call: boolean;
  hidden_owner: boolean;
  is_anti_whale: boolean;
  is_blacklisted: boolean;
  is_honeypot: boolean;
  is_in_dex: boolean;
  is_mintable: boolean;
  is_open_source: boolean;
  is_proxy: boolean;
  is_whitelisted: boolean;
  lp_holder_count: number;
  owner: IMarketOwner;
  personal_slippage_modifiable: boolean;
  selfdestruct: boolean;
  sell_tax: number;
  slippage_modifiable: boolean;
  trading_cooldown: boolean;
  transfer_pausable: boolean;
}

export interface IMarketBNBNetwork {
  address: string;
  name: string;
  older_count: number;
  security: IMarketSecurity;
  symbol: string;
  total_supply: number;
  update_date_goplus: string;
}

export interface IMarketCG {
  cg: number;
  cmc?: number;
}

export interface IMarketSocialMedia {
  reddit: string;
  twitter: string;
}
export interface IMarketLink {
  kind: string;
  url: string;
}

export interface IMarketNetworks {
  bnb: IMarketBNBNetwork;
}

export interface IMarketRank {
  cg: {
    global: number;
    market_cap: number;
  };
}

export interface IMarketImage {
  cg: {
    small: string;
    large: string;
    thumb: string;
  };
  cmc: {
    logo: string;
  };
}

export interface IMarketScore {
  cg: {
    community: number;
    developer: number;
    liquidity: number;
    public_interest: number;
    score: number;
  };
}

export interface IMarketSource {
  ath_change_percentage: IMarketCG;
  ath: IMarketCG;
  atl_change_percentage: IMarketCG;
  atl: IMarketCG;
  circulating_supply: IMarketCG;
  coingecko_id: string;
  coinmarketcap_id: string;
  description: string;
  genesis_date: string;
  high_24h: IMarketCG;
  identifier: string;
  image: IMarketImage;
  links: IMarketLink[];
  low_24h: IMarketCG;
  market_cap_change_24h: IMarketCG;
  market_cap_change_percentage_24h: IMarketCG;
  market_cap: IMarketCG;
  max_supply: IMarketCG;
  name: string;
  networks: IMarketNetworks;
  price_change_24h: IMarketCG;
  price_change_percentage_1h: IMarketCG;
  price_change_percentage_1y: IMarketCG;
  price_change_percentage_24h: IMarketCG;
  price_change_percentage_30d: IMarketCG;
  price_change_percentage_7d: IMarketCG;
  price_usd: IMarketCG;
  rank: IMarketRank;
  readable_update_date: string;
  score: IMarketScore;
  socials_media: IMarketSocialMedia;
  source: string;
  symbol: string;
  tags: string[];
  total_supply: IMarketCG;
  update_date_coingecko_marketcap: string;
  update_date_coingecko: string;
  update_date_coinmarketcap: string;
  update_date: number;
  volumen_24h: IMarketCG;
}

export interface IESearchMarketItem {
  _id: string;
  _index: string;
  _primary_term?: number;
  _score: number;
  _sort?: number[];
  _source: IMarketSource;
  _type?: string;
}

export interface IMarketTotal {
  relation: string;
  value: number;
}

export interface ISearchMarkets {
  hits: IESearchMarketItem[];
  max_score: number;
  total: IMarketTotal;
}
