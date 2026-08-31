import { createSlice } from '@reduxjs/toolkit';
import bodybuilder from 'bodybuilder';
import _map from 'lodash/map';
import axios from 'src/lib/axios';
import type { AppThunk } from 'src/store';
import { SelectOption } from 'src/types/option';
import { IPairsDTO, IPairSource } from 'src/types/pair';
import { EulerTableSort } from 'src/ui/EulerTable';
import { loggerError, loggerException } from 'src/utils/logger';
import { FilterParams, UITableSort } from '../filter.types';

export enum EExchangeOwners {
  PANCAKE_V1 = 'pancake1',
  PANCAKE_V2 = 'pancake2',
  WAULT_SWAP = 'wswap',
}

export const EExchangeOwnersOptions: SelectOption[] = [
  { value: EExchangeOwners.WAULT_SWAP, label: 'Wault Swap' },
  { value: EExchangeOwners.PANCAKE_V1, label: 'Pancake V1' },
  { value: EExchangeOwners.PANCAKE_V2, label: 'Pancake V2' },
];

export interface PairsState {
  pair: IPairSource | null;
  pairs: IPairSource[];
  loading: boolean;
  total: number;
  error: boolean;
}

const initialState: PairsState = {
  pair: null,
  pairs: [],
  loading: true,
  total: 0,
  error: false,
};

const slice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {
    setPairsList(state, action): void {
      const { pairs, total } = action.payload;

      state.error = false;
      state.pairs = pairs;
      state.total = total;
    },
    getPair(state, action): void {
      const { pair } = action.payload;

      state.error = false;
      state.pair = pair;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    setError(state, action): void {
      state.error = action.payload;
    },
  },
});

export interface CGPaginationParams {
  order: EulerTableSort;
  page: number;
  pageSize: number;
}

export const { reducer } = slice;

export const getPairsList = (filters: FilterParams): AppThunk => async (dispatch): Promise<void> => {
  try {
    dispatch(slice.actions.setLoading(true));
    const { page, size, orderBy, orderDir, owner = [], query } = filters;
    const cancelToken = axios.cancelToken.autoAbort('get_pair_list');
    const queryObj = bodybuilder();

    // Filter by name containing the query
    if (query) {
      queryObj.query('match', 'name', query);
    }
    // Filter by exchanges
    if (owner?.length) {
      queryObj.filter('terms', 'owner', owner);
    }
    // Finally only bring the pairs
    queryObj.filter('terms', 'kind', ['contract']);

    if (orderBy && orderDir) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((by) => queryObj.sort(by, orderDir));
      } else {
        queryObj.sort(orderBy, orderDir);
      }
    } else {
      // Default to order by total_volume_locked
      queryObj.sort('total_volume_locked', UITableSort.desc);
    }

    const qBuilt = queryObj.build() as any;

    const body = {
      size,
      from: size * page,
      sort: qBuilt.sort ? qBuilt.sort : [],
      query: qBuilt.query,
    };
    const swapPoolsResponse = await axios.publicFetchClient.post<IPairsDTO>(`pairs`, body, {
      cancelToken,
    });
    const swapPoolData = swapPoolsResponse.data;
    const arrayData = _map(swapPoolData.hits, (el) => el._source);

    dispatch(
      slice.actions.setPairsList({
        pairs: arrayData,
        total: swapPoolData.total.value,
      }),
    );
    axios.cancelToken.clear('get_pair_list');
  } catch (e) {
    loggerException(e);
    loggerError('error getting pair list');
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export default slice;
