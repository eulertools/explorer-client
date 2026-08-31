import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { loggerError } from 'src/utils/logger';

export interface IProfileDetail {
  id: string;
  avatar: string;
  bio: string;
  connectedStatus: string;
  cover: string;
  currentCity: string;
  currentJobCompany: string;
  currentJobTitle: string;
  email: string;
  name: string;
  originCity: string;
  previousJobCompany: string;
  previousJobTitle: string;
  quote: string;
}

export interface IProfileSlice {
  profile: string;
  // my profiles
  myProfiles: ProfileItem[];
  getProfilesLoading: boolean;
  errorMyProfiles: string;

  // create edit
  creatingLoading: boolean;
  errorCreatingEdit: string;

  // get details
  profileDetail: IProfileDetail;
  profileDetailLoading: boolean;
  error: string | null;

  // delete
  deleteLoading: boolean;
  deleteError: string | null;
}

export interface ProfileCreateRequest {
  id?: string;
  avatar?: string;
  bio?: string;
  connectedStatus?: string;
  cover?: string;
  currentCity?: string;
  currentJobCompany?: string;
  currentJobTitle?: string;
  email?: string;
  name?: string;
  originCity?: string;
  previousJobCompany?: string;
  previousJobTitle?: string;
  quote?: string;
}

export interface ProfileUpdateFarmsRequest {
  id?: string;
  avatar?: string;
  bio?: string;
  connectedStatus?: string;
  cover?: string;
  currentCity?: string;
  currentJobCompany?: string;
  currentJobTitle?: string;
  email?: string;
  name?: string;
  originCity?: string;
  previousJobCompany?: string;
  previousJobTitle?: string;
  quote?: string;
}

export interface ProfileResponse extends ProfileCreateRequest {
  id?: string;
  avatar?: string;
  bio?: string;
  connectedStatus?: string;
  cover?: string;
  currentCity?: string;
  currentJobCompany?: string;
  currentJobTitle?: string;
  email?: string;
  name?: string;
  originCity?: string;
  previousJobCompany?: string;
  previousJobTitle?: string;
  quote?: string;
}

export interface ProfileItem extends ProfileCreateRequest {}

const initialState: IProfileSlice = {
  profile: null,

  // my profiles
  myProfiles: [],
  getProfilesLoading: false,
  errorMyProfiles: null,

  // create edit
  creatingLoading: false,
  errorCreatingEdit: null,

  // get details
  profileDetail: {
    id: '5e86809283e28b96d2d38537',
    avatar: 'https://pbs.twimg.com/profile_images/1530211328744476674/FlCjLScQ_400x400.jpg',
    bio: 'CEO and Founder of Euler Tools Solutions',
    connectedStatus: 'not_connected',
    cover: 'https://pbs.twimg.com/profile_banners/156709375/1643878473/1500x500',
    currentCity: 'Bucharest',
    currentJobCompany: 'Devias IO',
    currentJobTitle: 'CEO at Euler Tools',
    email: 'jane.rotanson@devias.io',
    name: 'Jorge de los Santos',
    originCity: 'Rm. Valcea',
    previousJobCompany: 'Focus Aesthetic Dynamics',
    previousJobTitle: 'UX Designer',
    quote: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
  },
  profileDetailLoading: false,
  error: null,

  // delete
  deleteLoading: false,
  deleteError: null,
};

export const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAccount(state, action): void {
      const profile = action.payload;
      state.profile = profile;
    },

    // my profiles
    setMyProfiles(state, action): void {
      state.myProfiles = action.payload;
    },
    setGetProfilesLoading(state, action): void {
      state.getProfilesLoading = action.payload;
    },
    setErrorGetProfilesLoading(state, action): void {
      state.errorMyProfiles = action.payload;
    },

    // get details
    resetProfileDetailsForFetch(state): void {
      state.profileDetail = initialState.profileDetail;
      state.profileDetailLoading = true;
      state.error = null;
    },
    setProfileDetail(state, action): void {
      state.profileDetail = action.payload;
      state.profileDetailLoading = false;
      state.error = null;
    },
    setProfileDetailLoading(state, action): void {
      state.profileDetailLoading = action.payload;
    },
    setError(state, action): void {
      state.error = action.payload;
    },

    // create edit
    setCreatingLoading(state, action): void {
      state.creatingLoading = action.payload;
    },
    setErrorCreatingLoading(state, action): void {
      state.errorCreatingEdit = action.payload;
    },

    // delete
    setDeleteLoading(state, action): void {
      state.deleteLoading = action.payload;
    },
    setDeleteError(state, action): void {
      state.deleteError = action.payload;
    },
  },
});

