import { RootStoreType } from 'src/store/rootReducer';

export const selectMarketplace = (store: RootStoreType) => store.marketplace;
export const selectMarketplaceDisplayAge = (store: RootStoreType) => selectMarketplace(store).displayAge;
