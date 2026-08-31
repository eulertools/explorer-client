import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { loggerError } from 'src/utils/logger';

export interface IPairSource {
  address?: string;
  base_token_address: string;
  base_token_name: string;
  base_token_volume: number;
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
  quote_token_volume: number;
  range_key: string;
  readable_update_date?: string;
  symbol: string;
  type: string;
  update_date: number;
}

export interface ITokenExchangeDataSource {
  base_token_address: string;
  owner: string;
  identifier: string;
  symbol: string;
  address: string;
  owner_name: string;
  kLast: string;
  kind: string;
  quote_token_balance: number;
  quote_token_name: string;
  totalSupply?: string;
  total_supply?: string;
  liquidity: string;
  update_date: number;
  quote_token_address: string;
  price: string;
  price1CumulativeLast: string;
  base_token_balance: number;
  name: string;
  price0CumulativeLast: string;
  category: string;
  base_token_name: string;
  readable_update_date: string;
}
export interface ITokenExchangeData {
  _id: string;
  _index: string;
  _primary_term?: number;
  _score?: number;
  _seq_no?: number;
  _source: ITokenExchangeDataSource;
  _type: string;
  _version?: number;
  found?: boolean;
  sort?: number[];
}

export interface ITokenExchangeState {
  loading: boolean;
  error: string | null;
  detail: ITokenExchangeData | null;
}

export interface ITokenExchange {
  [exchangeAddress: string]: ITokenExchangeState;
}

const initialState: ITokenExchange = {};

const slice = createSlice({
  name: 'token_exchange',
  initialState,
  reducers: {
    // details
    setLoading(state, action): void {
      state[action.payload.address].loading = true;
      state[action.payload.address].detail = undefined;
      state[action.payload.address].error = null;
    },
    setDetail(state, action): void {
      state[action.payload.address].loading = false;
      state[action.payload.address].detail = action.payload.data;
      state[action.payload.address].error = null;
    },
    setError(state, action): void {
      state[action.payload.address].loading = false;
      state[action.payload.address].error = action.payload.data;
    },
    setAddress(state, action): void {
      if (!state[action.payload.address]) {
        state[action.payload.address] = {
          loading: false,
          detail: null,
          error: null,
        };
      }
    },
  },
});

export const getTokenExchange = (address: string): AppThunk => async (dispatch): Promise<ITokenExchangeData> => {
  try {
    dispatch(slice.actions.setAddress({ address }));
    dispatch(slice.actions.setLoading({ address }));
    const response = await axios.publicFetchClient.get<ITokenExchangeData>(`pairs/${address}`);
    dispatch(slice.actions.setDetail({ address, data: response.data }));
    return response.data;
  } catch (error) {
    loggerError('getTokenExchange', error);
    dispatch(slice.actions.setError({ address, data: 'Unable to get token exchange details' }));
  }
  return null;
};

export const { reducer } = slice;
export default slice;