export const setAccount = (profile: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setAccount(profile));
};

// user private action
export const getMyProfiles = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setGetProfilesLoading(true));
  dispatch(slice.actions.setMyProfiles([]));
  dispatch(slice.actions.setErrorGetProfilesLoading(null));

  try {
    const response = await axios.privateFetchClient.get<any>('profiles');
    dispatch(slice.actions.setGetProfilesLoading(false));
    if (Array.isArray(response.data)) dispatch(slice.actions.setMyProfiles(response.data));
    else throw new Error('Profiles should be an array');
  } catch (error) {
    loggerError('getMyProfiles', error);
    dispatch(slice.actions.setErrorGetProfilesLoading('Unable to get your profiles'));
    dispatch(slice.actions.setGetProfilesLoading(false));
  }
};

// user private action
export const addNewProfile = (profile: ProfileCreateRequest) => async (dispatch): Promise<ProfileResponse> => {
  dispatch(slice.actions.setCreatingLoading(true));
  dispatch(slice.actions.setErrorCreatingLoading(null));

  try {
    const response = await axios.privateFetchClient.post<ProfileResponse>('profiles', profile);
    dispatch(slice.actions.setCreatingLoading(false));
    dispatch(getMyProfiles());

    return response.data;
  } catch (error) {
    loggerError('addNewProfile', error);
    dispatch(slice.actions.setErrorCreatingLoading('Unable to create the profile'));
    dispatch(slice.actions.setCreatingLoading(false));
  }
  return null;
};

// user private action
export const editProfile = (profile: ProfileCreateRequest) => async (dispatch): Promise<ProfileResponse> => {
  dispatch(slice.actions.setCreatingLoading(true));
  dispatch(slice.actions.setErrorCreatingLoading(null));

  try {
    const newProfile = {
      id: profile.id,
      name: profile.name,
    };
    const response = await axios.privateFetchClient.put<ProfileResponse>(`profiles/${profile.id}`, newProfile);
    dispatch(slice.actions.setCreatingLoading(false));
    dispatch(getMyProfiles());

    return response.data;
  } catch (error) {
    loggerError('editProfile', error);
    dispatch(slice.actions.setErrorCreatingLoading('Unable to edit the profile'));
    dispatch(slice.actions.setCreatingLoading(false));
  }
  return null;
};

// user private action
export const updateProfileFarms = (profile: ProfileUpdateFarmsRequest) => async (
  dispatch,
): Promise<ProfileResponse> => {
  try {
    const response = await axios.privateFetchClient.put<ProfileResponse>(`profiles/${profile.id}`, profile);
    dispatch(slice.actions.setCreatingLoading(false));
    return response.data;
  } catch (error) {
    loggerError('updateProfileFarms', error);
  }
  return null;
};

export const getProfileDetail = (id: string) => async (dispatch): Promise<IProfileDetail> => {
  dispatch(slice.actions.resetProfileDetailsForFetch());

  try {
    // Long timeout for this since profiles that have around 180 tokens take at least 40 seconds
    const response = await axios.privateFetchClient.get<IProfileDetail>(`profiles/${id}`, { timeout: 60000 });

    const profileDetails = response.data;
    dispatch(slice.actions.setProfileDetail(profileDetails));

    return profileDetails;
  } catch (error) {
    loggerError('getProfileDetail', error);
    dispatch(slice.actions.setError('Unable to get profile details'));
    dispatch(slice.actions.setProfileDetailLoading(false));
  }
  return null;
};

export const deleteProfile = (identifier: string) => async (dispatch): Promise<ProfileResponse> => {
  dispatch(slice.actions.setDeleteLoading(true));
  dispatch(slice.actions.setDeleteError(null));

  try {
    const response = await axios.privateFetchClient.delete<ProfileResponse>(`profiles/${identifier}`);
    dispatch(slice.actions.setDeleteLoading(false));
    dispatch(getMyProfiles());

    return response.data;
  } catch (error) {
    loggerError('deleteProfile', error);
    dispatch(slice.actions.setDeleteError('Unable to edit the profile'));
    dispatch(slice.actions.setDeleteLoading(false));
  }
  return null;
};

export const { reducer } = slice;

export default slice;
