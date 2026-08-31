export interface MarketTokenObject {
  key: string;
  symbol: string;
  address: string;
}

export interface MarketToken {
  id: string;
  tokenBase: MarketTokenObject;
  tokenQuote: MarketTokenObject;
  amountBase: number;
  amountQuote: number;
  lockoutPeriod: number;
  lockoutPeriodUnits: number;
  numberPackages: number;
  tokenBaseId: number;
  kind: number;
  closingTime: number;
  sellerWallet: string;
  buyerWallet: string;
}

export enum MarketSalePeriod {
  MINUTE = 60,
  HOUR = 3_600,
  DAY = 86_400,
  WEEK = 604_800,
  MONTH = 2_592_000,
}

export const marketSalePeriodOptions = [
  {
    key: MarketSalePeriod.MINUTE,
    label: 'Minute',
  },
  {
    key: MarketSalePeriod.HOUR,
    label: 'Hour',
  },
  {
    key: MarketSalePeriod.DAY,
    label: 'Day',
  },
  {
    key: MarketSalePeriod.WEEK,
    label: 'Week',
  },
  {
    key: MarketSalePeriod.MONTH,
    label: 'Month',
  },
];

export enum EMarketSaleType {
  PUBLIC = 0,
  PRIVATE = 1,
  LOCKED_PUBLIC = 2,
  LOCKED_PRIVATE = 3,
  SECURE_SEND = 4,
  PUBLIC_ERC721 = 5,
  PRIVATE_ERC721 = 6,
  PUBLIC_ERC1155 = 7,
  PRIVATE_ERC1155 = 8,
  DONATION = 9,
}

export const marketSaleTypeOptions = [
  {
    key: EMarketSaleType.PUBLIC,
    label: 'Public Sale',
    description: 'Your ad will be open to the public, anyone can have access to it.',
  },
  {
    key: EMarketSaleType.PRIVATE,
    label: 'Private Sale',
    description: 'Your ad will only be visible to a counterparty you trust.',
  },
  {
    key: EMarketSaleType.LOCKED_PUBLIC,
    label: 'Public Locked Sale',
    description: 'Public sale where tokens are locked until a date specified in the contract.',
  },
  {
    key: EMarketSaleType.LOCKED_PRIVATE,
    label: 'Private Locked Sale',
    description: 'Private sale where tokens are locked until a date specified in the contract.',
  },
  {
    key: EMarketSaleType.SECURE_SEND,
    label: 'Secure Send',
    description:
      'One party sends funds into the wallet of another. This is a private event that differs from a private sale.',
  },
  {
    key: EMarketSaleType.PUBLIC_ERC721,
    label: 'Public ERC721 Sale',
    description: 'NFT sales using the ERC721 standard require a unique TokenID.',
  },
  {
    key: EMarketSaleType.PRIVATE_ERC721,
    label: 'Private ERC721 Sale',
    description: 'NFT sales using the ERC721 standard require a unique TokenID.',
  },
  {
    key: EMarketSaleType.PUBLIC_ERC1155,
    label: 'Public ERC1155 Sale',
    description: 'Bulk public sale of NFTs using the ERC1155 standard.',
  },
  {
    key: EMarketSaleType.PRIVATE_ERC1155,
    label: 'Private ERC1155 Sale',
    description: 'Bulk public sale of NFTs using the ERC1155 standard.',
  },
  {
    key: EMarketSaleType.DONATION,
    label: 'Donation',
    description: 'Private versus Public donation?.',
  },
];

export enum EMarketContractSteps {
  CREATING_SALE = 'creating_sale',
  CREATING_PURCHASE = 'creating_purchase',
  WAITING_APPROVAL = 'waiting_approval',
  REJECTED_APPROVAL = 'rejected_approval',
  APPROVED = 'approved',
  WAITING_CONFIRMATION = 'waiting_confirmation',
  REJECTED_CONFIRMATION = 'rejected_confirmation',
  CONFIRMED = 'confirmed',
}

export const marketContractStepOptions = [
  {
    key: EMarketContractSteps.WAITING_APPROVAL,
    label: 'Waiting for Approval...',
  },
  {
    key: EMarketContractSteps.REJECTED_APPROVAL,
    label: 'Approval was Rejected',
  },
  {
    key: EMarketContractSteps.APPROVED,
    label: 'Approved',
  },
  {
    key: EMarketContractSteps.WAITING_CONFIRMATION,
    label: 'Waiting for Confirmation...',
  },
  {
    key: EMarketContractSteps.REJECTED_CONFIRMATION,
    label: 'Confirmation was Rejected.',
  },
  {
    key: EMarketContractSteps.CONFIRMED,
    label: 'Confirmed',
  },
];

export interface IClaims {
  [key: string]: IClaimObject[];
}

export interface IClaimObject {
  amount: number;
  numberPackage: string;
  timestamp: number;
}

export interface INextClaim {
  [key: string]: INextClaimObject;
}

export interface INextClaimObject {
  timestamp: number;
  currentPackage: number;
}

export interface IPurchases {
  [key: string]: IPurchaseObject[];
}

export interface IPurchaseObject {
  amountIn: number;
  amountOut: number;
  timestamp: number;
}

export interface IMarketSource {
  base_token_address: string;
  base_token_id: string;
  base_token_name: string;
  base_token_quantity: number;
  base_token_symbol: string;
  blockchain: string;
  category: string;
  claims: IClaims;
  close_date: number;
  create_date: number;
  identifier: string;
  kind: string;
  next_claim: INextClaim;
  packages: string;
  period: string;
  purchases: IPurchases;
  quote_token_address: string;
  quote_token_name: string;
  quote_token_quantity: number;
  quote_token_symbol: string;
  ratio: number;
  seller_wallet: string;
  update_date: number;
  variationPercentage: number;
  whitelisted_wallets: string[];
}

export interface IMarketplaceItem {
  _id: string;
  _index: string;
  _primary_term?: number;
  _score: number;
  _seq_no?: number;
  _sort?: number[];
  _source: IMarketSource;
  _type?: string;
  _version?: number;
  found?: boolean;
}

export interface ITotal {
  value: number;
  relation: string;
}

export interface IMarketplaceList {
  total: ITotal;
  max_score: number;
  hits: IMarketplaceItem[];
}
