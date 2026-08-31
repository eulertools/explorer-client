import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { loggerError } from 'src/utils/logger';

export interface FavoriteItem {
  identifier?: string;
  name: string;
  type: string;
  symbol?: string;
  address?: string;
  network?: ESupportedNetworks;
  range_key?: string;
}

interface IStore {
  favorites: FavoriteItem[];
  loading: boolean;
  error: string | null;
}

const initialState: IStore = {
  favorites: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setLoading(state: IStore): void {
      state.loading = true;
      state.error = null;
      state.favorites = [];
    },
    setError(state: IStore, action: PayloadAction<{ error: string | null }>): void {
      const { error } = action.payload;

      state.loading = false;
      state.error = error;
      state.favorites = [];
    },
    addFavorite(state: IStore, action: PayloadAction<{ favorite: FavoriteItem }>): void {
      const { favorite } = action.payload;

      state.favorites = [...state.favorites, favorite];
    },
    editFavorite(state: IStore, action: PayloadAction<{ editedFavorite: FavoriteItem }>): void {
      const { editedFavorite } = action.payload;

      state.favorites = state.favorites.map((item) =>
        item.identifier === editedFavorite.identifier ? editedFavorite : item,
      );
    },
    removeFavorite(state: IStore, action: PayloadAction<{ favoriteId: string }>): void {
      const { favoriteId } = action.payload;

      const filtered = state.favorites.filter((f) => f.identifier !== favoriteId);

      state.favorites = [...filtered];
    },
    setFavorites(state: IStore, action: PayloadAction<{ favorites: FavoriteItem[] }>): void {
      const { favorites } = action.payload;

      state.loading = false;
      state.error = null;
      state.favorites = favorites;
    },
  },
});

export const getFavorites = (): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading());

    const response = await axios.privateFetchClient.get<FavoriteItem[]>('favorites');

    dispatch(slice.actions.setFavorites({ favorites: response.data }));
  } catch (error) {
    loggerError('getFavorites', error);
    dispatch(slice.actions.setError({ error }));
  }
};

export const addFavorite = (favorite: FavoriteItem): AppThunk => async (dispatch): Promise<void> => {
  try {
    const response = await axios.privateFetchClient.post<FavoriteItem>('favorites', favorite);

    dispatch(slice.actions.addFavorite({ favorite: response.data }));
  } catch (error) {
    loggerError('addFavorite', error);
  }
};

export const removeFavorite = (favoriteId: string): AppThunk => async (dispatch): Promise<void> => {
  try {
    await axios.privateFetchClient.delete(`favorites/${favoriteId}`);

    dispatch(slice.actions.removeFavorite({ favoriteId }));
  } catch (error) {
    loggerError('removeFavorite', error);
  }
};

export const editFavorite = (favorite: FavoriteItem): AppThunk => async (dispatch): Promise<void> => {
  try {
    const newFavorite = {
      address: favorite.address,
      name: favorite.name,
      type: favorite.type,
      network: favorite.network,
    };
    const response = await axios.privateFetchClient.put(`favorites/${favorite.identifier}`, newFavorite);
    dispatch(slice.actions.editFavorite({ editedFavorite: response.data }));
  } catch (error) {
    loggerError('editFavorite', error);
  }
};

export const { reducer } = slice;

export default slice;
