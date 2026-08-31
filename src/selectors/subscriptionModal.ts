import { RootStoreType } from 'src/store/rootReducer';

export const selectSubscriptionModal = (store: RootStoreType) => store.subscriptionModal;

export const selectSubscriptionModalIsHolder = (store: RootStoreType) => selectSubscriptionModal(store).eulerHolder;
export const selectSubscriptionModalHasTX = (store: RootStoreType) => selectSubscriptionModal(store).tx;
export const selectSubscriptionModalSelectedPlan = (store: RootStoreType) =>
  selectSubscriptionModal(store).selectedPlan;
export const selectSubscriptionModalSettings = (store: RootStoreType) =>
  selectSubscriptionModal(store).subscriptionSetting;
export const selectSubscriptionModalErrorSettings = (store: RootStoreType) =>
  selectSubscriptionModal(store).errorSubscriptionSetting;
