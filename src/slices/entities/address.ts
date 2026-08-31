import { createSlice } from '@reduxjs/toolkit';
import axios, { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { IChain } from 'src/types/configuration';
import { TokenDTO } from 'src/types/token';
import { loggerError } from 'src/utils/logger';
import { isBNBToken } from 'src/utils/marketplace';

export type AddressType = 'default' | 'contract';

export interface AddressDetailResponseDTO {
  tokens: TokenDTO[];
  total: number;
  totalBNB: number;
  balance: number;
}
export interface AddressDetail extends AddressDetailResponseDTO {}

export interface IAddressState {
  addressType: AddressType;

  // details
  addressDetail: AddressDetail | undefined;
  loadingAddressDetails: boolean;
  errorAddressDetail: string | null;
}

const initialState: IAddressState = {
  addressType: 'default',
  // details
  addressDetail: undefined,
  loadingAddressDetails: false,
  errorAddressDetail: null,
};

const slice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressType(state, action): void {
      const { addressType } = action.payload;
      state.addressType = addressType;
    },
    // details
    setLoadingAddressDetails(state): void {
      state.loadingAddressDetails = true;
      state.addressDetail = undefined;
      state.errorAddressDetail = null;
    },
    setAddressDetail(state, action): void {
      state.loadingAddressDetails = false;
      state.addressDetail = action.payload;
    },
    setErrorDetails(state, action): void {
      state.loadingAddressDetails = false;
      state.errorAddressDetail = action.payload;
    },
  },
});

export const setAddressType = (addressType: AddressType): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setAddressType({ addressType }));
};

export const getAddressDetail = (address: string) => async (dispatch): Promise<AddressDetailResponseDTO> => {
  try {
    dispatch(slice.actions.setLoadingAddressDetails());
    const response = await axios.publicFetchClient.get<AddressDetailResponseDTO>(`addresses/${address}`);
    dispatch(slice.actions.setAddressDetail(response.data));
    return response.data;
  } catch (error) {
    loggerError('getAddressDetail', error);
    dispatch(slice.actions.setErrorDetails('Unable to get address details'));
  }
  return null;
};

export const getAddressData = async (address: string, chain: Record<string, IChain>) => {
  try {
    const network = getSelectedNetworkFromLocalstorage();
    const walletAddress = isBNBToken(address) ? chain[network].tokens.bnb.address : address;
    const response = await axios.publicFetchClient.get<AddressDetailResponseDTO>(`addresses/${walletAddress}`);
    return response.data;
  } catch (e) {
    return null;
  }
};

export const getAddressDataV2 = async (address: string, chain: Record<string, IChain>) => {
  try {
    const network = getSelectedNetworkFromLocalstorage();
    const walletAddress = isBNBToken(address) ? chain[network].tokens.bnb.address : address;
    const response = await axios.publicFetchClient.get<AddressDetailResponseDTO>(`addresses/${walletAddress}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const { reducer } = slice;

export default slice;
