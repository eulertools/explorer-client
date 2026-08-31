import { RootStoreType } from 'src/store/rootReducer';

export const selectPortfolios = (store: RootStoreType) => store.portfolios;
export const selectPortfoliosList = (store: RootStoreType) => selectPortfolios(store).portfolios;
