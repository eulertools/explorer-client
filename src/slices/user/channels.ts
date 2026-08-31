import { createSlice } from '@reduxjs/toolkit';
import { ReadyState } from 'react-use-websocket';
import { ChannelMessage } from 'src/contexts/WebsocketsContext';
import type { AppThunk } from 'src/store';

const initialState: {
  [key: string]: ChannelMessage[];
} = {
  status: null,
};

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    updateChannel(state, action): void {
      const message: ChannelMessage = action.payload;

      if (!state[message.channel]) {
        state[message.channel] = [];
      }

      state[message.channel] = state[message.channel].concat(message);
    },
    setStatus(state, action): void {
      const status = action.payload;

      state.status = status;
    },
  },
});

export const updateChannel = (message: ChannelMessage): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.updateChannel(message));
};

export const setStatus = (status: ReadyState): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setStatus(status));
};

export const { reducer } = slice;

export default slice;
