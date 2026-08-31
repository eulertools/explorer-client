interface ITotal {
  value: number;
  relation: string;
}

export interface IPairSource {
  address?: string;
  base_token_address: string;
  base_token_name: string;
  base_token_symbol: string;
  base_token_balance: number;
  base_token_price: number;
  category?: string;
  hash_key: string;
  identifier: string;
  kind?: string;
  liquidity_bnb: number;
  liquidity: number;
  name?: string;
  owner: string;
  price: number;
  quote_token_address: string;
  quote_token_name: string;
  quote_token_symbol: string;
  quote_token_balance: number;
  quote_token_price: number;
  range_key: string;
  readable_update_date?: string;
  symbol: string;
  type: string;
  update_date: number;
  total_volume_locked: number;
  volumes: {
    day: number;
    hour: number;
    month: number;
    week: number;
  };
}

export interface IHit {
  _id: string;
  _index: string;
  _primary_term?: number;
  _score?: number;
  _seq_no?: number;
  _source: IPairSource;
  _type: string;
  _version?: number;
  found?: boolean;
  sort?: number[];
}
export interface IPairsDTO {
  total: ITotal;
  max_score: number;
  hits: IHit[];
}

export enum ESupportedExchanges {
  pancake1 = 'pancake1',
  pancake2 = 'pancake2',
  wswap = 'wswap',
  mdex = 'mdex',
  unisave = '0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470',
  biswap = 'biswap',
  apeswap = 'apeswap',
  alitaswap = '0xc7a506ab3ac668eab6bf9ecf971433d6cfef05d9',
  wardenswap = '0x3657952d7bA5A0A4799809b5B6fdfF9ec5B46293',
  babyswap = 'babyswap',
  bscswap = '0xCe8fd65646F2a2a897755A1188C04aCe94D2B8D0',
  bakeryswap = 'bakeryswap',
}
