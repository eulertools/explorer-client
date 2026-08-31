import { RootStoreType } from 'src/store/rootReducer';

export const selectExchange = (store: RootStoreType) => store.exchanges;
export const selectExchangeDisplayAge = (store: RootStoreType) => selectExchange(store).displayAge;
