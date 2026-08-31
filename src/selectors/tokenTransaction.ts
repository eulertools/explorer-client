import { RootStoreType } from 'src/store/rootReducer';

export const selectTokenTransaction = (store: RootStoreType) => store.tokenTransactions;
export const selectTokenTransactionDisplayAge = (store: RootStoreType) => selectTokenTransaction(store).displayAge;
