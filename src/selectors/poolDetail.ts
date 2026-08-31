import { IPoolSliceState } from 'src/slices/entities/poolDetail';
import { RootStoreType } from 'src/store/rootReducer';

// not to use this selector directly
const selectPoolDetail = (store: RootStoreType) => store.poolDetail;
export const selectPoolDetailDataByAddress = (address: string) => (store: RootStoreType) =>
  selectPoolDetail(store)[address] || ({} as IPoolSliceState);
