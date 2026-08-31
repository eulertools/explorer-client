import React from 'react';
import { GridCellParams } from '@material-ui/data-grid';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { IPairSource } from 'src/types/pair';
import { EulerPair } from 'src/ui/EulerPair';
import { EulerCellExchange } from 'src/ui/eulerTable/EulerCellExchange';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { favoriteColumn } from 'src/ui/eulerTable/favoriteColumn';
import { portfolioColumn } from 'src/ui/eulerTable/portfolioColumn';
import { viewDetailColumn } from 'src/ui/eulerTable/viewDetailColumn';

export const pairsTableColumns = ({ handleModal, network }) => [
  viewDetailColumn({
    handleClick: handleModal,
  }),
  favoriteColumn({
    type: EPortfolioItemType.PAIR,
    idKey: 'address',
    network,
  }),
  portfolioColumn({
    type: EPortfolioItemType.PAIR,
    idKey: 'address',
    nameKeys: ['name', 'symbol'],
    network,
  }),
  {
    field: 'name',
    headerName: 'Symbol',
    flex: 1.2,
    renderCell: (params: GridCellParams) => (
      <EulerPair
        baseTokenAddress={params.row.base_token_address}
        quoteTokenAddress={params.row.quote_token_address}
        baseTokenName={params.row.base_token_symbol}
        quoteTokenName={params.row.quote_token_symbol}
        addressLink={params.row.address}
      />
    ),
  },
  {
    field: 'owner',
    headerName: 'Exchange',
    flex: 1,
    renderCell: (params: GridCellParams) => (
      <EulerCellExchange
        {...params}
        showLink
        base_token_address={params.row.base_token_address}
        quote_token_address={params.row.quote_token_address}
      />
    ),
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    type: 'number',
    renderCell: (params: GridCellParams) => (
      <EulerCellPrice
        {...params}
        currencyPosition="right"
        currency={(params.row as IPairSource).quote_token_symbol || (params.row as IPairSource).symbol?.split('/')?.[1]}
        value={(params.row as IPairSource).base_token_price}
      />
    ),
  },
  {
    field: 'total_volume_locked',
    headerName: 'Liquidity',
    flex: 1.7,
    type: 'number',
    renderCell: EulerCellPrice,
  },
];
