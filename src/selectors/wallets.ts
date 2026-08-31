import { RootStoreType } from 'src/store/rootReducer';
import { getAmountPriceToken } from 'src/utils/price';

export const selectWallet = (store: RootStoreType) => store.wallet;
export const selectMyWallets = (store: RootStoreType) => selectWallet(store).myWallets;
export const selectWalletTokens = (store: RootStoreType) => {
  try {
    if (selectWallet(store).walletDetail && selectWallet(store).walletDetail.tokens)
      return selectWallet(store).walletDetail.tokens.filter((t) => t.quantity > 0 && t.token.found);
    return [];
  } catch (error) {
    return [];
  }
};

export const selectWalletTokensSorted = (store: RootStoreType) =>
  selectWalletTokens(store).sort((a, b) => getAmountPriceToken(b) - getAmountPriceToken(a));

export const selectWalletByAddress = (address: string) => (store: RootStoreType) =>
  selectWallet(store).myWallets.find((w) => w.address === address);

export const selectWalletsLoading = (store: RootStoreType) => selectWallet(store).getWalletsLoading;
