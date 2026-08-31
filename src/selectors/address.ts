import { RootStoreType } from 'src/store/rootReducer';

export const selectAddress = (store: RootStoreType) => store.address;
export const selectAddressDetail = (store: RootStoreType) => selectAddress(store).addressDetail;
export const selectAddressDetailLoading = (store: RootStoreType) => selectAddress(store).loadingAddressDetails;
export const selectAddressDetailError = (store: RootStoreType) => selectAddress(store).errorAddressDetail;
export const selectAddressDetailTokens = (store: RootStoreType) => selectAddressDetail(store)?.tokens;
export const selectAddressDetailTokensWithQuantity = (store: RootStoreType) =>
  selectAddressDetailTokens(store)?.filter((t) => t.quantity > 0 && t.token.found);
