import { RootStoreType } from 'src/store/rootReducer';

export const selectGlobalModal = (store: RootStoreType) => store.uimodal;
export const selectActiveGlobalModals = (store: RootStoreType) => selectGlobalModal(store).active;
