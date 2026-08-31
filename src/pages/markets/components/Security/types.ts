export interface IDex {
  name: string;
  liquidity: string;
  pair: string;
}

export interface IHolder {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
}

export interface ILpHolder {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
}

export interface IGoPlusTokenSecurityDetails {
  is_in_dex: string;
  is_open_source: string;
  is_proxy: string;
  is_true_token: string;
  is_airdrop_scam?: string;
  other_potential_risks?: string;
  note?: string;
  trust_list: string;
  buy_tax: string;
  can_take_back_ownership: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  dex: IDex[];
  hidden_owner: string;
  holder_count: string;
  holders: IHolder[];
  is_anti_whale: string;
  is_blacklisted: string;
  is_honeypot: string;
  is_mintable: string;
  is_whitelisted: string;
  lp_holder_count: string;
  lp_holders: ILpHolder[];
  lp_total_supply: string;
  owner_address: string;
  owner_balance: string;
  owner_change_balance: string;
  owner_percent: string;
  sell_tax: string;
  slippage_modifiable: string;
  total_supply: string;
  trading_cooldown: string;
  transfer_pausable: string;
  token_name: string;
  token_symbol: string;
}

export interface IGoPlusSecurityDTO {
  code: number;
  message: string;
  result: { [key: string]: IGoPlusTokenSecurityDetails };
}
