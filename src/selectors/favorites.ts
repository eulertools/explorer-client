import { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { FavoriteItem } from 'src/slices/user/favorites';
import store from '../store';

export const selectFavorites = (): FavoriteItem[] => store.getState().favorites.favorites;

export const isFavorite = (favorite: FavoriteItem): boolean =>
  !!selectFavorites().find(
    (f: FavoriteItem) =>
      f.address === favorite.address && f.type === favorite.type && f.range_key === favorite.range_key,
  );

export const isFavoriteById = (id: string | number): boolean =>
  !!selectFavorites().find((f: FavoriteItem) => f.address === id || f.name === id);

export const getFavoriteById = (id: string | number): FavoriteItem =>
  selectFavorites().find((f: FavoriteItem) => f.address === id || f.name === id);

export const getTokenFavorites = (): FavoriteItem[] => {
  const network = getSelectedNetworkFromLocalstorage();

  return selectFavorites().filter((f: FavoriteItem) => f.type === 'token' && f.network === network);
};

export const getAddressFavorites = (): FavoriteItem[] => {
  const network = getSelectedNetworkFromLocalstorage();

  return selectFavorites().filter((f: FavoriteItem) => f.type === 'address' && f.network === network);
};
