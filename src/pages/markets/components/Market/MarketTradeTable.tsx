import { EulerIconExport2 } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import { FC, useMemo, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import { MarketAddress } from 'src/pages/markets/components/Market/MarketAddress';
import { getExchangeData } from 'src/slices/tables/exchanges';
import { togglePairTransactionsDisplayAge } from 'src/slices/tables/pairTransactions';
import { PairTransaction } from 'src/types/blockchain';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerCellToggleTime, TimeDisplayType } from 'src/ui/eulerTable/EulerCellToggleTime';
import { EulerHeaderToggleTime } from 'src/ui/eulerTable/EulerHeaderToggle';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { checksumAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles(() => ({
  table: {
    '& .MuiDataGrid-colCellSortable': {
      outline: 'none !important',
    },
  },
}));

const columns = ({ displayAge, symbol }) => [
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'block_timestamp',
    headerName: displayAge ? 'Age' : 'Date',
    flex: 0.6,
    renderHeader: (params) => {
      const dispatch = useDispatch();
      const toggle = useCallback(() => dispatch(togglePairTransactionsDisplayAge()), []);

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '13px !important',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          <EulerHeaderToggleTime {...params} toggle={toggle} headerClassName="customHeader" />
        </Box>
      );
    },
    renderCell: (params) => (
      <Box
        sx={{
          paddingLeft: (theme) => theme.spacing(2),
          display: 'flex',
          alignItems: 'center',
          fontSize: '13px !important',
          fontWeight: 500,
          lineHeight: '17px',
          color: (theme) => (theme as any).palette.terciary[700],
        }}
      >
        <EulerCellToggleTime
          {...params}
          key={params.row.transaction}
          displayType={displayAge ? TimeDisplayType.ago : TimeDisplayType.time}
        />
      </Box>
    ),
  },
  {
    align: 'center' as GridAlignment,
    field: 'transaction',
    headerName: 'Txn hash',
    sortable: false,
    flex: 0.5,
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => {
      const theme = useTheme();

      return (
        <Box
          sx={{
            '& > div > p': {
              fontSize: '13px !important',
              fontWeight: 500,
              lineHeight: '17px',
              color: (theme as any).palette.primary[400],
            },
          }}
        >
          <MarketAddress address={String(params.value)} color="primary-400" background={false} truncate link />
        </Box>
      );
    },
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    field: 'type',
    headerName: 'Type',
    flex: 0.5,
    sortable: false,
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params: GridCellParams) => (
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '17px',
          color: (theme) => (params.value ? (theme as any).palette.error[700] : (theme as any).palette.success[800]),
        }}
      >
        {params.value ? 'SELL' : 'BUY'}
      </Typography>
    ),
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    field: 'symbol',
    headerName: `Pair`,
    flex: 0.4,
    sortable: false,
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <Box display="flex">
          <TokenPairAvatars
            baseTokenAddress={params.row.base_token_address}
            quoteTokenAddress={params.row.quote_token_address}
          />
        </Box>
      </Tooltip>
    ),
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    field: 'base_token_price_usd',
    headerName: `USD Price`,
    flex: 1,
    type: 'number',
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > p': {
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice {...params} />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    headerAlign: 'right' as GridAlignment,
    field: 'ratio',
    headerName: `Ratio`,
    flex: 1,
    type: 'number',
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > p': {
            fontSize: '13px !important',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice
          {...params}
          key={params.row.log_index}
          currency={params.row.quote_token_symbol}
          currencyPosition="right"
          value={params.value}
        />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    headerAlign: 'right' as GridAlignment,
    field: 'log_index',
    headerName: `${symbol} Traded`,
    flex: 1,
    sortable: false,
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > p': {
            fontSize: '13px !important',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice
          {...params}
          key={params.row.log_index}
          currency={params.row.base_token_symbol}
          currencyPosition="right"
          value={
            params.row.base_token_in > params.row.base_token_out ? params.row.base_token_in : params.row.base_token_out
          }
        />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    headerAlign: 'right' as GridAlignment,
    field: 'price_bnb',
    headerName: `PAIR Traded`,
    flex: 1,
    sortable: false,
    renderHeader: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...params} />
      </Box>
    ),
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > p': {
            fontSize: '13px !important',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice
          {...params}
          currency={params.row.quote_token_symbol}
          currencyPosition="right"
          value={
            params.row.quote_token_in > params.row.quote_token_out
              ? params.row.quote_token_in
              : params.row.quote_token_out
          }
        />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    headerAlign: 'right' as GridAlignment,
    field: 'volume',
    headerName: `USD Traded`,
    flex: 1,
    type: 'number',
    renderHeader: (props) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > span': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerRenderHeader headerClassName="header" {...props} />
      </Box>
    ),
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > p': {
            fontSize: '13px !important',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice {...params} />
      </Box>
    ),
  },
  {
    align: 'center' as GridAlignment,
    field: 'buttons',
    sortable: false,
    width: 70,
    renderHeader: () => <></>,
    renderCell: (params) => (
      <Tooltip title="View on BscScan" placement="top">
        <IconButton
          target="_blank"
          href={`https://bscscan.com/tx/${params.row.transaction}`}
          rel="noreferrer"
          sx={{
            '& > span > svg': {
              width: '18px',
              height: '18px',
              '& > path': {
                fill: (theme) => `${(theme as any).palette.primary[400]} !important`,
              },
            },
          }}
        >
          <EulerIconExport2 size="s" colorLight="primary-400" colorDark="primary-400" />
        </IconButton>
      </Tooltip>
    ),
  },
];

