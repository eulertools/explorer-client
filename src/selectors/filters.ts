import _isEqual from 'lodash/isEqual';
import { defaultFiltersByTableId, NOT_COUNT, TableState, UITableID } from 'src/slices/filter.types';
import { RootStoreType } from 'src/store/rootReducer';

// DON'T USE DIRECTLY
const selectGlobalFilterState = (store: RootStoreType) => store.globalFilters;

export const selectFilterState = (tableId: UITableID) => (store: RootStoreType) =>
  selectGlobalFilterState(store)[tableId] || ({} as TableState);

export const selectFilterIsOpen = (tableId: UITableID) => (store: RootStoreType) =>
  selectGlobalFilterState(store)[tableId].openFilter;

export const selectFilterValue = (tableId: UITableID, filterName: string) => (store: RootStoreType) =>
  selectGlobalFilterState(store)[tableId].filter[filterName];

// we should filter the default one like page, from
export const selectFilterIsActive = (tableId: UITableID) => (store: RootStoreType) =>
  Object.keys(selectGlobalFilterState(store)[tableId].filter).length > 3;

export const selectFilterSize = (tableId: UITableID) => (store: RootStoreType) => {
  const filterState = selectGlobalFilterState(store)[tableId].filter;
  const defaultFilters = defaultFiltersByTableId[tableId];

  return Object.keys(filterState).filter((k) => {
    if (NOT_COUNT.includes(k)) return false;

    return !_isEqual(filterState[k], defaultFilters[k]);
  }).length;
};

export const selectFilterPage = (tableId: UITableID) => selectFilterValue(tableId, 'page');
export const selectFilterPageSize = (tableId: UITableID) => selectFilterValue(tableId, 'size');
export const selectFilterTotal = (tableId: UITableID) => selectFilterValue(tableId, 'total');
