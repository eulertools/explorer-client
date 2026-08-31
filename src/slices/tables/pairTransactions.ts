import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { selectPairTransactionDisplayAge } from 'src/selectors/pairTransaction';
import { FilterParams } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { PairTransaction } from 'src/types/blockchain';
import { SelectOption } from 'src/types/option';
import { loggerError } from 'src/utils/logger';

export enum ETransactionType {
  SELL = 'sell',
  BUY = 'buy',
  ALL = 'all',
}

export const ETransactionTypeOptions: SelectOption[] = [
  { value: ETransactionType.ALL, label: 'ALL' },
  { value: ETransactionType.BUY, label: 'BUY' },
  { value: ETransactionType.SELL, label: 'SELL' },
];

export interface IPairTransactionsResponseDTO {
  data: PairTransaction[];
  limit: number;
  skip: number;
  total: number;
}

export interface IPairTransactions {
  loadingPairTransactions: boolean;
  errorPairTransactions: string | null;
  detailPairTransactions: IPairTransactionsResponseDTO | null;
  displayAge: boolean;
}

const initialState: IPairTransactions = {
  loadingPairTransactions: false,
  errorPairTransactions: null,
  detailPairTransactions: null,
  displayAge: false,
};

const slice = createSlice({
  name: 'pair_transactions',
  initialState,
  reducers: {
    setLoadingPairTransactionDetails(state): void {
      state.loadingPairTransactions = true;
      state.detailPairTransactions = undefined;
      state.errorPairTransactions = null;
    },
    setPairTransactionDetails(state, action): void {
      state.loadingPairTransactions = false;
      state.detailPairTransactions = action.payload;
    },
    setErrorPairTransactionDetails(state, action): void {
      state.loadingPairTransactions = false;
      state.errorPairTransactions = action.payload;
    },
    setDisplayAge(state, action): void {
      state.displayAge = action.payload;
    },
  },
});

export const getPairTransactionDetail = (
  address: string,
  filters: FilterParams,
  allEntries: boolean = false,
  prefix?: string,
): AppThunk => async (dispatch): Promise<IPairTransactionsResponseDTO> => {
  try {
    dispatch(slice.actions.setLoadingPairTransactionDetails());
    const { orderBy, orderDir, page, size, tradeType, dateRange, volumeRange } = filters;
    let tradeQuery = '';
    let dateQuery = '';
    let volumeQuery = `&volume[$gte]=${volumeRange[0]}&volume[$lte]=${volumeRange[1]}`;

    if (tradeType === 'sell') tradeQuery = '&base_out[$lte]=0&quote_in[$lte]=0';
    if (tradeType === 'buy') tradeQuery = '&base_in[$lte]=0&quote_out[$lte]=0';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    if (volumeRange[1] === -1) volumeQuery = `&volume[$gte]=${volumeRange[0]}`;

    const response = await axios.publicFetchClient.get<IPairTransactionsResponseDTO>(
      `trades?address=${address}&$sort[${orderBy}]=${orderDir === 'desc' ? -1 : 1}&$limit=${size}&$skip=${
        size * page
      }${dateQuery}${tradeQuery}${volumeQuery}`,
      { timeout: 60000, prefix },
    );
    dispatch(slice.actions.setPairTransactionDetails(response.data));
    return response.data;
  } catch (error) {
    loggerError('getPairTransactionDetail', error);
    dispatch(slice.actions.setErrorPairTransactionDetails('Unable to get Pair Transaction Details'));
  }
  return null;
};

export const getPairTransactionTotal = async (
  address: string,
  filters: FilterParams,
  allEntries: boolean,
  prefix?: string,
) => {
  try {
    const { orderBy, orderDir, tradeType, dateRange, volumeRange } = filters;
    let dateQuery = '';
    let tradeQuery = '';
    let volumeQuery = `&volume[$gte]=${volumeRange[0]}&volume[$lte]=${volumeRange[1]}`;

    if (tradeType === 'sell') tradeQuery = '&base_out[$lte]=0&quote_in[$lte]=0';
    if (tradeType === 'buy') tradeQuery = '&base_in[$lte]=0&quote_out[$lte]=0';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    if (volumeRange[1] === -1) volumeQuery = `&volume[$gte]=${volumeRange[0]}`;

    const response = await axios.publicFetchClient.get<IPairTransactionsResponseDTO>(
      `trades?address=${address}&$sort[${orderBy}]=${
        orderDir === 'desc' ? -1 : 1
      }&$limit=0&$skip=0${dateQuery}${tradeQuery}${volumeQuery}`,
      { timeout: 60000, prefix },
    );
    return response.data.total;
  } catch (error) {
    loggerError('getPairTransactionTotal', error);
    return 0;
  }
};

export const togglePairTransactionsDisplayAge = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setDisplayAge(!selectPairTransactionDisplayAge(getState())));
  return null;
};

export const { reducer } = slice;
export default slice;
