import { today, tomorrow } from 'src/utils/moment';

export enum UITableID {
  pair_list = 'pair_list',
  market_list = 'market_list',
  market_detail = 'market_detail',
  token_list = 'token_list',
  token_detail = 'token_detail',
  token_trade_list = 'token_trade_list',
  trade_list = 'trade_list',
  euler_trade_list = 'euler_trade_list',
  transaction_list = 'transaction_list',
  token_transaction_list = 'token_transaction_list',
  token_exchange_list = 'token_exchange_list',
  pair_exchange_list = 'pair_exchange_list',
  marketplace_trade_list = 'marketplace_trade_list',
  marketplace_my_sale_list = 'marketplace_my_sale_list',
  marketplace_token_selector = 'marketplace_token_selector',
  collections = 'collections',
  nft_list = 'nft_list',
  assets_nft_list = 'assets_nft_list',
}

export enum UITableSort {
  desc = 'desc',
  asc = 'asc',
}

export interface GlobalFilterProps {
  tableId: UITableID;
  numeric?: boolean;
  multiple?: boolean;
  filterName?: string;
  defaultValue?: any;
}

export const NOT_COUNT = ['size', 'page', 'orderBy', 'orderDir', 'compact'];
export const defaultFilterParams = {
  query: '',
  size: 16,
  page: 0,
  orderBy: undefined,
  orderDir: undefined,
};

export const pairTableDefaultFilterParams = {
  ...defaultFilterParams,
  owner: [],
};

export const tokenTableDefaultFilterParams = {
  ...defaultFilterParams,
  verified: true,
  orderBy: 'market_cap',
  orderDir: UITableSort.desc,
  kind: ['token'],
  type: 'token-selector',
};

export const marketTableDefaultFilterParams = {
  ...defaultFilterParams,
  orderBy: 'market_cap.cg',
  orderDir: UITableSort.desc,
  type: 'token-selector',
};

export const tokenTradeTableDefaultFilterParams = {
  size: 20,
  page: 0,
  orderBy: 'block_timestamp',
  orderDir: UITableSort.desc,
  tradePair: { pairAddress: '', baseAddress: '', base: '', quote: '' },
  tradeType: 'all',
  dateRange: [today, tomorrow],
  volumeRange: [0, -1],
};

export const tradeTableDefaultFilterParams = {
  size: 20,
  page: 0,
  orderBy: 'block_timestamp',
  orderDir: UITableSort.desc,
  tradeType: 'all',
  dateRange: [tomorrow, tomorrow],
  volumeRange: [0, -1],
};

export const eulerTradeTableDefaultFilterParams = {
  size: 20,
  page: 0,
  orderBy: 'block_timestamp',
  orderDir: UITableSort.desc,
  tradePair: {
    pairAddress: '0xb52603072981529c8c0db3e390b2876d97b9b7ed',
    baseAddress: '0x3920123482070C1a2dff73AaD695c60e7c6F6862',
    base: 'EULER',
    quote: 'WBNB',
  },
  tradeType: 'all',
  dateRange: [tomorrow, tomorrow],
  volumeRange: [0, -1],
};

export const transactionTableDefaultFilterParams = {
  size: 16,
  page: 0,
  orderBy: 'block_timestamp',
  orderDir: UITableSort.desc,
  dateRange: [tomorrow, tomorrow],
};

export const tokenTransactionTableDefaultParams = {
  size: 16,
  page: 0,
  orderBy: 'block_timestamp',
  orderDir: UITableSort.desc,
  dateRange: [tomorrow, tomorrow],
  volumeRange: [0, -1],
};

export const tokenExchangeTableDefaultParams = {
  size: 16,
  page: 0,
  orderBy: 'readable_create_date',
  orderDir: UITableSort.desc,
};

export const pairExchangeTableDefaultParams = {
  size: 16,
  page: 0,
  orderBy: 'readable_create_date',
  orderDir: UITableSort.desc,
};

