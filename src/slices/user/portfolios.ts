import { createSlice } from '@reduxjs/toolkit';
import _remove from 'lodash/remove';
import 'notistack';
import axios from 'src/lib/axios';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import type { AppThunk } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { loggerError } from 'src/utils/logger';
import SnackbarService from 'src/utils/snackbar';

export interface IPortfolioItemParams {
  name: string;
  order: number;
  identifier: string;
  type: string;
}

export interface IPortfolio {
  created_at: string;
  identifier: string;
  name: string;
  user_sub: string;
  items?: IPortfolioDetailsItem[];
}

export interface IPortfolioDetailsItem {
  identifier: string;
  type: EPortfolioItemType;
  name: string;
  order?: number;
  network?: ESupportedNetworks;
}

const initialState: {
  portfolios: IPortfolio[];
  portfolioItem: IPortfolioItemParams;
  selected: IPortfolio;
  loading: boolean;
} = {
  portfolios: [],
  portfolioItem: null,
  selected: null,
  loading: true,
};

const slice = createSlice({
  name: 'portfolios',
  initialState,
  reducers: {
    setPortfolios(state, action): void {
      const { portfolios, autoSelect } = action.payload;
      const orderedPortfolios = portfolios.sort((a, b) => a.update_date - b.update_date);

      if (autoSelect && orderedPortfolios.length && state.selected === null) {
        const [selected] = orderedPortfolios;

        state.selected = selected;
      }

      state.portfolios = orderedPortfolios;
    },
    setLoading(state, action): void {
      state.loading = action.payload;
    },
    deletePortfolio(state, action): void {
      const removeId = action.payload.portfolio.identifier;

      _remove(state.portfolios, (portfolio) => removeId === portfolio.identifier);

      if (state.selected.identifier === removeId) {
        state.selected = state.portfolios[0] || null;
      }

      state.loading = false;
    },
    createPortfolio(state, action): void {
      const newPortfolio = action.payload.portfolio;

      state.portfolios = [...state.portfolios, newPortfolio];
      state.selected = newPortfolio;
      state.loading = false;
    },
    editPortfolio(state, action): void {
      const editedPortfolio = action.payload.portfolio;

      state.portfolios = state.portfolios.map((x) =>
        x.identifier === editedPortfolio.identifier ? editedPortfolio : x,
      );

      if (state.selected?.identifier === editedPortfolio.identifier) {
        state.selected = editedPortfolio;
      }

      state.loading = false;
    },
    setCurrentPortfolio(state, action): void {
      const selected = action.payload;

      state.selected = selected;
      state.loading = false;
    },
  },
});

export const { reducer } = slice;

export const getPortfolios = (fetchDetails = true): AppThunk => async (dispatch): Promise<void> => {
  axios.privateFetchClient
    .get<IPortfolio[]>(`portfolios`)
    .then((response) => {
      const portfolios = response.data;

      if (portfolios?.length) {
        dispatch(slice.actions.setPortfolios({ portfolios, autoSelect: !fetchDetails }));
      }
    })
    .catch((error) => {
      loggerError('PORTFOLIOS FETCH FAILED', error);
    })
    .finally(() => dispatch(slice.actions.setLoading(false)));
};

export const deletePortfolio = (portfolio): AppThunk => (dispatch): Promise<void> => {
  dispatch(slice.actions.setLoading(true));

  return axios.privateFetchClient
    .delete(`portfolios/${portfolio.identifier}`)
    .then(() => {
      dispatch(slice.actions.deletePortfolio({ portfolio }));
    })
    .catch((e) => {
      loggerError('DELETE PORTFOLIO FAILED', e);

      dispatch(slice.actions.setLoading(false));
    });
};

export const createPortfolio = (newPortfolio): AppThunk => async (dispatch): Promise<void | IPortfolio> => {
  dispatch(slice.actions.setLoading(true));

  return axios.privateFetchClient
    .post<IPortfolio>(`portfolios`, newPortfolio)
    .then((response) => response.data)
    .then((data) => {
      dispatch(slice.actions.createPortfolio({ portfolio: data }));

      return data;
    })
    .catch((e) => {
      loggerError('CREATE FAILED', e);

      dispatch(slice.actions.setLoading(false));
    });
};

export const editPortfolio = (portfolioId, editedPortfolio): AppThunk => async (dispatch): Promise<void> =>
  axios.privateFetchClient
    .put(`portfolios/${portfolioId}`, editedPortfolio)
    .then(async (response) => {
      const portfolioData = response.data;

      dispatch(slice.actions.editPortfolio({ portfolio: portfolioData }));

      SnackbarService.success('Portfolio information edited!', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 1500,
      });
    })
    .catch((error) => {
      SnackbarService.error("Couldn't edit portfolio information", {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 1500,
      });

      throw new Error(error);
    });

export const addItemToPortfolio = (params: IPortfolioDetailsItem, portfolioIdentifier: string): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  const currentPortfolio = getState().portfolios.portfolios.find((p) => p.identifier === portfolioIdentifier);

  const itemAlreadyInPortfolio = (currentPortfolio.items || []).find(
    (i) => i.identifier === params.identifier && i.type === params.type && i.network === params.network,
  );

  if (itemAlreadyInPortfolio) {
    SnackbarService.warning('Already in portfolio!', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 1500,
    });
    return Promise.resolve();
  }

  const items = [...(currentPortfolio.items || []), params];

  // We control de portfolio data, so we need to send all the items of the arrays we want to save
  return axios.privateFetchClient
    .put(`portfolios/${portfolioIdentifier}`, { items })
    .then((response) => response.data)
    .then((data) => {
      dispatch(slice.actions.editPortfolio({ portfolio: data }));
    })
    .catch((e) => {
      loggerError('PORTFOLIO ADD ITEM FAILED', e);
    });
};

export const removeItemFromPortfolio = (removeIdentifier: string, portfolioIdentifier: string): AppThunk => async (
  dispatch,
  getState,
): Promise<void> => {
  const currentPortfolio = getState().portfolios.portfolios.find((p) => p.identifier === portfolioIdentifier);

  const lcRemoveIdentifier = removeIdentifier.toLowerCase();
  const updated = currentPortfolio.items.filter((i) => i.identifier.toLowerCase() !== lcRemoveIdentifier);

  // We control de portfolio data, so we need to send all the arrays we want
  return axios.privateFetchClient
    .put(`portfolios/${portfolioIdentifier}`, { items: updated })
    .then((response) => response.data)
    .then((data) => {
      dispatch(slice.actions.editPortfolio({ portfolio: data }));
    })
    .catch((e) => {
      loggerError('PORTFOLIO ADD ITEM FAILED', e);
    });
};

export const setCurrentPortfolio = (portfolio: IPortfolio): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.setCurrentPortfolio(portfolio));
};

export default slice;
