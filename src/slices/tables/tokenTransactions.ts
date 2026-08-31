import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { selectTokenTransactionDisplayAge } from 'src/selectors/tokenTransaction';
import { FilterParams } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { TokenTransaction } from 'src/types/blockchain';
import { loggerError } from 'src/utils/logger';

export interface TokenTransactionsResponseDTO {
  data: TokenTransaction[];
  limit: number;
  skip: number;
  total: number;
}

export interface ITokenTransactions {
  loadingTokenTransactions: boolean;
  errorTokenTransactions: string | null;
  detailTokenTransactions: TokenTransactionsResponseDTO | null;
  displayAge: boolean;
}

const initialState: ITokenTransactions = {
  loadingTokenTransactions: false,
  errorTokenTransactions: null,
  detailTokenTransactions: null,
  displayAge: true,
};

const slice = createSlice({
  name: 'token_transactions',
  initialState,
  reducers: {
    // details
    setLoadingTokenTransactionDetails(state): void {
      state.loadingTokenTransactions = true;
      state.detailTokenTransactions = undefined;
      state.errorTokenTransactions = null;
    },
    setTokenTransactionDetails(state, action): void {
      state.loadingTokenTransactions = false;
      state.detailTokenTransactions = action.payload;
    },
    setErrorTokenTransactionDetails(state, action): void {
      state.loadingTokenTransactions = false;
      state.errorTokenTransactions = action.payload;
    },
    setDisplayAge(state, action): void {
      state.displayAge = action.payload;
    },
  },
});

export const getTokenTransactionDetail = (
  address: string,
  filters: FilterParams,
  allEntries: boolean = false,
): AppThunk => async (dispatch): Promise<TokenTransactionsResponseDTO> => {
  try {
    dispatch(slice.actions.setLoadingTokenTransactionDetails());
    const { orderBy, orderDir, page, size, dateRange } = filters;
    const hackAddressToBackend = address.toLocaleLowerCase();
    let dateQuery = '';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    const response = await axios.publicFetchClient.get<TokenTransactionsResponseDTO>(
      `token_transfers?$or[from_address]=${hackAddressToBackend}&$or[to_address]=${hackAddressToBackend}&$limit=${
        size * (page + 1)
      }&$skip=${size * page}&$sort[${orderBy}]=${orderDir === 'desc' ? -1 : 1}${dateQuery}`,
      { timeout: 40000 },
    );
    dispatch(slice.actions.setTokenTransactionDetails(response.data));
    return response.data;
  } catch (error) {
    loggerError('getTokenTransactionDetail', error);
    dispatch(slice.actions.setErrorTokenTransactionDetails('Unable to get token transaction details'));
  }
  return null;
};

export const getTokenTransactionTotal = async (address: string, filters: FilterParams, allEntries: boolean = false) => {
  try {
    const { orderBy, orderDir, dateRange } = filters;
    const hackAddressToBackend = address.toLocaleLowerCase();
    let dateQuery = '';

    if (!allEntries) dateQuery = `&block_timestamp[$gte]=${dateRange[0]}&block_timestamp[$lte]=${dateRange[1]}`;

    const response = await axios.publicFetchClient.get<TokenTransactionsResponseDTO>(
      `token_transfers?$or[from_address]=${hackAddressToBackend}&$or[to_address]=${hackAddressToBackend}
      &$sort[${orderBy}]=${orderDir === 'desc' ? -1 : 1}
      &$limit=0&$skip=0${dateQuery}`,
      { timeout: 40000 },
    );
    return response.data.total;
  } catch (error) {
    loggerError('getTransactionDetail', error);
    return 0;
  }
};

export const toggleTransactionsDisplayAge = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.setDisplayAge(!selectTokenTransactionDisplayAge(getState())));
  return null;
};

export const { reducer } = slice;
export default slice;
