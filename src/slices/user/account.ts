import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { loggerException } from 'src/utils/logger';

export enum UserSubscriptionType {
  free = 'free',
  advanced = 'advanced',
  enterprise = 'enterprise',
}

export enum SubscriptionStatus {
  processing = 'processing',
  confirmed = 'confirmed',
  expired = 'expired',
  invalid = 'invalid',
}

export interface IUserSubscriptionPermission {
  alerts: boolean;
  notifications: {
    wallet: boolean;
  };
  portfolioEntities: number;
  portfolios: number;
  staking: {
    portfolioEntities: number;
    portfolios: number;
  };
  wallets: number;
}

export interface IUserSubscription {
  // active: boolean;
  name: UserSubscriptionType;
  permissions: IUserSubscriptionPermission;
  status: SubscriptionStatus;
  subscription: string;
  tx_hash: string;
  user_sub: string;
  created_at: string;
  identifier: string;
}
export interface IAccount {
  identifier: string | null;
  loading: boolean;
  errorAccount: string | null;
  subscription: IUserSubscription;
}

const initialState: IAccount = {
  identifier: null,
  subscription: {
    // active: false,
    name: undefined,
    permissions: {
      alerts: false,
      notifications: {
        wallet: false,
      },
      portfolioEntities: 0,
      portfolios: 0,
      staking: {
        portfolioEntities: 0,
        portfolios: 0,
      },
      wallets: 0,
    },
    status: undefined,
    subscription: undefined,
    tx_hash: undefined,
    user_sub: undefined,
    created_at: undefined,
    identifier: undefined,
  },
  loading: false,
  errorAccount: null,
};

const slice = createSlice({
  name: 'user-account',
  initialState,
  reducers: {
    // details
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setAccountDetail(state, action): void {
      state.subscription = action.payload;
      state.loading = false;
      state.errorAccount = null;
    },
    setAccountError(state, action): void {
      state.loading = false;
      state.errorAccount = action.payload;
    },
  },
});

export const getUserAccount = (): AppThunk => async (dispatch): Promise<IUserSubscription> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const response = await axios.privateFetchClient.get('accounts/me');
    dispatch(slice.actions.setAccountDetail(response.data.subscription));
  } catch (e) {
    loggerException(e);
    dispatch(slice.actions.setAccountError('Unable to get account'));
  }

  return null;
};

export const clearUserAccount = (): AppThunk => async (dispatch): Promise<IUserSubscription> => {
  try {
    dispatch(slice.actions.setAccountDetail(initialState));
  } catch (e) {
    loggerException(e);
    dispatch(slice.actions.setAccountError('Unable to clear account'));
  }

  return null;
};

export const { reducer } = slice;
export default slice;
