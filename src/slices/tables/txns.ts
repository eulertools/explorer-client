import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { ITransactionDetailsItem } from 'src/pages/portfolios/components/portfolioDetails/types';
import type { AppThunk } from 'src/store';
import { loggerError } from 'src/utils/logger';

export interface ITxnsSliceState {
  loading: boolean;
  error: string | null;
  detail: ITransactionDetailsItem | null;
}
export interface ITxnsSlice {
  [tnxsAddress: string]: ITxnsSliceState;
}

const initialState: ITxnsSlice = {};

const slice = createSlice({
  name: 'txns',
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

export const getTxns = (address: string): AppThunk => async (dispatch): Promise<ITransactionDetailsItem> => {
  try {
    dispatch(slice.actions.setAddress({ address }));
    dispatch(slice.actions.setLoading({ address }));
    const response = await axios.publicFetchClient.get<ITransactionDetailsItem>(`transactions/${address}`);
    dispatch(slice.actions.setDetail({ address, data: response.data }));
    return response.data;
  } catch (error) {
    loggerError('getTxns', error);
    dispatch(slice.actions.setError({ address, data: 'Unable to get transaction details' }));
  }
  return null;
};

export const { reducer } = slice;
export default slice;
