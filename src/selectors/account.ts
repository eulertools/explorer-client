import { RootStoreType } from 'src/store/rootReducer';

export const selectAccount = (store: RootStoreType) => store.account;
export const selectAccountSubscription = (store: RootStoreType) => selectAccount(store).subscription;