interface IMarketTradeTableProps extends Omit<EulerTableProps, 'rows' | 'columns'> {
  address: string;
  symbol: string;
  transactions: PairTransaction[];
  displayAge: boolean;
}

export const MarketTradeTable: FC<IMarketTradeTableProps> = ({
  address,
  symbol,
  transactions,
  displayAge,
  ...rest
}) => {
  const classes = useStyles();
  const [pairs, setPairs] = useState<any[]>([]);
  const [rows, setRows] = useState<any>([]);

  const getPairs = async () => {
    const unique = new Set<string>();
    transactions.forEach((i) => unique.add(checksumAddress(i.address)));
    const pairAddresses = Array.from(unique.values());
    const arrayPromise = pairAddresses.map((p) => getExchangeData(p));
    const promises = await Promise.all(arrayPromise);
    setPairs(promises);
  };

  useEffect(() => {
    getPairs();
    setRows([]);
  }, [transactions]);

  useEffect(() => {
    if (pairs.length > 0) {
      const customTransactions = transactions.map((t, i) => {
        const pair = pairs.find((p) => p.address.toLowerCase() === t.address.toLowerCase());
        // Reverse all values in case PAIR doesn't have {address} as the BASE Value.
        if (address !== pair?.base_token_address?.toLowerCase()) {
          return {
            id: `${i}_${t.transaction_hash}`,
            type: t.quote_in > t.quote_out,
            transaction: t.transaction_hash,
            ratio: new BigNumber(t.quote_price_usd).dividedBy(t.base_price_usd).toString(),
            symbol: `${pair.quote_token_symbol}/${pair.base_token_symbol}`,
            volume: t.volume,
            log_index: t.log_index,
            block_timestamp: t.block_timestamp,

            base_token_name: pair.quote_token_name,
            base_token_price: pair.quote_token_price,
            base_token_price_usd: t.quote_price_usd,
            base_token_address: pair.quote_token_address,
            base_token_balance: pair.quote_token_balance,
            base_token_symbol: pair.quote_token_symbol,
            base_token_in: t.quote_in,
            base_token_out: t.quote_out,

            quote_token_name: pair.base_token_name,
            quote_token_price: pair.base_token_price,
            quote_token_price_usd: t.base_price_usd,
            quote_token_address: pair.base_token_address,
            quote_token_balance: pair.base_token_balance,
            quote_token_symbol: pair.base_token_symbol,
            quote_token_in: t.base_in,
            quote_token_out: t.base_out,
          };
        }

        // Create a new object from the PAIR and Transaction data.
        return {
          id: `${i}_${t.transaction_hash}`,
          type: t.base_in > t.base_out,
          transaction: t.transaction_hash,
          ratio: t.ratio,
          symbol: pair.symbol,
          volume: t.volume,
          log_index: t.log_index,
          block_timestamp: t.block_timestamp,

          base_token_name: pair.base_token_name,
          base_token_price: pair.base_token_price,
          base_token_price_usd: t.base_price_usd,
          base_token_address: pair.base_token_address,
          base_token_balance: pair.base_token_balance,
          base_token_symbol: pair.base_token_symbol,
          base_token_in: t.base_in,
          base_token_out: t.base_out,

          quote_token_name: pair.quote_token_name,
          quote_token_price: pair.quote_token_price,
          quote_token_price_usd: t.quote_price_usd,
          quote_token_address: pair.quote_token_address,
          quote_token_balance: pair.quote_token_balance,
          quote_token_symbol: pair.quote_token_symbol,
          quote_token_in: t.quote_in,
          quote_token_out: t.quote_out,
        };
      });
      setRows(customTransactions);
    }
  }, [pairs]);

  const customColumns = useMemo(() => columns({ displayAge, symbol }), [displayAge, symbol]);

  return <EulerTable {...rest} rows={rows} columns={customColumns} classes={{ root: classes.table }} />;
};
