import { RootStoreType } from 'src/store/rootReducer';

export const selectTxns = (store: RootStoreType) => store.txns;
export const selectTxnsDataByAddress = (address: string) => (store: RootStoreType) => selectTxns(store)[address];
