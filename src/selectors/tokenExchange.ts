import { RootStoreType } from 'src/store/rootReducer';

export const selectTokenExchange = (store: RootStoreType) => store.tokenExchanges;
export const selectTokenExchangeDataByAddress = (address: string) => (store: RootStoreType) =>
  selectTokenExchange(store)[address];
