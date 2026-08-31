import { createSlice } from '@reduxjs/toolkit';
import { selectActiveGlobalModals } from 'src/selectors/globalModals';
import type { AppThunk } from 'src/store';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { loggerError } from 'src/utils/logger';

export enum UIModal {
  subscription = 'subscription',
  nft = 'nft',
}
export interface GlobalModalItem<T = any> {
  type: EulerAddressTypes | UIModal;
  identifier: string;
  config?: T;
}

export interface GlobalModalSlice {
  [EulerAddressTypes.token]: {};
  [EulerAddressTypes.address]: {};
  active: GlobalModalItem[];
}

const initialState: GlobalModalSlice = {
  [EulerAddressTypes.token]: {},
  [EulerAddressTypes.address]: {},
  active: [],
};

const uniqueKey = (item: GlobalModalItem) => `${item.identifier}${item.type}`;

const slice = createSlice({
  name: 'global-modal',
  initialState,
  reducers: {
    openModal(state, action): void {
      state.active.push(action.payload);
    },
    closeModal(state, action): void {
      state.active = state.active.filter((i) => uniqueKey(i) !== uniqueKey(action.payload));
    },
  },
});

export const { reducer } = slice;

export const openModal = (modal: GlobalModalItem): AppThunk => async (dispatch, getState): Promise<void> => {
  try {
    const active = selectActiveGlobalModals(getState()).find((i) => uniqueKey(i) === uniqueKey(modal));
    if (active) throw new Error('Duplicate modal');

    dispatch(slice.actions.openModal(modal));
  } catch (error) {
    loggerError(error);
  }
};

export const closeModal = (modal: GlobalModalItem): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.closeModal(modal));
  } catch (error) {
    loggerError(error);
  }
};

export default slice;
