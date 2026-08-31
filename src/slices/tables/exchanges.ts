import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { selectExchangeDisplayAge } from 'src/selectors/exchange';
import { FilterParams } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { logger, loggerError } from 'src/utils/logger';

export interface IExchanges {
  exchange: any;
  exchanges: {
    hits: any[];
    total: {
      value: number;
      relation: string;
    };
  };
  loading: boolean;
  displayAge: boolean;
}

const initialState: IExchanges = {
  exchange: {},
  exchanges: {
    hits: [],
    total: {
      value: 0,
      relation: '',
    },
  },
  loading: false,
  displayAge: false,
};

const slice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {
    setExchange(state, action): void {
      const { exchange } = action.payload;

      state.exchange = exchange;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setExchanges(state, action): void {
      const exchanges = action.payload;

      state.exchanges = exchanges;
    },
    setDisplayAge(state, action): void {
      state.displayAge = action.payload;
    },
  },
});

export interface CGPaginationParams {
  order: string;
  page: number;
  pageSize: number;
}

export interface SearchPaginationParams {
  size: number;
  offset: number;
}

export const { reducer } = slice;

export const getExchange = (exchangeId: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));
  dispatch(slice.actions.setExchange({ exchange: {} }));

  return axios.publicFetchClient
    .get(`pairs/${exchangeId}`)
    .then((response) => response.data)
    .then((data) => {
      dispatch(slice.actions.setExchange({ exchange: data }));
    })
    .catch((e) => {
      loggerError('EXCHANGES GET FAILED', e);
    })
    .finally(() => {
      dispatch(slice.actions.setLoading(false));
    });
};

export const getExchangeData = async (exchangeAddress: string, prefix?: string) => {
  try {
    const response = await axios.publicFetchClient.get(`pairs/${exchangeAddress}`, { prefix });

    return response.data._source;
  } catch (error) {
    logger('getExchangeData', error);
    return null;
  }
};

export const getExchanges = (query: string, owner: string, filters: FilterParams, prefix?: string): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const { page, size } = filters;

    const response = await axios.publicFetchClient.get(
      `pairs?${(owner && `&owner=${owner}`) || ''}${(query && `&query=${query}`) || ''}&size=${size}&from=${
        size * page
      }&liquidity=1`,
      { prefix },
    );

    const { hits, total } = response.data;

    dispatch(slice.actions.setExchanges({ hits, total }));
    dispatch(slice.actions.setLoading(false));
  } catch (error) {
    logger('EXCHANGES CUSTOMERS FAILED', error);
    dispatch(slice.actions.setLoading(false));
  }
};

export const toggleExchangesDisplayAge = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setDisplayAge(!selectExchangeDisplayAge(getState())));
  return null;
};

export default slice;
