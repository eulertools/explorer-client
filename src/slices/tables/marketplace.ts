import { createSlice } from '@reduxjs/toolkit';
import bodybuilder from 'bodybuilder';
import _map from 'lodash/map';
import axios from 'src/lib/axios';
import { selectMarketplaceDisplayAge } from 'src/selectors/marketplace';
import { FilterParams, UITableSort, UITableID } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { IMarketSource, IMarketplaceList, IMarketplaceItem, EMarketContractSteps } from 'src/types/marketplace';
import { logger } from 'src/utils/logger';

export interface IMarketContractModal {
  loading: boolean;
  step: EMarketContractSteps;
  error: string;
}

export interface IMarketplace {
  total: number;
  error: string | null;
  sale: IMarketSource;
  saleLoading: boolean;
  sales: IMarketSource[];
  salesLoading: boolean;
  saleModal: IMarketContractModal;
  purchaseModal: IMarketContractModal;
  displayAge: boolean;
}

const initialState: IMarketplace = {
  total: 0,
  error: null,
  sale: null,
  saleLoading: true,
  sales: null,
  salesLoading: true,
  saleModal: {
    loading: false,
    step: null,
    error: null,
  },
  purchaseModal: {
    loading: false,
    step: null,
    error: null,
  },
  displayAge: true,
};

const slice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setVariationPercentage(state, action): void {
      const { saleIdentifier, percentage } = action.payload;
      const id = state.sales.findIndex((sale) => sale.identifier === saleIdentifier);

      state.sales = state.sales.map((item, index) => {
        if (index !== id) {
          return item;
        }
        return {
          ...item,
          variationPercentage: percentage,
        };
      });
    },
    setSaleLoading(state): void {
      state.saleLoading = true;
      state.sale = undefined;
      state.error = null;
    },
    setSalesLoading(state, action): void {
      state.salesLoading = true;

      // Clean sales only if we are requesting a new type of data
      if (action.payload) {
        state.sales = null;
      }

      state.error = null;
    },
    setSaleError(state, action): void {
      state.saleLoading = false;
      state.error = action.payload;
    },
    setSalesError(state, action): void {
      state.salesLoading = false;
      state.error = action.payload;
    },
    setSale(state, action): void {
      state.saleLoading = false;
      state.sale = action.payload;
    },
    setSales(state, action): void {
      const { sales, total } = action.payload;
      state.salesLoading = false;
      state.total = total;
      state.sales = sales;
    },
    setNewSaleModal(state, action): void {
      const { loading, step, error } = action.payload;
      state.saleModal.loading = loading;
      state.saleModal.step = step;
      state.saleModal.error = error;
    },
    setNewPurchaseModal(state, action): void {
      const { loading, step, error } = action.payload;
      state.purchaseModal.loading = loading;
      state.purchaseModal.step = step;
      state.purchaseModal.error = error;
    },
    setDisplayAge(state, action): void {
      state.displayAge = action.payload;
    },
  },
});

export const getSale = (marketplaceId: string): AppThunk => async (dispatch): Promise<IMarketSource> => {
  try {
    dispatch(slice.actions.setSaleLoading());
    const response = await axios.publicFetchClient.get<IMarketplaceItem>(`marketplace/${marketplaceId}`);
    dispatch(slice.actions.setSale(response.data._source));
    return response.data._source;
  } catch (error) {
    logger('getSale', error);
    dispatch(slice.actions.setSaleError('Unable to get marketplace sale detail'));
  }
  return null;
};

let lastTableUpdated = null;

export const getSales = (filters: FilterParams, tableId: string): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setSalesLoading(lastTableUpdated !== tableId));
    const { query, size, page, orderBy, orderDir, kind, tradeType, account, status } = filters;
    const cancelToken = axios.cancelToken.autoAbort('get_marketplace_list');
    const queryObj = bodybuilder();

    // Filter by name containing the query
    if (query) {
      queryObj.orFilter('multi_match', { query, fields: ['*_symbol', '*_name'] });
    }
    // Filter type of sale
    if (kind === 'all') {
      /**
       * Show public sale types for main marketplace table
       * and all kinds for My Trades table
       */
      if (tableId === UITableID.marketplace_trade_list) {
        queryObj.notFilter('term', 'seller_wallet', `${account.toLowerCase()}`);
      }
    } else {
      queryObj.query('terms', 'kind', [kind]);
    }

    if (tableId === UITableID.marketplace_my_sale_list) {
      // Filter user sales or purchases
      if (tradeType === 'all') {
        queryObj.orFilter('multi_match', {
          query: account.toLowerCase(),
          fields: ['seller_wallet', 'whitelisted_wallets'],
        });
        queryObj.orFilter('exists', 'field', `purchases.${account.toLowerCase()}`);
        if (query) queryObj.filterMinimumShouldMatch(2);
      } else if (tradeType === 'purchases') {
        queryObj.orFilter('match', 'whitelisted_wallets', account.toLowerCase());
        queryObj.orFilter('exists', 'field', `purchases.${account.toLowerCase()}`);
        if (query) queryObj.filterMinimumShouldMatch(2);
      } else if (tradeType === 'sales') {
        queryObj.query('terms', 'seller_wallet', [account.toLowerCase()]);
      }
      // Filter status of sales
      if (status === 'open') {
        queryObj.query('range', 'close_date', { lte: 1 });
      }
      if (status === 'closed') {
        queryObj.query('range', 'close_date', { gte: 1 });
      }
    }

    // Filter by BSC Network
    queryObj.query('terms', 'blockchain', ['bsc']);

    // Filter only open sales in Marketplace Table
    if (tableId === UITableID.marketplace_trade_list) queryObj.query('range', 'close_date', { lte: 1 });

    if (orderBy && orderDir) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((by) => queryObj.sort(by, orderDir));
      } else {
        queryObj.sort(orderBy, orderDir);
      }
    } else {
      // Default to order by create_date
      queryObj.sort('create_date', UITableSort.desc);
    }

    const qBuilt = queryObj.build() as any;

    const body = {
      size,
      from: size * page,
      sort: qBuilt.sort ? qBuilt.sort : [],
      query: qBuilt.query,
    };

    const response = await axios.publicFetchClient.post<IMarketplaceList>('marketplace', body, {
      cancelToken,
    });

    const responseData = response.data;
    const arrayData = _map(responseData.hits, (item) => item._source);

    lastTableUpdated = tableId;
    dispatch(
      slice.actions.setSales({
        sales: arrayData,
        total: responseData.total.value,
      }),
    );
    axios.cancelToken.clear('get_marketplace_list');
  } catch (error) {
    logger('getMarketplaceList', error);
    dispatch(slice.actions.setSalesError('Unable to get marketplace list'));
  }
  return null;
};

export const toggleMarketplaceDisplayAge = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setDisplayAge(!selectMarketplaceDisplayAge(getState())));
  return null;
};
export const setVariationPercentage = (saleIdentifier: string, percentage: number): AppThunk => (dispatch) => {
  dispatch(slice.actions.setVariationPercentage({ saleIdentifier, percentage }));
};

export const { reducer } = slice;
export default slice;
