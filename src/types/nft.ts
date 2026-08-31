export interface ISignature {
  v: string;
  r: string;
  s: string;
  value: string;
}

export interface IAttribute {
  name: string;
  value: string;
  trait_type: string;
  display_type?: string;
  [key: string]: string;
}

interface IMetadataSettings {
  start_date_mint: number;
  max_total_supply: number;
  end_date_mint: number;
}

export interface IMetadata {
  image: string;
  attributes: IAttribute[];
  name?: string;
  description?: string;
  settings?: IMetadataSettings;
}
export interface INFTItem {
  address: string;
  token_id: string;
  blockchain: string;
  token_uri: string;
  metadata: IMetadata;
  kind: string;
  claim_words?: string;
}
export interface IRequestNFTData {
  tokenId: string;
  receivers: string[];
}

export interface IRequestNFTSignature {
  r: string;
  s: string;
  value: string;
  signature: string;
  v: string;
}

export interface IRequestNFTItem {
  data: IRequestNFTData;
  signature: IRequestNFTSignature;
  position: string;
}

export interface IRequestNFTItemResponse {
  status: number;
  description: string;
  payload: IRequestNFTItem;
}

export interface ICollectionDetail {
  data: INFTItem[];
}

export interface IAssetNFT {
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  token_hash: string;
  block_number_minted: string;
  block_number: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: any;
  last_token_uri_sync: string;
  last_metadata_sync: string;
}
export interface IRequestAssetNFTListResponse {
  total: number;
  page: number;
  limit: number;
  cursor: string;
  result: IAssetNFT[];
}

export interface INFTAdNote {
  expirationDate: string;
  amount: string;
  price: string;
  tokenId: string;
  buyToken: string;
  identifier: string;
}

export interface INFTAdParameters {
  startDate: number;
  endDate: number;
  maxTotalSupply: number;
  uri: string;
  owner: string;
}

export interface INFTAd {
  token: string;
  parameters: INFTAdParameters;
  note: INFTAdNote;
  signatureCreate: IRequestNFTSignature;
  signature: ISignature;
}

export interface INFTAdItemData {
  base_token_address: string;
  seller_wallet: string;
  identifier: string;
  close_date: number;
  blockchain_id: number;
  quote_token_name: string;
  base_token_id: string;
  update_date: string;
  quote_token_address: string;
  quote_token_quantity: number;
  base_token_quantity: number;
  terms: string;
  quote_token_symbol: string;
  blockchain_name: string;
  create_date: string;
  base_token_name: string;
}

export interface INFAdItem {
  total?: 1;
  results?: INFTAdItemData;
}
