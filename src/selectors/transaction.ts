import { RootStoreType } from 'src/store/rootReducer';

export const selectTransaction = (store: RootStoreType) => store.transactions;
export const selectTransactionDisplayAge = (store: RootStoreType) => selectTransaction(store).displayAge;
