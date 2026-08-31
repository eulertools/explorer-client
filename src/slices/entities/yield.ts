import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { IStakingDTO } from 'src/pages/staking/components/shared';
import type { AppThunk } from 'src/store';
import { IFarmsDTO, IFarmsByWalletDTO } from 'src/types/yield';
import { loggerError } from 'src/utils/logger';

export interface IYield {
  farmsByAddress: { [key: string]: IFarmsByWalletDTO };
  farms: IFarmsDTO[];
  filteredFarms: IFarmsDTO[];
  loading: boolean;
  error: string | null;
  yieldByAddress: { [key: string]: IStakingDTO };
}

const initialState: IYield = {
  farmsByAddress: {},
  farms: [],
  filteredFarms: [],
  loading: true,
  error: null,
  yieldByAddress: {},
};

const slice = createSlice({
  name: 'yield',
  initialState,
  reducers: {
    setFarms(state, action): void {
      const { farms } = action.payload;

      state.error = null;
      state.farms = farms;
      state.filteredFarms = farms;
      state.loading = false;
    },
    setFilteredFarms(state, action): void {
      const { filteredFarms } = action.payload;

      state.error = null;
      state.filteredFarms = filteredFarms;
      state.loading = false;
    },
    setFarmsByAddress(state, action): void {
      const { walletAddress, farms } = action.payload;

      state.error = null;
      state.farmsByAddress[walletAddress] = farms;
      state.loading = false;
    },
    setYieldByaddress(state, action): void {
      const { walletAddress, yieldDTO } = action.payload;

      state.error = null;
      state.yieldByAddress[walletAddress] = yieldDTO;
      state.loading = false;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setError(state, action): void {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { reducer } = slice;

export const getWalletFarms = (walletAddress: string): AppThunk => async (dispatch, getState): Promise<void> => {
  const {
    yield: { farmsByAddress },
  } = getState();

  if (farmsByAddress[walletAddress]) {
    return;
  }

  dispatch(slice.actions.setLoading(true));

  try {
    const response = await axios.publicFetchClient.get<IFarmsByWalletDTO>(`all/yield/${walletAddress}`, {
      baseURL: process.env.REACT_APP_FARMS_URL,
      prefix: 'bsc',
    });

    const farmsData = response.data;

    if (farmsData?.balances?.length) {
      dispatch(slice.actions.setFarmsByAddress({ walletAddress, farms: response.data }));
    }
  } catch (error) {
    loggerError('getWalletFarms', error);
    dispatch(slice.actions.setError('Unable to get wallet farms details'));
  }
};

export const getFarms = (query?: string): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setLoading(true));

  const currentFarms = getState().yield.farms;

  if (currentFarms.length) {
    const filtered = currentFarms.filter(
      (f) => f.token?.includes(query) || f.name?.includes(query) || f.provider?.includes(query),
    );

    dispatch(slice.actions.setFilteredFarms({ filteredFarms: filtered }));
    return;
  }

  try {
    const response = await axios.publicFetchClient.get<IFarmsDTO[]>('farms', {
      baseURL: process.env.REACT_APP_FARMS_URL,
      prefix: 'bsc',
    });

    const farmsWithData = response.data.filter((f) => f.name || f.token);

    const weightedFarms = farmsWithData.sort((a, b) => {
      if (!b.tvl?.usd) {
        return -1;
      }

      if (!a.tvl?.usd) {
        return 1;
      }

      return b.tvl?.usd - a.tvl?.usd;
    });

    dispatch(slice.actions.setFarms({ farms: weightedFarms }));
  } catch (error) {
    loggerError('getFarms', error);
    dispatch(slice.actions.setError('Unable to get wallet farms details'));
  }
};

export const getWalletYield = (walletAddress: string): AppThunk => async (dispatch, getState): Promise<void> => {
  const {
    yield: { yieldByAddress },
  } = getState();

  if (yieldByAddress[walletAddress]) {
    return;
  }

  dispatch(slice.actions.setLoading(true));

  try {
    const response = await axios.publicFetchClient.get<IFarmsByWalletDTO>(`stacking/${walletAddress}`);

    dispatch(slice.actions.setYieldByaddress({ walletAddress, yieldDTO: response.data }));
  } catch (error) {
    loggerError('getWalletYield', error);
    dispatch(slice.actions.setError('Unable to get wallet yield details'));
  }
};

export default slice;
