import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import { PriceVariation } from 'src/pages/markets/components/PriceVariation';
import { Volume } from 'src/pages/markets/components/Volume';
import { TokenPriceVariation } from 'src/pages/tokens/components/Token/TokenPriceVariation';
import { EulerSwapButton } from 'src/ui/EulerSwapButton';
import { MarketToken } from 'src/ui/MarketToken';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';

const marketColumns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 3,
    sortable: false,
    renderCell: (params: GridCellParams) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: (theme) => theme.spacing(2),
          '& > p': {
            fontSize: '13px',
            fontWeight: 700,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <MarketToken
          image={params.row?.image?.cg?.thumb}
          identifier={params.row?.identifier}
          name={params.value.toString()}
        />
        <Typography variant="body2" ml={1} fontWeight={500}>
          {params.row?.symbol}
        </Typography>
      </Box>
    ),
  },
  {
    headerName: 'Price',
    field: 'price_usd.cg',
    valueGetter: (params) => params.row.price_usd?.cg,
    type: 'number',
    flex: 1,
    renderCell: (params: GridCellParams) => <PriceVariation price={params.row?.price_usd?.cg} />,
  },
  {
    headerName: '1h',
    field: 'price_change_percentage_1h.cg',
    type: 'number',
    flex: 1,
    valueFormatter: (params) => params.row?.price_change_percentage_1h?.cg,
    renderCell: (params: GridCellParams) => (
      <TokenPriceVariation
        currentPrice={params.row?.price_usd?.cg}
        percentage={params.row?.price_change_percentage_1h?.cg}
      />
    ),
  },
  {
    headerName: '24h',
    field: 'price_change_24h.cg',
    type: 'number',
    flex: 1,
    valueFormatter: (params) => params.row?.price_change_percentage_24h?.cg,
    renderCell: (params: GridCellParams) => (
      <TokenPriceVariation
        currentPrice={params.row?.price_usd}
        percentage={params.row?.price_change_percentage_24h?.cg}
      />
    ),
  },
  {
    headerName: '7d',
    field: 'price_change_percentage_7d.cg',
    type: 'number',
    flex: 1,
    valueFormatter: (params) => params.row?.price_change_percentage_7d?.cg,
    renderCell: (params: GridCellParams) => (
      <TokenPriceVariation
        currentPrice={params.row?.price_usd}
        percentage={params.row?.price_change_percentage_7d?.cg}
      />
    ),
  },
  {
    headerName: 'Volume (24h)',
    field: 'volumen_24h.cg',
    valueGetter: (params) => params.row.volumen_24h?.cg,
    type: 'number',
    flex: 1,
    renderCell: (params: GridCellParams) => (
      <Volume volume={params.row?.volumen_24h?.cg} price={params.row.price_usd?.cg} symbol={params.row?.symbol} />
    ),
  },
  {
    headerName: 'Market Cap',
    field: 'market_cap.cg',
    valueGetter: (params) => params.row.market_cap?.cg,
    type: 'number',
    flex: 1,
    renderCell: (params: GridCellParams) => (
      <Box
        sx={{
          '& > p': {
            color: (theme) => (theme as any).palette.terciary[700],
            fontWeight: 500,
            fontSize: '13px',
            lineHeight: '17px',
          },
        }}
      >
        <EulerCellPrice {...params} readable />
      </Box>
    ),
  },
  {
    field: 'swap',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 75,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => (
      <EulerSwapButton size="small" iconButton={false} swapTokenFrom={params.row?.networks?.bnb?.address} />
    ),
  },
];

export default marketColumns;