export const marketplaceTradeTableDefaultParams = {
  ...defaultFilterParams,
  orderBy: 'create_date',
  orderDir: UITableSort.desc,
  kind: 'all',
};

export const marketplaceMySalesTableDefaultParams = {
  ...defaultFilterParams,
  account: '',
  orderBy: 'create_date',
  orderDir: UITableSort.desc,
  tradeType: 'all',
  status: 'all',
  kind: 'all',
};

export const marketplaceTokenSelectorDefaultParams = {
  ...defaultFilterParams,
  type: 'token-selector',
  verified: true,
  orderBy: ['update_date', 'market_cap'],
  orderDir: UITableSort.desc,
  kind: ['token'],
};

export const collectionsTableDefaultFilterParams = {
  ...defaultFilterParams,
  page: 1,
  orderDir: UITableSort.desc,
};

export const nftTableDefaultParams = {
  ...defaultFilterParams,
  page: 1,
  compact: false,
  orderDir: UITableSort.desc,
};

export const assetsNFTTableDefaultParams = {
  ...defaultFilterParams,
  cursor: null,
  size: 8,
  page: 1,
  orderDir: UITableSort.desc,
};

export const defaultFiltersByTableId = {
  [UITableID.pair_list]: pairTableDefaultFilterParams,
  [UITableID.token_list]: tokenTableDefaultFilterParams,
  [UITableID.token_detail]: defaultFilterParams,
  [UITableID.market_list]: marketTableDefaultFilterParams,
  [UITableID.market_detail]: defaultFilterParams,
  [UITableID.token_trade_list]: tokenTradeTableDefaultFilterParams,
  [UITableID.trade_list]: tradeTableDefaultFilterParams,
  [UITableID.euler_trade_list]: eulerTradeTableDefaultFilterParams,
  [UITableID.transaction_list]: transactionTableDefaultFilterParams,
  [UITableID.token_transaction_list]: tokenTransactionTableDefaultParams,
  [UITableID.token_exchange_list]: tokenExchangeTableDefaultParams,
  [UITableID.pair_exchange_list]: pairExchangeTableDefaultParams,
  [UITableID.marketplace_trade_list]: marketplaceTradeTableDefaultParams,
  [UITableID.marketplace_my_sale_list]: marketplaceMySalesTableDefaultParams,
  [UITableID.marketplace_token_selector]: marketplaceTokenSelectorDefaultParams,
  [UITableID.collections]: collectionsTableDefaultFilterParams,
  [UITableID.nft_list]: nftTableDefaultParams,
  [UITableID.assets_nft_list]: assetsNFTTableDefaultParams,
};

export interface FilterItem {
  filterName: string;
  filterValue: any;
}

export interface FilterParams {
  query?: string;
  size: number;
  page: number;
  orderBy?: string | string[];
  orderDir?: UITableSort;
  [filterName: string]: any;
}

export interface TableState {
  filter: FilterParams;
  openFilter: boolean;
}

export interface GlobalFilters {
  [UITableID.pair_list]: TableState;
  [UITableID.token_list]: TableState;
  [UITableID.token_detail]: TableState;
  [UITableID.market_list]: TableState;
  [UITableID.market_detail]: TableState;
  [UITableID.token_trade_list]: TableState;
  [UITableID.trade_list]: TableState;
  [UITableID.euler_trade_list]: TableState;
  [UITableID.transaction_list]: TableState;
  [UITableID.token_transaction_list]: TableState;
  [UITableID.token_exchange_list]: TableState;
  [UITableID.pair_exchange_list]: TableState;
  [UITableID.marketplace_trade_list]: TableState;
  [UITableID.marketplace_my_sale_list]: TableState;
  [UITableID.marketplace_token_selector]: TableState;
  [UITableID.collections]: TableState;
  [UITableID.nft_list]: TableState;
  [UITableID.assets_nft_list]: TableState;
}
