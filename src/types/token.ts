export interface TokenDetailSourceDTO {
  // Common
  decimals: string;
  identifier: string;
  kind: string;
  name: string;
  owner: string;
  symbol: string;

  // format 1
  base_token_address: string;
  base_token_name: string;
  quote_token_address: string;
  quote_token_name: string;
  readable_update_date: string;
  update_date: string;
  base_token_balance: number;
  quote_token_balance: number;
  // format 1
  address: string;
  category: string;
  url: string;
  price_bnb: string;
  price_usd: string;
}

export interface TokenDetailFlatDTO extends TokenDetailSourceDTO {
  _id: string;
  found: false;
}
export interface TokenDetailDTO {
  _id: string;
  found: false;
  _source: TokenDetailSourceDTO;
}
export interface TokenDTO {
  name: string;
  pnl: string;
  quantity: number;
  value: number;
  valueBNB: number;
  token: TokenDetailDTO;
}
