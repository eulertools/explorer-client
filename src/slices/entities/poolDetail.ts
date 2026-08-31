import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
// import { TokenDetailSourceDTO } from 'src/types/token';
import { loggerException } from 'src/utils/logger';

export interface IPoolDTO {
  poolAddress: string;
  token1: {
    address: string;
    balance: number;
  };
  token2: {
    address: string;
    balance: number;
  };
  LPBalance: number;
  price: number;
}

export interface IPoolSliceState {
  loading: boolean;
  error: string | null;
  detail: IPoolDTO | null;
}
export interface IPairSlice {
  [poolAddress: string]: IPoolSliceState;
}

const initialState: IPairSlice = {};

const slice = createSlice({
  name: 'poolDetail',
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

export const getPool = (address: string): AppThunk => async (dispatch): Promise<IPoolDTO> => {
  try {
    dispatch(slice.actions.setAddress({ address }));
    dispatch(slice.actions.setLoading({ address }));
    const response = await axios.publicFetchClient.get<IPoolDTO>(`pools/${address}`);
    dispatch(slice.actions.setDetail({ address, data: response.data }));
    return response.data;
  } catch (error) {
    loggerException(error);
    dispatch(slice.actions.setError({ address, data: 'Unable to get pool detail details' }));
  }
  return null;
};

export const { reducer } = slice;
export default slice;
