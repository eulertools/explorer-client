import { RootStoreType } from 'src/store/rootReducer';

export const selectNFTStore = (store: RootStoreType) => store.nft;

export const selectNFTDetail = (store: RootStoreType) => selectNFTStore(store).nft;

export const selectRequestNFTDetail = (store: RootStoreType) => selectNFTStore(store).requestNFT;

export const selectNFTList = (store: RootStoreType) => selectNFTStore(store).nftList;

export const selectCollectionDetail = (store: RootStoreType) => selectNFTStore(store).collection;

export const selectCollectionList = (store: RootStoreType) => selectNFTStore(store).collectionList;

export const selectAssetsNFTList = (store: RootStoreType) => selectNFTStore(store).assetsNFTList;
