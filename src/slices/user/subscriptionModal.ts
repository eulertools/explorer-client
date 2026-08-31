import { createSlice } from '@reduxjs/toolkit';
import { TransferResponse } from 'src/hooks/useEulerContract';
import axios from 'src/lib/axios';
import { selectSubscriptionModal } from 'src/selectors/subscriptionModal';
import type { AppThunk } from 'src/store';
import { loggerException } from 'src/utils/logger';
import { UserSubscriptionType, IUserSubscriptionPermission } from './account';

export interface IModalSubscriptionSetting {
  active: boolean;
  created_at: string;
  details: IUserSubscriptionPermission;
  identifier: string;
  name: UserSubscriptionType;
  user_sub: string;
}

export interface IModalSubscription {
  steps: SubscriptionSteps[];
  loading: boolean;
  error: string | null;
  step: number;
  selectedPlan: UserSubscriptionType | null;
  eulerHolder: boolean | undefined;
  tx: Pick<TransferResponse, 'status' | 'to' | 'transactionHash' | 'transactionIndex' | 'blockHash' | 'blockNumber'>;
  subscriptionSetting: IModalSubscriptionSetting[];
  errorSubscriptionSetting: string | null;
  subscriptionUpdate: any;
  eulerBalance: number;
}

export enum SubscriptionSteps {
  subscription = 'subscription',
  payment = 'payment',
  confirmation = 'confirmation',
}

export enum SubscriptionStatus {
  processing = 'processing',
  confirmed = 'confirmed',
  expired = 'expired',
  invalid = 'invalid',
}

const initialState: IModalSubscription = {
  steps: [SubscriptionSteps.subscription, SubscriptionSteps.payment, SubscriptionSteps.confirmation],
  loading: false,
  error: null,
  step: 0,
  selectedPlan: null,
  eulerHolder: undefined,
  tx: null,
  subscriptionSetting: undefined,
  errorSubscriptionSetting: null,
  subscriptionUpdate: undefined,
  eulerBalance: 0,
};

const slice = createSlice({
  name: 'subcription-modal',
  initialState,
  reducers: {
    // details
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    nextStep(state): void {
      state.step += 1;
    },
    prevStep(state): void {
      state.step -= 1;
    },
    setError(state, action): void {
      state.error = action.payload;
    },
    setSelectedPlan(state, action): void {
      state.selectedPlan = action.payload;
    },
    setEulerHolder(state, action): void {
      state.eulerHolder = action.payload;
    },
    setTxn(state, action): void {
      state.tx = action.payload;
    },
    setSubscriptionSetting(state, action): void {
      state.subscriptionSetting = action.payload;
      state.errorSubscriptionSetting = null;
    },
    setErrorSubscriptionSetting(state, action): void {
      state.errorSubscriptionSetting = action.payload;
    },
    setEulerBalance(state, action): void {
      state.eulerBalance = action.payload;
    },
  },
});

export const getSubscriptionSettings = (): AppThunk => async (dispatch): Promise<IModalSubscriptionSetting> => {
  try {
    const response = await axios.publicFetchClient.get<IModalSubscriptionSetting>('subscription_settings');
    if ((response as any).data.className === 'bad-request') {
      dispatch(slice.actions.setErrorSubscriptionSetting('Unable to get subscription setting'));
      return null;
    }
    dispatch(slice.actions.setSubscriptionSetting(response.data));
    return response.data;
  } catch (e) {
    loggerException(e);
    dispatch(slice.actions.setErrorSubscriptionSetting('Unable to get subscription setting'));
  }
  return null;
};

export const sendTransactionInformation = (tx: TransferResponse): AppThunk => async (
  dispatch,
  getState,
): Promise<any> => {
  try {
    const store = getState();
    const modal = selectSubscriptionModal(store);
    dispatch(
      slice.actions.setTxn({
        status: tx.status,
        to: tx.to,
        transactionHash: tx.transactionHash,
        transactionIndex: tx.transactionIndex,
        blockHash: tx.blockHash,
        blockNumber: tx.blockNumber,
      }),
    );
    const { identifier } = modal.subscriptionSetting.find((s) => s.name === modal.selectedPlan);
    const response = await axios.privateFetchClient.put('subscriptions', {
      subscription: identifier,
      tx_hash: tx.transactionHash,
    });
    dispatch(slice.actions.setSubscriptionSetting(response.data));
    dispatch(slice.actions.nextStep());
  } catch (e) {
    loggerException(e);
    dispatch(slice.actions.setErrorSubscriptionSetting('Unable to get subscription setting'));
  }
  return null;
};

export const nextStepSubscriptionModal = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.nextStep());
};

export const prevStepSubscriptionModal = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.prevStep());
};

export const setSelectedPlan = (plan: UserSubscriptionType): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setSelectedPlan(plan));
};

export const setEulerHolder = (isEulerHolder: boolean): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setEulerHolder(isEulerHolder));
};

export const setEulerBalance = (balance: number): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setEulerBalance(balance));
};

export const { reducer } = slice;
export default slice;
