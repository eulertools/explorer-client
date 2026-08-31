import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { TokenDTO } from 'src/types/token';
import { loggerError } from 'src/utils/logger';
import { ESupportedNetworks } from '../../types/blockchain';

export interface IVaultItem {
  name: string;
  sendValue: string;
}

export interface IWalletDetail {
  tokens: TokenDTO[];
  address: string;
  created_at: string;
  identifier: string;
  name: string;
  total: number;
  totalBNB: number;
  user_sub: string;
}

export interface IWalletSlice {
  account: string;
  // my wallets
  myWallets: WalletItem[];
  getWalletsLoading: boolean;
  errorMyWallets: string;

  // create edit
  creatingLoading: boolean;
  errorCreatingEdit: string;

  // get details
  walletDetail: IWalletDetail;
  walletDetailLoading: boolean;
  error: string | null;

  // delete
  deleteLoading: boolean;
  deleteError: string | null;
}

export interface WalletCreateRequest {
  name: string;
  address: string;
  farms?: IVaultItem[];
  identifier: string;
  type: string;
  network: ESupportedNetworks;
  balance?: number;
}
export interface WalletUpdateFarmsRequest {
  address: string;
  farms: IVaultItem[];
  identifier: string;
}

export interface WalletResponse extends WalletCreateRequest {
  address: string;
  created_at: string;
  identifier: string;
  name: string;
  user_sub: string;
  hash_key?: string;
  range_key?: string;
  farms?: IVaultItem[];
}

export interface WalletItem extends WalletCreateRequest {}

const initialState: IWalletSlice = {
  account: null,

  // my wallets
  myWallets: [],
  getWalletsLoading: false,
  errorMyWallets: null,

  // create edit
  creatingLoading: false,
  errorCreatingEdit: null,

  // get details
  walletDetail: {
    tokens: [],
    address: '',
    created_at: '',
    identifier: '',
    name: '',
    total: null,
    totalBNB: null,
    user_sub: '',
  },
  walletDetailLoading: false,
  error: null,

  // delete
  deleteLoading: false,
  deleteError: null,
};

export const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccount(state, action): void {
      const account = action.payload;
      state.account = account;
    },

    // my wallets
    setMyWallets(state, action): void {
      state.myWallets = action.payload;
    },
    setGetWalletsLoading(state, action): void {
      state.getWalletsLoading = action.payload;
    },
    setErrorGetWalletsLoading(state, action): void {
      state.errorMyWallets = action.payload;
    },

    // get details
    resetWalletDetailsForFetch(state): void {
      state.walletDetail = initialState.walletDetail;
      state.walletDetailLoading = true;
      state.error = null;
    },
    setWalletDetail(state, action): void {
      state.walletDetail = action.payload;
      state.walletDetailLoading = false;
      state.error = null;
    },
    setWalletDetailLoading(state, action): void {
      state.walletDetailLoading = action.payload;
    },
    setError(state, action): void {
      state.error = action.payload;
    },

    // create edit
    setCreatingLoading(state, action): void {
      state.creatingLoading = action.payload;
    },
    setErrorCreatingLoading(state, action): void {
      state.errorCreatingEdit = action.payload;
    },

    // delete
    setDeleteLoading(state, action): void {
      state.deleteLoading = action.payload;
    },
    setDeleteError(state, action): void {
      state.deleteError = action.payload;
    },
  },
});

export const setAccount = (account: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setAccount(account));
};

// user private action
export const getMyWallets = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setGetWalletsLoading(true));
  dispatch(slice.actions.setMyWallets([]));
  dispatch(slice.actions.setErrorGetWalletsLoading(null));

  try {
    const response = await axios.privateFetchClient.get<any>('wallets');
    dispatch(slice.actions.setGetWalletsLoading(false));
    if (Array.isArray(response.data)) dispatch(slice.actions.setMyWallets(response.data));
    else throw new Error('Wallets should be an array');
  } catch (error) {
    loggerError('getMyWallets', error);
    dispatch(slice.actions.setErrorGetWalletsLoading('Unable to get your wallets'));
    dispatch(slice.actions.setGetWalletsLoading(false));
  }
};

// user private action
export const addNewWallet = (wallet: WalletCreateRequest) => async (dispatch): Promise<WalletResponse> => {
  dispatch(slice.actions.setCreatingLoading(true));
  dispatch(slice.actions.setErrorCreatingLoading(null));

  try {
    const response = await axios.privateFetchClient.post<WalletResponse>('wallets', wallet);
    dispatch(slice.actions.setCreatingLoading(false));
    dispatch(getMyWallets());

    return response.data;
  } catch (error) {
    loggerError('addNewWallet', error);
    dispatch(slice.actions.setErrorCreatingLoading('Unable to create the wallet'));
    dispatch(slice.actions.setCreatingLoading(false));
  }
  return null;
};

// user private action
export const editWallet = (wallet: WalletCreateRequest) => async (dispatch): Promise<WalletResponse> => {
  dispatch(slice.actions.setCreatingLoading(true));
  dispatch(slice.actions.setErrorCreatingLoading(null));

  try {
    const newWallet = {
      address: wallet.address,
      name: wallet.name,
    };
    const response = await axios.privateFetchClient.put<WalletResponse>(`wallets/${wallet.identifier}`, newWallet);
    dispatch(slice.actions.setCreatingLoading(false));
    dispatch(getMyWallets());

    return response.data;
  } catch (error) {
    loggerError('editWallet', error);
    dispatch(slice.actions.setErrorCreatingLoading('Unable to edit the wallet'));
    dispatch(slice.actions.setCreatingLoading(false));
  }
  return null;
};

// user private action
export const updateWalletFarms = (wallet: WalletUpdateFarmsRequest) => async (dispatch): Promise<WalletResponse> => {
  try {
    const response = await axios.privateFetchClient.put<WalletResponse>(`wallets/${wallet.identifier}`, wallet);
    dispatch(slice.actions.setCreatingLoading(false));
    return response.data;
  } catch (error) {
    loggerError('updateWalletFarms', error);
  }
  return null;
};

export const getWalletDetail = (address: string) => async (dispatch): Promise<IWalletDetail> => {
  dispatch(slice.actions.resetWalletDetailsForFetch());

  try {
    // Long timeout for this since wallets that have around 180 tokens take at least 40 seconds
    const response = await axios.privateFetchClient.get<IWalletDetail>(`wallets/${address}`, { timeout: 60000 });

    const walletDetails = response.data;
    dispatch(slice.actions.setWalletDetail(walletDetails));

    return walletDetails;
  } catch (error) {
    loggerError('getWalletDetail', error);
    dispatch(slice.actions.setError('Unable to get wallet details'));
    dispatch(slice.actions.setWalletDetailLoading(false));
  }
  return null;
};

export const deleteWallet = (identifier: string) => async (dispatch): Promise<WalletResponse> => {
  dispatch(slice.actions.setDeleteLoading(true));
  dispatch(slice.actions.setDeleteError(null));

  try {
    const response = await axios.privateFetchClient.delete<WalletResponse>(`wallets/${identifier}`);
    dispatch(slice.actions.setDeleteLoading(false));
    dispatch(getMyWallets());

    return response.data;
  } catch (error) {
    loggerError('deleteWallet', error);
    dispatch(slice.actions.setDeleteError('Unable to edit the wallet'));
    dispatch(slice.actions.setDeleteLoading(false));
  }
  return null;
};

export const { reducer } = slice;

export default slice;
