import { createSlice } from '@reduxjs/toolkit';
import bodybuilder from 'bodybuilder';
import { isEmpty } from 'lodash';
import _map from 'lodash/map';
import axios from 'src/lib/axios';
import { FilterParams, UITableID, UITableSort } from 'src/slices/filter.types';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import type { AppThunk } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { ISearchMarkets } from 'src/types/market';
import { IESSearchItem, ISource } from 'src/types/search';
import { loggerError } from 'src/utils/logger';

export enum NetworkMarketMap {
  ethereum = 'ETH',
  binancecoin = 'BNB',
}

export interface Market {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: any;
  platforms: any;
  market_data?: any;
}

export interface Conversion {
  base: string;
  quote: string;
  selected: string;
  basePrice: number;
  quotePrice: number;
}

export interface IMarketSearchDetails extends IESSearchItem, IPortfolioDetailsItem {}

export interface IMarketReducer {
  markets: ISource[];
  portfolioMarkets: IMarketSearchDetails[];
  [key: string]: any;
}

const initialState: IMarketReducer = {
  markets: [],
  tokens: [],
  portfolioMarkets: [],
  coins: [],
  total: 0,
  market: null,
  global: null,
  loading: true,
  conversion: {
    base: null,
    quote: null,
    selected: null,
    basePrice: 1,
    quotePrice: 1,
  },
};

const slice = createSlice({
  name: 'markets',
  initialState,
  reducers: {
    setMarkets(state, action): void {
      const { markets, total } = action.payload;

      state.markets = markets;
      state.total = total;
      state.loading = false;
    },
    setMarket(state, action): void {
      const { market } = action.payload;

      state.market = market;
      state.loading = false;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setPortfolioMarkets(state, action): void {
      state.portfolioMarkets = action.payload;
      state.loading = false;
    },
    setPortfolioMarket(state, action): void {
      const market = action.payload;

      state.market = market;
    },
    setConversion(state, action): void {
      const conversion: Conversion = action.payload;

      state.conversion = conversion;
    },
  },
});

export const { reducer } = slice;

export const getMarkets = (filters: FilterParams, fields?: string[]): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const { page, size, orderBy, orderDir, query, type, network } = filters;
    const cancelToken = axios.cancelToken.autoAbort(UITableID.market_list);

    const queryObj = bodybuilder();

    if (network) {
      queryObj.addQuery('exists', 'field', `networks.${network}`);
    }

    queryObj.orFilter('wildcard', 'name', `*${query}*`);
    queryObj.orFilter('wildcard', 'symbol', `*${query}*`);
    if (type === 'token-selector') queryObj.orFilter('match', 'address', query);

    if (orderBy && orderDir) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((by) => queryObj.sort(by, orderDir));
      } else {
        queryObj.sort(orderBy, orderDir);
      }
    }

    const qBuilt: any = queryObj.build();
    const q = qBuilt.query;
    const body = {
      query: isEmpty(q) ? undefined : q,
      size,
      from: size * page,
      sort: qBuilt.sort ? qBuilt.sort : [],
      _source: undefined,
    };

    if (fields && fields.length) {
      fields.push('identifier');
      body._source = fields;
    }

    const marketsResponse = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body, {
      cancelToken,
    });

    const marketsData = marketsResponse.data;
    const arrayData = _map(marketsData.hits, (item) => item._source);

    dispatch(
      slice.actions.setMarkets({
        markets: arrayData,
        total: marketsData.total.value,
      }),
    );
    axios.cancelToken.clear(UITableID.market_list);
  } catch (e) {
    loggerError('Fetching Market List Failed', e);
    dispatch(slice.actions.setLoading(false));
  }
};

export const getMarket = (id: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));
  try {
    const tokenResponse = await axios.publicFetchClient.get<IESSearchItem>(`v2/tokens/${id}`);
    const tokenData = tokenResponse.data;

    dispatch(slice.actions.setMarket({ market: tokenData._source }));
  } catch (e) {
    loggerError('Fetching Token Failed', e);
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export const getMarketAddress = (
  address: string,
  network: ESupportedNetworks = ESupportedNetworks.BNB,
): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const queryObj = bodybuilder();
    const actualNetwork = network === ESupportedNetworks.BNB ? 'bnb' : network;

    queryObj.orFilter('match', `networks.${actualNetwork}.address`, address.toLowerCase());

    const qBuilt: any = queryObj.build();
    const q = qBuilt.query;
    const body = {
      query: isEmpty(q) ? undefined : q,
      size: 1,
      from: 0,
      sort: qBuilt.sort ? qBuilt.sort : [],
      _source: undefined,
    };

    const tokenResponse = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body);
    const tokenData = tokenResponse.data.hits[0]._source;

    dispatch(slice.actions.setMarket({ market: tokenData }));
  } catch (e) {
    loggerError('Fetching Market Address Failed', e);
    dispatch(slice.actions.setLoading(false));
  }
};

export const getMarketData = async (address: string, network: ESupportedNetworks = ESupportedNetworks.BNB) => {
  try {
    const queryObj = bodybuilder();
    const actualNetwork = network === ESupportedNetworks.BNB ? 'bnb' : network;

    queryObj.addQuery('exists', 'field', `networks.${actualNetwork}`);

    queryObj.orFilter('match', `networks.${actualNetwork}.address`, address.toLowerCase());

    queryObj.sort('rank.cg.global', UITableSort.asc);

    const qBuilt: any = queryObj.build();
    const q = qBuilt.query;
    const body = {
      query: isEmpty(q) ? undefined : q,
      size: 1,
      from: 0,
      sort: qBuilt.sort ? qBuilt.sort : [],
      _source: undefined,
    };

    const tokenResponse = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body);
    return tokenResponse.data.hits[0]._source;
  } catch (error) {
    loggerError('Fetching Market Address Failed', error);
    return null;
  }
};

export const getMarketsData = async (filters: FilterParams, fields?: string[]) => {
  try {
    const { page, size, orderBy, orderDir, query, type, network } = filters;

    const queryObj = bodybuilder();

    if (network) {
      queryObj.addQuery('exists', 'field', `networks.${network}`);
    }

    queryObj.orFilter('wildcard', 'name', `*${query}*`);
    queryObj.orFilter('wildcard', 'symbol', `*${query}*`);
    if (type === 'token-selector') queryObj.orFilter('match', 'address', query);

    if (orderBy && orderDir) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((by) => queryObj.sort(by, orderDir));
      } else {
        queryObj.sort(orderBy, orderDir);
      }
    }

    const qBuilt: any = queryObj.build();
    const q = qBuilt.query;
    const body = {
      query: isEmpty(q) ? undefined : q,
      size,
      from: size * page,
      sort: qBuilt.sort ? qBuilt.sort : [],
      _source: undefined,
    };

    if (fields && fields.length) {
      fields.push('identifier');
      body._source = fields;
    }

    const marketsResponse = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body);

    const marketsData = marketsResponse.data;
    const arrayData = _map(marketsData.hits, (item) => item._source);

    return arrayData;
  } catch (error) {
    loggerError('Fetching Markets Data Failed', error);
    return null;
  }
};

export const resetMarkets = (): AppThunk => (dispatch): void => {
  dispatch(slice.actions.setMarkets({ markets: [], total: 0 }));
};

export default slice;
