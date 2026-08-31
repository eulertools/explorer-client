import { createSlice } from '@reduxjs/toolkit';
import bodybuilder from 'bodybuilder';
import { isEmpty } from 'lodash';
import _map from 'lodash/map';
import axios, { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { FilterParams, UITableID } from 'src/slices/filter.types';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import type { AppThunk } from 'src/store';
import { IChain } from 'src/types/configuration';
import { IESSearchItem, ISearchTokens, ISource } from 'src/types/search';
import { loggerError } from 'src/utils/logger';
import { isBNBToken } from 'src/utils/marketplace';

export enum NetworkTokenMap {
  ethereum = 'ETH',
  binancecoin = 'BNB',
}

export interface Token {
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

export interface ITokenPaginationParams {
  page: number;
  pageSize: number;
  query?: string;
}

export interface ITokenSearchDetails extends IESSearchItem, IPortfolioDetailsItem {}

export interface ITokenReducer {
  tokens: ISource[];
  portfolioTokens: ITokenSearchDetails[];
  [key: string]: any;
}

const initialState: ITokenReducer = {
  markets: [],
  tokens: [],
  portfolioTokens: [],
  coins: [],
  total: 0,
  token: null,
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
  name: 'tokens',
  initialState,
  reducers: {
    setTokens(state, action): void {
      const { tokens, total } = action.payload;

      state.tokens = tokens;
      state.total = total;
      state.loading = false;
    },
    setToken(state, action): void {
      const { token } = action.payload;

      state.token = token;
      state.loading = false;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setPortfolioTokens(state, action): void {
      state.portfolioTokens = action.payload;
      state.loading = false;
    },
    setPortfolioToken(state, action): void {
      const token = action.payload;

      state.token = token;
    },
    setConversion(state, action): void {
      const conversion: Conversion = action.payload;

      state.conversion = conversion;
    },
  },
});

export const { reducer } = slice;

export const getTokens = (filters: FilterParams, fields?: string[]): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const { page, size, orderBy, orderDir, kind = [], verified, query, type, blockchain } = filters;
    const cancelToken = axios.cancelToken.autoAbort(UITableID.token_list);

    const queryObj = bodybuilder();

    if (query) {
      queryObj.orFilter('wildcard', 'name', `*${query}*`);
      queryObj.orFilter('wildcard', 'symbol', `*${query}*`);
      queryObj.orFilter('wildcard', 'coingecko.name', `*${query}*`);
      queryObj.orFilter('wildcard', 'coingecko.symbol', `*${query}*`);
      if (type === 'token-selector') queryObj.orFilter('match', 'address', query);
    }
    if (kind.length > 0) {
      queryObj.query('terms', 'category', kind);
    }

    if (blockchain) {
      queryObj.filter('term', 'chain', blockchain);
    }

    // Only include tokens that have coin information
    if (verified) {
      // Safe mode activated
      queryObj.query('exists', 'field', 'coin');
      // Also only include tokens that have the circulating value
      // queryObj.query('exists', 'field', 'circulating');
      queryObj.query('exists', 'field', 'coingecko.id');
      queryObj.query('range', 'market_cap', { gt: 0 });
      queryObj.query('range', 'market_cap', { lte: 5539410351 }); // TODO remove. market_cap de pancake swap
    }

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

    const tokensResponse = await axios.publicFetchClient.post<ISearchTokens>(`tokens`, body, {
      cancelToken,
    });

    const tokensData = tokensResponse.data;
    const arrayData = _map(tokensData.hits, (item) => item._source);

    dispatch(
      slice.actions.setTokens({
        tokens: arrayData,
        total: tokensData.total.value,
      }),
    );
    axios.cancelToken.clear(UITableID.token_list);
  } catch (e) {
    loggerError('Fetching Token List Failed', e);
    dispatch(slice.actions.setLoading(false));
  }
};

export const resetTokens = (): AppThunk => (dispatch): void => {
  dispatch(slice.actions.setTokens({ tokens: [], total: 0 }));
};

export const getToken = (id: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));
  try {
    const tokenResponse = await axios.publicFetchClient.get<IESSearchItem>(`tokens/${id}`);
    const tokenData = tokenResponse.data;

    dispatch(slice.actions.setToken({ token: tokenData._source }));
  } catch (e) {
    loggerError('Fetching Token Failed', e);
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export const getTokenData = async (address: string, chain: Record<string, IChain>) => {
  try {
    const network = getSelectedNetworkFromLocalstorage();
    const tokenAddress = isBNBToken(address) ? chain[network].tokens.bnb.address : address;
    const tokenResponse = await axios.publicFetchClient.get<IESSearchItem>(`tokens/${tokenAddress}`);
    const tokenData = tokenResponse.data;
    return tokenData?._source;
  } catch (e) {
    return null;
  }
};

export const setConversion = (conversion: Conversion): AppThunk => async (dispatch): Promise<void> => {
  // @TODO keep this for once we have the API ready for conversion
  const networks = Object.keys(NetworkTokenMap);
  const tokens = Object.values(NetworkTokenMap);
  const baseIdx = tokens.findIndex((token: string) => token?.toUpperCase() === conversion?.base?.toUpperCase());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const baseName = networks[baseIdx];

  dispatch(slice.actions.setConversion(conversion));
};

export const getTokensDetails = (tokensList: any[]): AppThunk => async (dispatch, getState): Promise<void> => {
  const { loading, tokens } = getState().tokens;

  if (!loading) {
    dispatch(slice.actions.setLoading(true));
  }

  try {
    const tokenData = await Promise.all(
      tokensList.map((tl, idx) => {
        const found = tokens.find((t) => t.identifier === tl.identifier);
        if (found) {
          return Promise.resolve(found);
        }

        return axios.privateFetchClient
          .get(`tokens/${tl.identifier}`)
          .then((response) => ({ ...tl, ...response.data }))
          .catch((error) => {
            loggerError(error);
            // We still want to show the rest of the tokens information so return an "empty token response"
            return {
              ...tl,
              _id: idx,
            };
          });
      }),
    );

    dispatch(slice.actions.setPortfolioTokens(tokenData));
  } catch (error) {
    loggerError('FETCH TOKEN DATA FAILED', error);
    dispatch(slice.actions.setLoading(false));
  }
};

export default slice;
