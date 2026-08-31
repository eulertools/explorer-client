import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { TwitterTweet } from 'src/types/communities';
import { loggerException } from 'src/utils/logger';

interface ITwitterReducer {
  loading: boolean;
  error: string;
  tweets: TwitterTweet[];
}

const initialState: ITwitterReducer = {
  loading: true,
  error: null,
  tweets: [],
};

const slice = createSlice({
  name: 'twitter',
  initialState,
  reducers: {
    setTweets(state, action): void {
      const { tweets } = action.payload;

      state.tweets = tweets;
      state.loading = false;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
  },
});

export const getTweets = (account: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));
  try {
    const tweetsResponse = await axios.publicFetchClient.get<TwitterTweet[]>(`twitter?account=${account}`);
    const tweets = tweetsResponse.data;
    dispatch(slice.actions.setTweets({ tweets }));
  } catch (e) {
    loggerException('Fetching Tweets List Failed', e);
    dispatch(slice.actions.setLoading(false));
  }
};

export const { reducer } = slice;

export default slice;
