import { RootStoreType } from 'src/store/rootReducer';

export const selectPairTransaction = (store: RootStoreType) => store.pairTransactions;
export const selectPairTransactionDisplayAge = (store: RootStoreType) => selectPairTransaction(store).displayAge;
