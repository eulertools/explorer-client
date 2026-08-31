import { IPairSliceState } from 'src/slices/entities/pairDetail';
import { RootStoreType } from 'src/store/rootReducer';

// not to use this selector directly
const selectPairDetail = (store: RootStoreType) => store.pairDetail;
export const selectPairDetailDataByAddress = (address: string) => (store: RootStoreType) =>
  selectPairDetail(store)[address] || ({} as IPairSliceState);
