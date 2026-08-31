interface IImage {
  small: string;
  large: string;
  thumb: string;
}

interface ICommunityData {
  twitter_followers: number;
  telegram_channel_user_count: number;
  facebook_likes?: any;
  reddit_subscribers: number;
  reddit_average_posts_48h: string;
  reddit_average_comments_48h: string;
  reddit_accounts_active_48h: number;
}

interface IConvertedVolume {
  btc: string;
  usd: any;
  eth: string;
}

interface IMarket {
  identifier: string;
  name: string;
  has_trading_incentive: boolean;
}

interface IConvertedLast {
  btc: string;
  usd: string;
  eth: string;
}

interface ITicker {
  last_fetch_at: Date;
  is_anomaly: boolean;
  last: string;
  last_traded_at: Date;
  coin_id: string;
  converted_volume: IConvertedVolume;
  target_coin_id: string;
  is_stale: boolean;
  target: string;
  market: IMarket;
  volume: string;
  bid_ask_spread_percentage: string;
  trade_url: string;
  converted_last: IConvertedLast;
  token_info_url?: any;
  trust_score: string;
  base: string;
  timestamp: Date;
}

interface IPlatforms {
  'binance-smart-chain': string;
}

interface IReposUrl {
  github: string[];
  bitbucket: any[];
}

interface Links {
  subreddit_url?: any;
  blockchain_site: string[];
  official_forum_url: string[];
  telegram_channel_identifier: string;
  twitter_screen_name: string;
  repos_url: IReposUrl;
  bitcointalk_thread_identifier?: any;
  announcement_url: string[];
  facebook_username: string;
  chat_url: string[];
  homepage: string[];
}

interface CodeAdditionsDeletions4Weeks {
  additions?: any;
  deletions?: any;
}

interface IDeveloperData {
  forks: number;
  total_issues: number;
  pull_request_contributors: number;
  code_additions_deletions_4_weeks: CodeAdditionsDeletions4Weeks;
  subscribers: number;
  commit_count_4_weeks: number;
  pull_requests_merged: number;
  stars: number;
  last_4_weeks_commit_activity_series: any[];
  closed_issues: number;
}

interface ICoingeckoPrice {
  usd_market_cap: string;
  bnb_24h_change: string;
  bnb_24h_vol: string;
  last_updated_at: number;
  usd: string;
  bnb: string;
  bnb_market_cap: string;
  usd_24h_vol: string;
  usd_24h_change: string;
}

interface ICoin {
  image: IImage;
  community_data: ICommunityData;
  coin_id: string;
  asset_platform_id: string;
  public_notice?: any;
  description: string;
  tickers: ITicker[];
  platforms: IPlatforms;
  additional_notices: string[];
  links: Links;
  categories: any[];
  developer_data: IDeveloperData;
  coingecko_price: ICoingeckoPrice;
}

export interface ISource {
  address: string;
  base_token_address?: string;
  base_token_name?: string;
  category?: string;
  coin?: ICoin;
  decimals?: number;
  rugged?: boolean;
  rugged_message?: string;
  hash_key?: string;
  identifier?: string;
  kind?: string;
  name: string;
  owner?: string;
  quote_token_address?: string;
  quote_token_name?: string;
  readable_update_date?: string;
  symbol?: string;
  totalSupply?: string;
  total_supply?: string;
  update_date?: string;
  updated?: number;
  url?: string;
  price_usd?: any;
  price_bnb?: string;
  exchanges?: any[];
  market_cap?: any;
  circulating_supply?: any;
  volumen_24h?: any;
  image?: any;
  quantity?: number;
  price?: number;
}

export interface IESSearchItem {
  _id: string;
  _index: string;
  _primary_term?: number;
  _score: number;
  _seq_no?: number;
  _sort?: number[];
  _source: ISource;
  _type?: string;
  _version?: number;
  found?: boolean;
}

export interface ITotal {
  value: number;
  relation: string;
}

export interface ISearchTokens {
  total: ITotal;
  max_score: number;
  hits: IESSearchItem[];
}
