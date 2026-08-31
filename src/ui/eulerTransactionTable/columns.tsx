import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import useSettings from 'src/hooks/useSettings';
import { togglePairTransactionsDisplayAge } from 'src/slices/tables/pairTransactions';
import { toggleTransactionsDisplayAge } from 'src/slices/tables/transactions';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { EulerCelTnxHash } from 'src/ui/eulerTable/EulerCelTnxHash';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerCellToggleTime, TimeDisplayType } from 'src/ui/eulerTable/EulerCellToggleTime';
import { EulerHeaderToggleTime } from 'src/ui/eulerTable/EulerHeaderToggle';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { txnsColumn } from 'src/ui/eulerTable/txnsColumn';
import InOutChip from 'src/ui/eulerTransactionTable/InOutChip';
import { shortAddress } from 'src/utils/stringUtils';
import { EulerLink } from '../EulerLink';

export const columnsCommonTrasactions = ({ displayAge, currentAddress, network }) => [
  {
    align: 'left' as GridAlignment,
    field: 'block_hash',
    headerName: 'Block',
    flex: 1,
    sortable: false,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => (
      <Box fontSize={13} fontWeight={500} mt={2}>
        <TruncatedTooltipText
          value={<EulerLink href={`/${network}/block/${params.row.block_number}`}>{params.row.block_number}</EulerLink>}
          title={params.value as string}
        />
      </Box>
    ),
  },
  {
    align: 'left' as GridAlignment,
    field: 'block_timestamp',
    headerName: displayAge ? 'Age' : 'Time',
    flex: 1,
    renderHeader: (params) => {
      const dispatch = useDispatch();
      const toggle = useCallback(() => dispatch(toggleTransactionsDisplayAge()), []);
      return <EulerHeaderToggleTime {...params} toggle={toggle} headerClassName="customHeader" />;
    },
    renderCell: (params) => (
      <Box fontWeight={500} fontSize={13} mt={2}>
        <EulerCellToggleTime {...params} displayType={displayAge ? TimeDisplayType.ago : TimeDisplayType.time} />
      </Box>
    ),
  },
  {
    align: 'left' as GridAlignment,
    field: 'from_address',
    headerName: 'From',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const { settings } = useSettings();
      return params.value !== currentAddress.toLowerCase() ? (
        <Box fontWeight={500} fontSize={13}>
          <EulerLink href={`/${settings.network}/address/${params.value}`}>
            {shortAddress(params.value as string)}
          </EulerLink>
          <IconCopyToClipboard text={params.value as string} />
        </Box>
      ) : (
        <Typography fontWeight={500} fontSize={13}>
          {shortAddress(params.value as string)}
        </Typography>
      );
    },
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    field: 'in_out',
    headerName: 'In/Out',
    sortable: false,
    flex: 0.5,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => (
      <InOutChip isOut={params.row.to_address !== currentAddress.toLowerCase()} />
    ),
  },
  {
    align: 'left' as GridAlignment,
    field: 'to_address',
    headerName: 'To',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const { settings } = useSettings();
      return params.value !== currentAddress.toLowerCase() ? (
        <Box fontWeight={500} fontSize={13}>
          <EulerLink href={`/${settings.network}/address/${params.value}`}>
            {shortAddress(params.value as string)}
          </EulerLink>
          <IconCopyToClipboard text={params.value as string} />
        </Box>
      ) : (
        <Typography fontWeight={500} fontSize={13}>
          {shortAddress(params.value as string)}
        </Typography>
      );
    },
  },
  {
    align: 'right' as GridAlignment,
    headerAlign: 'right' as GridAlignment,
    field: 'value',
    headerName: 'Value',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const value = Number(params.value) / 10 ** 18;
      return (
        <Box fontWeight={500} fontSize={13} mt={2} pr={2}>
          <TruncatedTooltipText
            value={`${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })} BNB`}
            title={value.toLocaleString(undefined, {
              minimumFractionDigits: 18,
            })}
            forceTooltip
          />
        </Box>
      );
    },
  },
];

export const columnsTransactions = ({ displayAge, currentAddress, network }) => [
  txnsColumn({
    type: EulerAddressTypes.txns,
    field: 'hash',
    headerName: 'Txn Hash',
  }),
  ...columnsCommonTrasactions({ displayAge, currentAddress, network }),
];

