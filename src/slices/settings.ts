import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import { IAWS, IURLS, ISettingsDTO } from 'src/types/configuration';
import { logger } from 'src/utils/logger';
import type { AppThunk } from '../store';

export const initialAWS: IAWS = {
  region: '',
  cognito: {
    region: '',
    pool_id: '',
    client_id: '',
  },
};

export const initialURLS: IURLS = {
  api: '',
  private_api: '',
  ws: '',
  nft_api: '',
  directory_api: '',
  app: '',
};

export const settingsInitialState: ISettingsDTO = {
  aws: initialAWS,
  gtm: {
    id: '',
  },
  urls: initialURLS,
  external_links: {},
  chain: {},
  features: {},
};

const slice = createSlice({
  name: 'settings',
  initialState: settingsInitialState,
  reducers: {
    setSettings(__state, action): void {
      const settings = action.payload;

      return settings;
    },
  },
});

export const { reducer } = slice;

export const fetchSettings = (): AppThunk => async (dispatch): Promise<ISettingsDTO> =>
  axios.publicFetchClient
    .get(`/settings`)
    .then((response) => {
      const settings = response.data;
      dispatch(slice.actions.setSettings(settings));

      return settings;
    })
    .catch((e) => {
      logger('FETCH SETTINGS FAILED', e);
    });

export default slice;
