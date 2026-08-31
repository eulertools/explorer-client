import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { MediumArticle } from 'src/types/communities';
import { loggerException } from 'src/utils/logger';

interface IMediumReducer {
  loading: boolean;
  error: string;
  articles: MediumArticle[];
}

const initialState: IMediumReducer = {
  loading: true,
  error: null,
  articles: [],
};

const slice = createSlice({
  name: 'twitter',
  initialState,
  reducers: {
    setArticles(state, action): void {
      const { articles } = action.payload;

      state.articles = articles;
      state.loading = false;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
  },
});

export const getArticles = (profile: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));
  try {
    const articlesResponse = await axios.publicFetchClient.get<MediumArticle[]>(`medium?profile=${profile}`);
    const articles = articlesResponse.data;
    dispatch(slice.actions.setArticles({ articles }));
  } catch (e) {
    loggerException('Fetching Articles List Failed', e);
    dispatch(slice.actions.setLoading(false));
  }
};

export const { reducer } = slice;

export default slice;
