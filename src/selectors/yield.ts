import { RootStoreType } from 'src/store/rootReducer';

export const selectYield = (store: RootStoreType) => store.yield;
export const selectYieldFarmsByAddress = (store: RootStoreType) => selectYield(store).farmsByAddress;
