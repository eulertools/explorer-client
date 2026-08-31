import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import bodybuilder from 'bodybuilder';
import axios, { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { FilterParams, UITableSort } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import {
  INFTItem,
  INFTAdItemData,
  IRequestNFTItem,
  IRequestNFTItemResponse,
  IRequestAssetNFTListResponse,
  IAssetNFT,
} from 'src/types/nft';
import { logger } from 'src/utils/logger';

interface INFT {
  nft: INFTItem;
  loading: boolean;
  error: string | null;
}

interface IRequestNFT {
  requestNFT: IRequestNFTItem;
  loading: boolean;
  error: string | null;
}

interface INFTList {
  nfts: INFTAdItemData[];
  total: number;
  loading: boolean;
  error: string | null;
}

interface ICollection {
  collection: any;
  loading: boolean;
  error: string | null;
}

interface ICollectionList {
  collections: any[];
  total: number;
  loading: boolean;
  error: string | null;
}
interface IAssetsNFTList {
  nfts: IAssetNFT[];
  cursors: string[];
  page: number;
  total: number;
  loading: boolean;
  error: string | null;
}

interface IStore {
  nft: INFT;
  requestNFT: IRequestNFT;
  nftList: INFTList;
  collection: ICollection;
  collectionList: ICollectionList;
  assetsNFTList: IAssetsNFTList;
}

const initialState: IStore = {
  nft: {
    nft: null,
    loading: false,
    error: null,
  },
  requestNFT: {
    requestNFT: null,
    loading: false,
    error: null,
  },
  nftList: {
    nfts: [],
    total: 0,
    loading: false,
    error: null,
  },
  collection: {
    collection: null,
    loading: false,
    error: null,
  },
  collectionList: {
    collections: [],
    total: 0,
    loading: false,
    error: null,
  },
  assetsNFTList: {
    nfts: [],
    total: 0,
    page: 1,
    loading: false,
    error: null,
    cursors: [null],
  },
};

const slice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setNFTLoading(state: IStore): void {
      state.nft.loading = true;
      state.nft.error = null;
      state.nft.nft = null;
    },
    setRequestNFTLoading(state: IStore): void {
      state.requestNFT.loading = true;
      state.requestNFT.error = null;
      state.requestNFT.requestNFT = null;
    },
    setNFTListLoading(state: IStore): void {
      state.nftList.loading = true;
      state.nftList.error = null;
      state.nftList.total = 0;
      state.nftList.nfts = [];
    },
    setCollectionLoading(state: IStore): void {
      state.collection.loading = true;
      state.collection.error = null;
      state.collection.collection = null;
    },
    setCollectionListLoading(state: IStore): void {
      state.collectionList.loading = true;
      state.collectionList.error = null;
      state.collectionList.total = 0;
      state.collectionList.collections = [];
    },
    setAssetsNFTListLoading(state: IStore): void {
      state.assetsNFTList.loading = true;
      state.assetsNFTList.error = null;
    },
    setNFTError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.nft.loading = false;
      state.nft.error = error;
    },
    setRequestNFTError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.requestNFT.loading = false;
      state.requestNFT.error = error;
    },
    setNFTListError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.nftList.loading = false;
      state.nftList.error = error;
    },
    setCollectionError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.collection.loading = false;
      state.collection.error = error;
    },
    setCollectionListError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.collectionList.loading = false;
      state.collectionList.error = error;
    },
    setAssetsNFTListError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;
      state.assetsNFTList.loading = false;
      state.assetsNFTList.error = error;
      state.assetsNFTList.total = 0;
      state.assetsNFTList.page = 1;
      state.assetsNFTList.cursors = [null];
      state.assetsNFTList.nfts = [];
    },
    setNFT(state: IStore, action: PayloadAction<{ nft: INFTItem }>): void {
      const { nft } = action.payload;
      state.nft.loading = false;
      state.nft.error = null;
      state.nft.nft = nft;
    },
    setRequestNFT(state: IStore, action: PayloadAction<{ requestNFT: IRequestNFTItem }>): void {
      const { requestNFT } = action.payload;
      state.requestNFT.loading = false;
      state.requestNFT.error = null;
      state.requestNFT.requestNFT = requestNFT;
    },
    setNFTList(state: IStore, action: PayloadAction<{ nfts: INFTAdItemData[]; total: number }>) {
      const { nfts, total } = action.payload;
      state.nftList.loading = false;
      state.nftList.error = null;
      state.nftList.total = total;
      state.nftList.nfts = nfts;
    },
    setCollection(state: IStore, action: PayloadAction<{ collection: any }>) {
      const { collection } = action.payload;
      state.collection.loading = false;
      state.collection.error = null;
      state.collection.collection = collection;
    },
    setCollectionList(state: IStore, action: PayloadAction<{ collections: any[]; total: number }>) {
      const { collections, total } = action.payload;
      state.collectionList.loading = false;
      state.collectionList.error = null;
      state.collectionList.total = total;
      state.collectionList.collections = collections;
    },
    setAssetsNFTList(
      state: IStore,
      action: PayloadAction<{ nfts: IAssetNFT[]; total: number; page: number; cursor: string }>,
    ) {
      const { nfts, total, page, cursor } = action.payload;
      state.assetsNFTList.loading = false;
      state.assetsNFTList.error = null;
      state.assetsNFTList.total = total;
      state.assetsNFTList.nfts = nfts;
      if (state.assetsNFTList.cursors[page] === undefined) {
        state.assetsNFTList.cursors = [...state.assetsNFTList.cursors, cursor];
      }
    },
  },
});

