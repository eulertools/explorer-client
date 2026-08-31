import { createSlice } from '@reduxjs/toolkit';
import axios, { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { IChain } from 'src/types/configuration';
import { IESSearchItem } from 'src/types/search';
import { logger } from 'src/utils/logger';
import type { AppThunk } from '../store';

export const POLL_INTERVAL_TIME = 20000;

let POLL_INTERVAL = null;

export const defaultCoinData = {
  mainValue: 0,
  change: 0,
  lastDayChange: 0,
  lastDayChangeValue: 0,
  lastDayVolume: 0,
  indexPrice: 0,
  fundingPrice: 0,
  markPrice: 0,
  lastPrice: 0,
  tokenLink: '',
};

export const defaultPoolData = {
  eulerBalance: null,
  bnbBalance: null,
  LPBalance: null,
};

export const defaultPoolDataBUSD = {
  eulerBalance: null,
  busdBalance: null,
  LPBalance: null,
  price: null,
};

export const defaultBNBData = {
  price: null,
};

export const defaultTokenPriceData = {};

export const defaultBTCData = {
  price: null,
};

export const defaultWETHData = {
  price: null,
};

const initialState = {
  pollInitiated: false,
  coinData: defaultCoinData,
  bnbData: defaultBNBData,
  poolDatav2: defaultPoolData,
  poolDataBUSD: defaultPoolDataBUSD,
  tokenPriceData: defaultTokenPriceData,
  btcData: defaultBTCData,
  wethData: defaultWETHData,
};

const slice = createSlice({
  name: 'coindata',
  initialState,
  reducers: {
    setPollinitiated(state, action): void {
      const initiated = action.payload;

      state.pollInitiated = initiated;
    },
    setCoinData(state, action): void {
      const data = action.payload;

      state.coinData = data;
    },
    setPoolDatav2(state, action): void {
      const data = action.payload;

      state.poolDatav2 = data;
    },
    setPoolDataBUSD(state, action): void {
      const data = action.payload;

      state.poolDataBUSD = data;
    },
    setBNBData(state, action): void {
      const data = action.payload;

      state.bnbData = data;
    },
    setBTCData(state, action): void {
      const data = action.payload;

      state.btcData = data;
    },
    setWETHData(state, action): void {
      const data = action.payload;

      state.wethData = data;
    },
    addTokenPriceData(state, action): void {
      const data = action.payload;

      state.tokenPriceData = { ...state.tokenPriceData, [data.tokenAddress]: data.tokenInfo };
    },
  },
});

export const { reducer } = slice;

export const fetchPoolDatav2 = (): AppThunk => async (dispatch): Promise<void> =>
  axios.publicFetchClient
    .get(`/pools/0x09907AA171cD131Eba5AcbAEEC4991d66A21294F`, {
      prefix: 'bsc',
    })
    .then((response) => response.data)
    .then((response) => {
      dispatch(
        slice.actions.setPoolDatav2({
          eulerBalance: response?.token1?.balance ?? null,
          bnbBalance: response?.token2?.balance ?? null,
          LPBalance: response?.LPBalance ?? null,
        }),
      );
    })
    .catch((e) => {
      logger('FETCH POOL DATA V2 FAILED', e);
    });

export const fetchPoolDataBUSD = (): AppThunk => async (dispatch): Promise<void> =>
  axios.publicFetchClient
    .get(`/pools/0xda98731d7Ca75bbf22FD1251d8B1dC6053018129`, {
      prefix: 'bsc',
    })
    .then((response) => response.data)
    .then((response) => {
      dispatch(
        slice.actions.setPoolDataBUSD({
          eulerBalance: response?.token1?.balance ?? null,
          busdBalance: response?.token2?.balance ?? null,
          LPBalance: response?.LPBalance ?? null,
          price: response?.price ?? null,
        }),
      );
    })
    .catch((e) => {
      logger('FETCH POOL DATA BUSD FAILED', e);
    });

export const fetchBTCData = (chain: Record<string, IChain>): AppThunk => async (dispatch): Promise<void> => {
  const network = getSelectedNetworkFromLocalstorage();
  return axios.publicFetchClient
    .get<IESSearchItem>(`tokens/${chain[network].tokens.btc.address}?fields[]=price_usd`)
    .then((response) => response.data)
    .then((response) => {
      dispatch(
        slice.actions.setBTCData({
          price: response?._source?.price_usd ?? null,
        }),
      );
    })
    .catch((e) => {
      logger('FETCH BTC DATA FAILED', e);
    });
};

export const fetchBNBData = (bscChain: IChain): AppThunk => async (dispatch): Promise<void> =>
  axios.publicFetchClient
    .get<IESSearchItem>(`tokens/${bscChain.tokens.bnb.address}?fields[]=price_usd`, {
      prefix: 'bsc',
    })
    .then((response) => response.data)
    .then((response) => {
      dispatch(
        slice.actions.setBNBData({
          price: response?._source?.price_usd ?? null,
        }),
      );
    })
    .catch((e) => {
      logger('FETCH BNB DATA FAILED', e);
    });

export const fetchWETHData = (ethChain: IChain): AppThunk => async (dispatch): Promise<void> =>
  axios.publicFetchClient
    .get<IESSearchItem>(`tokens/${ethChain.tokens.eth.address}?fields[]=price_usd`, { prefix: 'eth' })
    .then((response) => response.data)
    .then((response) => {
      dispatch(
        slice.actions.setWETHData({
          price: response?._source?.price_usd ?? null,
        }),
      );
    })
    .catch((e) => {
      logger('FETCH WETH DATA FAILED', e);
    });

export const initiatePoll = (chain: Record<string, IChain>): AppThunk => async (dispatch): Promise<void> => {
  function fetchData() {
    Promise.all([
      dispatch(fetchPoolDataBUSD()),
      dispatch(fetchBTCData(chain)),
      dispatch(fetchBNBData(chain.bsc)),
      dispatch(fetchWETHData(chain.eth)),
      // TODO here for each token price we have we will need to update
    ]);
  }

  POLL_INTERVAL = setInterval(() => {
    fetchData();
  }, POLL_INTERVAL_TIME);

  // initial run
  fetchData();

  dispatch(slice.actions.setPollinitiated(true));
};

export const stopPoll = (): AppThunk => async (dispatch): Promise<void> => {
  clearInterval(POLL_INTERVAL);

  dispatch(slice.actions.setPollinitiated(false));
};

export default slice;
