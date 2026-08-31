import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { selectTransactionDisplayAge } from 'src/selectors/transaction';
import { FilterParams } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { Transaction } from 'src/types/blockchain';
import { loggerError } from 'src/utils/logger';

export interface TransactionsResponseDTO {
  data: Transaction[];
  limit: number;
  skip: number;
  total: number;
}

export interface ITransactions {
  loadingTransactions: boolean;
  errorTransactions: string | null;
  detailTransactions: TransactionsResponseDTO | null;
  displayAge: boolean;
}

const initialState: ITransactions = {
  loadingTransactions: false,
  errorTransactions: null,
  detailTransactions: null,
  displayAge: true,
};

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // details
    setLoadingTransactionDetails(state): void {
      state.loadingTransactions = true;
      state.detailTransactions = undefined;
      state.errorTransactions = null;
    },
    setTransactionDetails(state, action): void {
      state.loadingTransactions = false;
      state.detailTransactions = action.payload;
    },
    setErrorTransactionDetails(state, action): void {
      state.loadingTransactions = false;
      state.errorTransactions = action.payload;
    },
    setDisplayAge(state, action): void {
      state.displayAge = action.payload;
    },
  },
});

export const getTransactionDetail = (
  address: string,
  filters: FilterParams,
  to?: string,
  allEntries: boolean = false,
): AppThunk => async (dispatch): Promise<TransactionsResponseDTO> => {
  try {
    dispatch(slice.actions.setLoadingTransactionDetails());
    const { orderBy, orderDir, page, size, dateRange } = filters;
    const hackAddressToBackend = address.toLocaleLowerCase();
    let dateQuery = '';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    const response = await axios.publicFetchClient.get<TransactionsResponseDTO>(
      `transactions?$or[from_address]=${hackAddressToBackend}&$or[to_address]=${
        to || hackAddressToBackend
      }&$sort[${orderBy}]=${orderDir === 'desc' ? -1 : 1}&$limit=${size * (page + 1)}&$skip=${size * page}${dateQuery}`,
    );
    dispatch(slice.actions.setTransactionDetails(response.data));
    return response.data;
  } catch (error) {
    loggerError('getTransactionDetail', error);
    dispatch(slice.actions.setErrorTransactionDetails('Unable to get transaction details'));
  }
  return null;
};

export const getTransactionTotal = async (
  address: string,
  filters: FilterParams,
  to?: string,
  allEntries: boolean = false,
) => {
  try {
    const { orderBy, orderDir, dateRange } = filters;
    const hackAddressToBackend = address.toLocaleLowerCase();
    let dateQuery = '';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    const response = await axios.publicFetchClient.get<TransactionsResponseDTO>(
      `transactions?$or[from_address]=${hackAddressToBackend}&$or[to_address]=${
        to || hackAddressToBackend
      }&$sort[${orderBy}]=${orderDir === 'desc' ? -1 : 1}&$limit=0&$skip=0${dateQuery}`,
    );
    return response.data.total;
  } catch (error) {
    loggerError('getTransactionDetail', error);
    return 0;
  }
};

export const toggleTransactionsDisplayAge = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setDisplayAge(!selectTransactionDisplayAge(getState())));
  return null;
};

export const { reducer } = slice;
export default slice;