// TODO remove network param & prefix once we support multiple networks
export const getNFT = (address: string, tokenId: string, network?: string): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  try {
    dispatch(slice.actions.setNFTLoading());

    const combinedState = getState();

    const response = await axios.publicFetchClient.get<INFTItem>(`nft/${address}/${tokenId}`, {
      baseURL: combinedState.settings.urls.nft_api,
      prefix: network,
    });

    dispatch(slice.actions.setNFT({ nft: response.data }));
  } catch (error) {
    logger('getNFT', error);
    dispatch(slice.actions.setNFTError({ error: 'Unable to get nft detail.' }));
  }
  return null;
};

// TODO remove network param & prefix once we support multiple networks
export const getRequestNFT = (address: string, tokenId: string, receiver: string, network?: string): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  try {
    dispatch(slice.actions.setRequestNFTLoading());

    const combinedState = getState();

    const response = await axios.publicFetchClient.get<IRequestNFTItem>(
      `request-nft/${address}/${tokenId}/receiver/${receiver.toLowerCase()}`,
      {
        baseURL: combinedState.settings.urls.nft_api,
        // TODO remove once we support multiple networks
        prefix: network,
      },
    );

    dispatch(slice.actions.setRequestNFT({ requestNFT: response.data }));
  } catch (error) {
    logger('getRequestNFT', error);
    dispatch(slice.actions.setRequestNFTError({ error: 'Unable to get nft contract detail.' }));
  }
};

export const createRequestNFT = (
  address: string,
  tokenId: string,
  receiver: string,
  password: string,
  network?: string,
): AppThunk => async (dispatch, getState): Promise<void> => {
  try {
    dispatch(slice.actions.setRequestNFTLoading());

    const combinedState = getState();
    // Required for GET & POST API
    const accountLowercase = receiver.toLowerCase();

    const response = await axios.publicFetchClient.post<IRequestNFTItemResponse>(
      `request-nft/${address}/${tokenId}/claim-words`,
      {
        claim_words: password,
        receiver: accountLowercase,
      },
      {
        baseURL: combinedState.settings.urls.nft_api,
        prefix: network,
      },
    );

    const requestNFT = {
      data: response.data.payload.data,
      signature: response.data.payload.signature,
      position: response.data.payload.position,
    };

    dispatch(slice.actions.setRequestNFT({ requestNFT }));
  } catch (error) {
    logger('createRequestNFT', error);
    dispatch(slice.actions.setRequestNFTError({ error: 'Unable to get nft contract detail.' }));
  }
};

export const getNFTList = () => async (dispatch, getState): Promise<void> => {
  try {
    dispatch(slice.actions.setNFTListLoading());

    const combinedState = getState();

    const response = await axios.publicFetchClient.post<any>('marketplace/ad/search', null, {
      baseURL: combinedState.settings.urls.nft_api,
      prefix: '',
    });

    const { results, total } = response.data;

    dispatch(slice.actions.setNFTList({ nfts: results, total }));
  } catch (error) {
    logger('getNFTList', error);
    dispatch(slice.actions.setNFTListError({ error: 'Unable to get nft list.' }));
  }
};

export const getCollectionList = (filters: FilterParams, fields?: string[]): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  try {
    dispatch(slice.actions.setNFTListLoading());

    const { query, size, page, orderBy, orderDir } = filters;
    const queryObj = bodybuilder();

    // Filter by name containing the query
    if (query) queryObj.query('multi_match', { query, fields: fields || ['address', 'name', 'description', 'kind'] });

    if (orderBy && orderDir) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((by) => queryObj.sort(by, orderDir));
      } else {
        queryObj.sort(orderBy, orderDir);
      }
    } else {
      queryObj.sort('token_id', UITableSort.desc);
    }

    const network = getSelectedNetworkFromLocalstorage();
    queryObj.query('terms', 'blockchain', [network]);

    const qBuilt = queryObj.build() as any;

    const body = {
      size,
      from: size * page,
      sort: qBuilt.sort ? qBuilt.sort : [],
      query: qBuilt.query,
    };

    const combinedState = getState();

    const response = await axios.publicFetchClient.post<any>('collection/search', body, {
      baseURL: combinedState.settings.urls.nft_api,
    });

    const { results, total } = response.data;

    dispatch(slice.actions.setNFTList({ nfts: results, total }));
  } catch (error) {
    logger('getCollectionList', error);
    dispatch(slice.actions.setNFTListError({ error: 'Unable to get collection list.' }));
  }
};

export const getAssetsNFTList = (filters: FilterParams, address: string): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  try {
    dispatch(slice.actions.setAssetsNFTListLoading());

    const { size = 8, cursor: filterCursor } = filters;

    const combinedState = getState();

    const assetUrl = `address/${address}?size=${size}${filterCursor ? `&cursor=${filterCursor}` : ''}`;

    const response = await axios.publicFetchClient.get<IRequestAssetNFTListResponse>(assetUrl, {
      baseURL: combinedState.settings.urls.nft_api,
    });

    const { total, page, cursor, result } = response.data;

    dispatch(slice.actions.setAssetsNFTList({ nfts: result, total, page, cursor }));
  } catch (error) {
    logger('getAssetsNFTList', error);
    dispatch(slice.actions.setAssetsNFTListError({ error: 'Unable to get Asset nfts detail.' }));
  }
};

export const { reducer } = slice;
export default slice;
