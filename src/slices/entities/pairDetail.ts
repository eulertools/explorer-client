import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { IHit, IPairSource } from 'src/types/pair';
import { loggerException } from 'src/utils/logger';

export interface IPairSliceState {
  loading: boolean;
  error: string | null;
  detail: IPairSource | null;
}
export interface IPairSlice {
  [pairAddress: string]: IPairSliceState;
}

const initialState: IPairSlice = {};

const slice = createSlice({
  name: 'pairDetail',
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

export const getPair = (address: string): AppThunk => async (dispatch): Promise<IPairSource> => {
  try {
    dispatch(slice.actions.setAddress({ address }));
    dispatch(slice.actions.setLoading({ address }));
    const response = await axios.publicFetchClient.get<IHit>(`pairs/${address}`);
    if (response.data.found) dispatch(slice.actions.setDetail({ address, data: response.data._source }));
    return response.data._source;
  } catch (error) {
    loggerException(error);
    dispatch(slice.actions.setError({ address, data: 'Unable to get pair detail details' }));
  }
  return null;
};

export const { reducer } = slice;
export default slice;