export const columnsTokenTransactions = ({ displayAge, currentAddress, network }) => [
  {
    align: 'left' as GridAlignment,
    field: 'transaction_hash',
    headerName: 'Txn Hash',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const { settings } = useSettings();
      return (
        <Box pl={2} fontWeight={500} fontSize={13}>
          <EulerLink href={`/${settings.network}/address/${params.value as string}`}>
            {shortAddress(params.value as string)}
          </EulerLink>
          <IconCopyToClipboard text={params.value as string} />
        </Box>
      );
    },
  },
  ...columnsCommonTrasactions({ displayAge, currentAddress, network }),
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columnsPairTransactions = ({ displayAge, baseSymbol, quoteSymbol, eulerView }) => [
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'block_timestamp',
    headerName: displayAge ? 'Age' : 'Date',
    flex: 1,
    renderHeader: (params) => {
      const dispatch = useDispatch();
      const toggle = useCallback(() => dispatch(togglePairTransactionsDisplayAge()), []);
      return (
        <Box fontWeight={500} fontSize={13} mt={2}>
          <EulerHeaderToggleTime {...params} toggle={toggle} headerClassName="customHeader" />
        </Box>
      );
    },
    renderCell: (params) => (
      <EulerCellToggleTime
        key={params.row.hash}
        {...params}
        displayType={displayAge ? TimeDisplayType.ago : TimeDisplayType.time}
      />
    ),
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'type',
    headerName: 'Type',
    flex: 0.5,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const { inverted } = params.row;
      let type = params.row.base_in > params.row.base_out;
      if (inverted) type = params.row.base_in < params.row.base_out;
      return (
        <Typography style={{ fontWeight: 500, color: type ? 'red' : 'green' }}>{type ? 'SELL' : 'BUY'}</Typography>
      );
    },
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'price_usd',
    headerName: `Price USD`,
    flex: 1,
    type: 'number',
    renderHeader: EulerRenderHeader,
    renderCell: (params) => <EulerCellPrice {...params} />,
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'volume',
    headerName: `Total USD`,
    flex: 1,
    type: 'number',
    renderHeader: EulerRenderHeader,
    renderCell: (params) => <EulerCellPrice {...params} />,
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'price_base',
    headerName: `Price`,
    flex: 1,
    type: 'number',
    renderHeader: EulerRenderHeader,
    renderCell: (params) => {
      const { inverted } = params.row;
      let value = params.row.price_base;
      let symbol = params.row.quote_token_symbol;
      if (inverted) {
        value = params.row.price_quote;
        symbol = params.row.base_token_symbol;
      }
      return (
        <EulerCellPrice
          {...params}
          key={params.row.log_index}
          currency={symbol}
          currencyPosition="right"
          value={value}
        />
      );
    },
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'log_index',
    headerName: `Amount ${baseSymbol}`,
    flex: 1,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params) => {
      const { inverted } = params.row;
      let value = params.row.base_in > params.row.base_out ? params.row.base_in : params.row.base_out;
      if (inverted) {
        value = params.row.quote_in > params.row.quote_out ? params.row.quote_in : params.row.quote_out;
      }
      return <EulerCellPrice {...params} key={params.row.log_index} currency={null} value={value} />;
    },
  },
  {
    align: 'left' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: 'price_bnb',
    headerName: `Total`,
    flex: 1,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params) => {
      const { inverted } = params.row;
      let value = params.row.quote_in > params.row.quote_out ? params.row.quote_in : params.row.quote_out;
      let symbol = params.row.quote_token_symbol;
      if (inverted) {
        value = params.row.base_in > params.row.base_out ? params.row.base_in : params.row.base_out;
        symbol = params.row.base_token_symbol;
      }
      return <EulerCellPrice {...params} currency={symbol} currencyPosition="right" value={value} />;
    },
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'center' as GridAlignment,
    field: 'base_price',
    headerName: `Pair`,
    flex: 1,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params) => (
      <Box display="flex">
        <TokenPairAvatars
          baseTokenAddress={params.row.base_token}
          quoteTokenAddress={params.row.quote_token}
          eulerView={eulerView}
        />
        <Typography color="textPrimary">
          {params.row.base_token_symbol}/{params.row.quote_token_symbol}
        </Typography>
      </Box>
    ),
  },
  {
    align: 'center' as GridAlignment,
    field: 'transaction_hash',
    headerName: 'Transaction',
    flex: 1,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params) => <EulerCelTnxHash {...params} title="VIEW" explorer contrast eulerView={eulerView} />,
  },
];
