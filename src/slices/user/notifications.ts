import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { Notification } from 'src/types/notification';
import { loggerError } from 'src/utils/logger';

export interface INotifications {
  notifications: Notification[];
  error: string | null;
}

const initialState: INotifications = {
  notifications: [],
  error: null,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action): void {
      state.notifications = action.payload;
    },
    setError(state, action): void {
      state.error = action.payload;
    },
  },
});

export const getNotifications = (read = false): AppThunk => async (dispatch): Promise<Notification[]> => {
  try {
    const { data } = await axios.privateFetchClient.get(`notifications?item_read=${(read && 'true') || 'false'}`);

    dispatch(slice.actions.setNotifications(data));
  } catch (error) {
    loggerError('getNotifications', error);
    dispatch(slice.actions.setError('Unable to get notifications'));
  }

  return null;
};

export const updateNotifications = (notifications: Notification[]): AppThunk => async (dispatch): Promise<void> =>
  Promise.all(
    notifications.map((notification: Notification) =>
      axios.privateFetchClient.put(`notifications/${notification.identifier}`, { item_read: true }),
    ),
  )
    .then(() => {
      dispatch(getNotifications());
    })
    .catch((error) => {
      loggerError('updateNotifications', error);
      dispatch(slice.actions.setError('Unable to update notifications'));
    });

export const { reducer } = slice;
export default slice;
