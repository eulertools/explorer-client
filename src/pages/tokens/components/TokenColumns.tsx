import Typography from '@material-ui/core/Typography';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
// import { TokenPriceVariation } from 'src/pages/tokens/components/Token/TokenPriceVariation';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';
import { EulerToken } from 'src/ui/EulerToken';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';

const tokenColumns = ({ network }) => [
  {
    field: 'favorites',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 45,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => {
      const { name, symbol, address } = params.row;
      return (
        <ButtonFavorite
          idFavorite={name}
          addFavoriteItem={{
            address,
            name,
            symbol,
            network,
            type: EPortfolioItemType.TOKEN,
          }}
        />
      );
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridCellParams) => (
      <EulerToken address={params.row.address} name={params.value.toString()} addressLink={params.row.address} />
    ),
    flex: 1,
  },
  {
    field: 'symbol',
    headerName: 'Symbol',
    flex: 1,
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    renderCell: (params: GridCellParams) => <Typography>{params.value?.toString().toUpperCase()}</Typography>,
  },
  {
    headerName: 'Price',
    field: 'price_usd',
    type: 'number',
    flex: 1,
    renderCell: EulerCellPrice,
  },
  // Hidden Columns until Price Calculation comes from Backend.
  // {
  //   headerName: '1h',
  //   field: 'price1Hour',
  //   type: 'number',
  //   flex: 1,
  //   valueFormatter: (params) => params.row?.price_changes?.hour_priceusd,
  //   renderCell: (params: GridCellParams) => (
  //     <TokenPriceVariation
  //       currentValue={params.row?.price_usd}
  //       historicalValue={params.row?.price_changes?.hour_priceusd}
  //     />
  //   ),
  // },
  // {
  //   headerName: '24h',
  //   field: 'price24Hour',
  //   type: 'number',
  //   flex: 1,
  //   valueFormatter: (params) => params.row?.price_changes?.day_priceusd,
  //   renderCell: (params: GridCellParams) => (
  //     <TokenPriceVariation
  //       currentValue={params.row?.price_usd}
  //       historicalValue={params.row?.price_changes?.day_priceusd}
  //     />
  //   ),
  // },
  // {
  //   headerName: '7d',
  //   field: 'price7Day',
  //   type: 'number',
  //   flex: 1,
  //   valueFormatter: (params) => params.row?.price_changes?.week_priceusd,
  //   renderCell: (params: GridCellParams) => (
  //     <TokenPriceVariation
  //       currentValue={params.row?.price_usd}
  //       historicalValue={params.row?.price_changes?.week_priceusd}
  //     />
  //   ),
  // },
  {
    headerName: 'Market Cap',
    field: 'market_cap',
    type: 'number',
    flex: 1,
    renderCell: (params: GridCellParams) => <EulerCellPrice {...params} readable />,
  },
];

export default tokenColumns;
