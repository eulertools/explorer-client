import { createSlice } from '@reduxjs/toolkit';
import { GridPageChangeParams, GridSortModelParams } from '@material-ui/data-grid';
import { UITableID, FilterParams, GlobalFilters, defaultFiltersByTableId, FilterItem } from 'src/slices/filter.types';
import type { AppThunk } from 'src/store';
import { loggerError } from 'src/utils/logger';

const initialState: GlobalFilters = {
  [UITableID.pair_list]: {
    filter: defaultFiltersByTableId[UITableID.pair_list],
    openFilter: false,
  },
  [UITableID.token_list]: {
    filter: defaultFiltersByTableId[UITableID.token_list],
    openFilter: false,
  },
  [UITableID.token_detail]: {
    filter: defaultFiltersByTableId[UITableID.token_detail],
    openFilter: false,
  },
  [UITableID.market_list]: {
    filter: defaultFiltersByTableId[UITableID.market_list],
    openFilter: false,
  },
  [UITableID.market_detail]: {
    filter: defaultFiltersByTableId[UITableID.market_detail],
    openFilter: false,
  },
  [UITableID.token_trade_list]: {
    filter: defaultFiltersByTableId[UITableID.token_trade_list],
    openFilter: false,
  },
  [UITableID.trade_list]: {
    filter: defaultFiltersByTableId[UITableID.trade_list],
    openFilter: false,
  },
  [UITableID.euler_trade_list]: {
    filter: defaultFiltersByTableId[UITableID.euler_trade_list],
    openFilter: false,
  },
  [UITableID.transaction_list]: {
    filter: defaultFiltersByTableId[UITableID.transaction_list],
    openFilter: false,
  },
  [UITableID.token_transaction_list]: {
    filter: defaultFiltersByTableId[UITableID.token_transaction_list],
    openFilter: false,
  },
  [UITableID.token_exchange_list]: {
    filter: defaultFiltersByTableId[UITableID.token_exchange_list],
    openFilter: false,
  },
  [UITableID.pair_exchange_list]: {
    filter: defaultFiltersByTableId[UITableID.pair_exchange_list],
    openFilter: false,
  },
  [UITableID.marketplace_trade_list]: {
    filter: defaultFiltersByTableId[UITableID.marketplace_trade_list],
    openFilter: false,
  },
  [UITableID.marketplace_my_sale_list]: {
    filter: defaultFiltersByTableId[UITableID.marketplace_my_sale_list],
    openFilter: false,
  },
  [UITableID.marketplace_token_selector]: {
    filter: defaultFiltersByTableId[UITableID.marketplace_token_selector],
    openFilter: false,
  },
  [UITableID.collections]: {
    filter: defaultFiltersByTableId[UITableID.collections],
    openFilter: false,
  },
  [UITableID.nft_list]: {
    filter: defaultFiltersByTableId[UITableID.nft_list],
    openFilter: true,
  },
  [UITableID.assets_nft_list]: {
    filter: defaultFiltersByTableId[UITableID.assets_nft_list],
    openFilter: false,
  },
};

const slice = createSlice({
  name: 'global-filters',
  initialState,
  reducers: {
    toggleOpenFilter(state, action): void {
      state[action.payload.tableId].openFilter = !state[action.payload.tableId].openFilter;
    },
    setFilterTable(state, action): void {
      state[action.payload.tableId].filter = action.payload.filters;
    },
    setFilterValue(state, action): void {
      state[action.payload.tableId].filter[action.payload.filterName] = action.payload.filterValue;
    },
    safeState(state, action): void {
      const { tableId } = action.payload;

      if (!state[tableId])
        state[tableId] = {
          filter: defaultFiltersByTableId[tableId],
          openFilter: false,
        };
    },
    clearFilters(state, action): void {
      const { tableId } = action.payload;

      state[tableId] = {
        filter: defaultFiltersByTableId[tableId],
      };
    },
  },
});

export const setFilterTable = (tableId: UITableID, filters: FilterParams): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterTable({
        tableId,
        filters,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const setFilterValue = (tableId: UITableID, filterItem: FilterItem): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'page',
        filterValue: 0,
      }),
    );
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        ...filterItem,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const setFilterPageSize = (tableId: UITableID, params: GridPageChangeParams): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'page',
        filterValue: 0,
      }),
    );
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'size',
        filterValue: params.pageSize,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const setFilterPage = (tableId: UITableID, params: GridPageChangeParams): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'page',
        filterValue: params.page,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const setFilterOrder = (tableId: UITableID, params: GridSortModelParams): AppThunk => async (
  dispatch,
): Promise<void> => {
  try {
    if (!params || !params.sortModel || !params.sortModel[0]) return;
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'orderBy',
        filterValue: params.sortModel[0].field,
      }),
    );
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'orderDir',
        filterValue: params.sortModel[0].sort,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const clearFilterOrder = (tableId: UITableID): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.safeState({ tableId }));
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'orderBy',
        filterValue: defaultFiltersByTableId[tableId].orderBy,
      }),
    );
    dispatch(
      slice.actions.setFilterValue({
        tableId,
        filterName: 'orderDir',
        filterValue: defaultFiltersByTableId[tableId].orderDir,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const toggleFilter = (tableId: UITableID): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(
      slice.actions.toggleOpenFilter({
        tableId,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const clearFilter = (tableId: UITableID): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(
      slice.actions.clearFilters({
        tableId,
      }),
    );
  } catch (error) {
    loggerError(error);
  }
};

export const { reducer } = slice;
export default slice;
