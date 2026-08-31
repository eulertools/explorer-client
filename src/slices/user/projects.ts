import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { AppThunk } from 'src/store';
import { ProjectRate } from 'src/types/project';
import { loggerError } from 'src/utils/logger';

export interface IProjectsReducer {
  loading: boolean;
  projectRating: ProjectRate;
  error: string;
}

const initialState: IProjectsReducer = {
  loading: false,
  projectRating: {
    id: null,
    rate: {
      good: 0,
      bad: 0,
    },
    voted: false,
  },
  error: null,
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setError(state, action): void {
      state.error = action.payload;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setProjectRating(state, action): void {
      state.projectRating = action.payload;
    },
    setVoted(state, action): void {
      state.projectRating.voted = action.payload;
    },
  },
});

export interface VoteItem {
  item_name: string;
  item_type: string;
  item_rate?: string;
  user_sub?: string;
}

export const fetchVotes = (item: VoteItem): AppThunk => async (dispatch): Promise<any> => {
  const { item_name } = item;

  Promise.all(
    ['good', 'bad'].map((rate) =>
      axios.publicFetchClient.get(`voting?item_type=${item.item_type}&item_name=${item_name}&item_rate=${rate}`),
    ),
  )
    .then(async (responses) => {
      let voted = false;

      // let's see if user voted already
      if (item.user_sub) {
        const {
          data: { count: userVotes = 0 },
        } = await axios.privateFetchClient.get(
          `voting?item_type=${item.item_type}&item_name=${item_name}&user_sub=${item.user_sub}`,
        );

        voted = userVotes > 0;
      }

      const { data: { count: good } = 0 } = responses[0];
      const { data: { count: bad } = 0 } = responses[1];

      dispatch(
        slice.actions.setProjectRating({
          id: item.item_name,
          rate: { good, bad },
          voted,
        }),
      );
    })
    .catch((error) => {
      loggerError('FETCH VOTING FAILED', error);
      dispatch(slice.actions.setError('Unable to fetch votes'));
    })
    .finally(() => dispatch(slice.actions.setLoading(false)));
};

export const vote = (item: VoteItem): AppThunk => async (dispatch): Promise<any> => {
  const { item_name, item_rate, item_type } = item;

  return axios.privateFetchClient
    .post('voting', { item_type, item_name, item_rate })
    .then((response) => response.data)
    .then(() => dispatch(slice.actions.setVoted(true)))
    .catch((error) => {
      loggerError('VOTING FAILED', error);
      dispatch(slice.actions.setError('Unable to send vote'));
    })
    .finally(() => dispatch(slice.actions.setLoading(false)));
};

export const resetProjectRating = (): AppThunk => async (dispatch): Promise<any> => {
  dispatch(slice.actions.setProjectRating(initialState.projectRating));
};

export const { reducer } = slice;

export default slice;
