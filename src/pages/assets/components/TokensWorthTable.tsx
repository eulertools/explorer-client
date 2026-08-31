import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import _isEqual from 'lodash/isEqual';
import Web3 from 'web3';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { GridAlignment, GridCellParams, GridColumns } from '@material-ui/data-grid';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { AssetsContext } from 'src/pages/assets/AssetsContext';
import { ButtonLock } from 'src/ui/ButtonLock';
import { EulerSwapButton } from 'src/ui/EulerSwapButton';
import { EulerTable } from 'src/ui/EulerTable';
import { EulerToken } from 'src/ui/EulerToken';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { getData, checkLockerEnabled, getBalance } from 'src/utils/locker';

const useStyles = makeStyles((theme) => ({
  table: {
    '& .MuiDataGrid-columnsContainer': {
      borderBottomColor: theme.palette.divider,
    },
    '& .MuiDataGrid-cell': {
      borderBottomStyle: 'solid',
      borderWidth: 0,
      borderColor: theme.palette.divider,
      borderBottomWidth: 'thin',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-colCellSortable': {
      outline: 'none !important',
    },
  },
}));

const columns: GridColumns = [
  {
    align: 'left',
    field: 'name',
    headerName: 'Name',
    headerAlign: 'left',
    flex: 1,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: (theme) => theme.spacing(2),
          '& > div > a > p': {
            fontSize: '13px',
            fontWeight: 700,
            lineHeight: '17px',
          },
          '& > p': {
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerToken
          image={params.row.image}
          address={params.row.address}
          name={params.row.name}
          addressLink={params.row.address}
        />
        <Typography variant="body2" ml={1} fontWeight={500}>
          {params.row.symbol}
        </Typography>
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    field: 'price',
    headerName: 'Price',
    flex: 1,
    headerAlign: 'right',
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
      const price1 = cellParams1.row.price;
      const price2 = cellParams2.row.price;

      return price1 - price2;
    },
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
      <Box
        sx={{
          '& > p': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice {...params} value={params.row.price} />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    field: 'amount',
    headerName: 'Holdings',
    headerAlign: 'right',
    flex: 1,
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
      const total1 = cellParams1.row.quantity * cellParams1.row.price;
      const total2 = cellParams2.row.quantity * cellParams2.row.price;

      return total1 - total2;
    },
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
          flexDirection: 'column',
          '& > p:nth-of-type(1)': {
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '17px',
            color: (theme) => (theme as any).palette.terciary[700],
          },
          '& > p:nth-of-type(2)': {
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[600],
          },
        }}
      >
        <EulerCellPrice
          {...params}
          value={params.row.quantity * params.row.price}
          typographyProps={{ fontWeight: 500 }}
        />
        <EulerCellPrice {...params} value={params.row.quantity} currency={params.row.symbol} currencyPosition="right" />
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
      <EulerSwapButton size="small" iconButton={false} swapTokenFrom={params.row.address} />
    ),
  },
];

const lockColumn = {
  field: 'lock',
  sortable: false,
  align: 'center' as GridAlignment,
  width: 75,
  renderHeader: () => <></>,
  renderCell: (params) => {
    const total_usd = new BigNumber(params.row.price).multipliedBy(params.row.quantity).toNumber();

    const lockToken = {
      address: params.row.address,
      balance: params.row.quantity,
      deadline: params.row.deadline,
      identifier: params.row.token._source.identifier,
      locked: params.row.locked,
      name: params.row.name,
      price_usd: +params.row.price,
      symbol: params.row.symbol,
      total_usd,
    };
    return <ButtonLock size="small" token={lockToken} />;
  },
};

const mobileColumns: GridColumns = [
  {
    field: 'amount',
    headerName: 'Row',
    renderHeader: () => <></>,
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const { t } = useTranslation();
      return (
        <Grid container display="flex" px={2}>
          <Grid item xs={12} display="flex" justifyContent="space-between" lineHeight="normal" mb={1}>
            <Box display="flex" alignItems="center">
              <EulerToken
                image={params.row.image}
                address={params.row.address}
                name={params.row.name}
                addressLink={params.row.address}
              />
              <Typography variant="body2" ml={1} fontWeight={500}>
                {params.row.symbol}
              </Typography>
            </Box>
            <Box>
              <EulerSwapButton size="small" swapTokenFrom={params.row.address} />
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between" pb={1}>
            <Box>
              <Typography variant="body2" fontWeight={600} ml={4}>
                {t('Price')}
              </Typography>
            </Box>
            <Box>
              <EulerCellPrice {...params} value={params.row.price} typographyProps={{ fontWeight: 600, mr: 2 }} />
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={600} ml={4}>
                {t('Holdings')}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <EulerCellPrice
                {...params}
                value={params.row.quantity * params.row.price}
                typographyProps={{ fontWeight: 600, display: 'flex', justifyContent: 'flex-end' }}
              />
              <EulerCellPrice
                {...params}
                value={params.row.quantity}
                currency={params.row.symbol}
                currencyPosition="right"
                typographyProps={{ mr: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      );
    },
  },
];

const mobileLockColumns = [
  {
    field: 'amount',
    headerName: 'Row',
    renderHeader: () => <></>,
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const { t } = useTranslation();

      return (
        <Grid container display="flex" px={2}>
          <Grid item xs={12} display="flex" justifyContent="space-between" lineHeight="normal" mb={1}>
            <Box display="flex" alignItems="center">
              <EulerToken
                image={params.row.image}
                address={params.row.address}
                name={params.row.name}
                addressLink={params.row.address}
              />
              <Typography variant="body2" ml={1} fontWeight={500}>
                {params.row.symbol}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <EulerSwapButton size="small" swapTokenFrom={params.row.address} />
              <ButtonLock
                size="small"
                token={{
                  address: params.row.address,
                  balance: params.row.quantity,
                  deadline: params.row.deadline,
                  identifier: params.row.token._source.identifier,
                  locked: params.row.locked,
                  name: params.row.name,
                  price_usd: +params.row.price,
                  symbol: params.row.symbol,
                  total_usd: new BigNumber(params.row.price).multipliedBy(params.row.quantity).toNumber(),
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between" pb={1}>
            <Box>
              <Typography variant="body2" fontWeight={600} ml={4}>
                {t('Price')}
              </Typography>
            </Box>
            <Box>
              <EulerCellPrice {...params} value={params.row.price} typographyProps={{ fontWeight: 600, mr: 2 }} />
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={600} ml={4}>
                {t('Holdings')}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <EulerCellPrice
                {...params}
                value={params.row.quantity * params.row.price}
                typographyProps={{ fontWeight: 600, display: 'flex', justifyContent: 'flex-end' }}
              />
              <EulerCellPrice
                {...params}
                value={params.row.quantity}
                currency={params.row.symbol}
                currencyPosition="right"
                typographyProps={{ mr: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      );
    },
  },
];

export const TokensWorthTable: FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { account, library } = useWeb3React();
  const { chain } = useContext(ConfigurationContext);
  const { selectedAddress } = useContext(AssetsContext);

  const web3 = new Web3(library?.provider);

  const [hidden, setHidDen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortedTokens, setSortedTokens] = useState(null);

  const [reducedTokens, setReducedTokens] = useState(null);
  const [lockerTokens, setLockerTokens] = useState(null);
  const [reducedLockerTokens, setReducedLockerTokens] = useState(null);
  const [oldTokens, setOldTokens] = useState(selectedAddress?.tokens);

  const smallScreen = useMediaQuery(theme.breakpoints.down(675));

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, [page]);

  const lockerContractAddress = useMemo(() => chain?.bsc?.products?.locker, [chain?.bsc?.products?.locker]);
  const canLockTokens = useMemo(
    () =>
      !!(
        selectedAddress?.address?.toLowerCase() === account?.toLowerCase() && checkLockerEnabled(lockerContractAddress)
      ),
    [selectedAddress.identifier, account, lockerContractAddress],
  );

  const handleHideButton = () => {
    setHidDen((prev) => !prev);
  };

  const toShow = 6 * page;
  const showLoadMore = (canLockTokens ? reducedLockerTokens : reducedTokens)?.length > toShow;

  const currentColumns = useMemo(() => {
    if (smallScreen) {
      if (canLockTokens) return mobileLockColumns;
      return mobileColumns;
    }
    if (canLockTokens) return [...columns, lockColumn];
    return columns;
  }, [smallScreen, canLockTokens]);

  const currentRows = useMemo(() => {
    if (!loading) {
      if (canLockTokens) {
        if (hidden) return reducedLockerTokens?.slice(0, toShow);
        return lockerTokens?.slice(0, toShow);
      }
      if (hidden) return reducedTokens?.slice(0, toShow);
      return sortedTokens?.slice(0, toShow);
    }
    return [];
  }, [hidden, canLockTokens, toShow, sortedTokens, reducedTokens, lockerTokens, reducedLockerTokens, loading]);

  useEffect(() => {
    const getTokenObject = (token) => ({
      ...token,
      name: token?.token?._source?.name,
      symbol: token?.token?._source.symbol,
      address: token?.name,
      price: token?.token?._source?.price_usd?.cg,
      quantity: token?.quantity,
      price_change_percentage_1h: token?.token?._source?.price_change_percentage_1h?.cg,
      price_change_percentage_24h: token?.token?._source?.price_change_percentage_24h?.cg,
      price_change_percentage_7d: token?.token?._source?.price_change_percentage_7d?.cg,
      price_change_percentage_30d: token?.token?._source?.price_change_percentage_30d?.cg,
      image: token?.token?._source?.image?.cg?.thumb,
    });

    const setLockerTokenData = async (tknList) => {
      const tokenList = await Promise.all(
        tknList?.map(async (tkn) => {
          if (tkn) {
            const balance = await getBalance(tkn.address.toLowerCase(), account, web3);
            const { amount, deadline } = await getData(tkn.address.toLowerCase(), lockerContractAddress, account, web3);

            const newToken = {
              ...tkn,
              quantity: balance,
              deadline: +deadline,
              locked: Web3.utils.fromWei(amount),
            };
            return newToken;
          }
          return null;
        }),
      );
      setLockerTokens(tokenList);

      const reduced = (tokenList as any[]).filter((tkn) => +tkn.price * tkn.quantity > 1);
      setReducedLockerTokens(reduced);
    };

    const sortTokens = async () => {
      setLoading(true);
      const tokensObjects = oldTokens.map((token) => getTokenObject(token));
      const filter = tokensObjects?.filter((i) => +i.price > 0 && i.quantity > 0);
      const sorted = filter?.sort((a, b) => b.quantity * +b.price - a.quantity * +a.price);
      if (canLockTokens) {
        await setLockerTokenData(sorted);
      } else {
        const reduced = sorted.filter((tkn) => +tkn.price * tkn.quantity > 1);
        setReducedTokens(reduced);
        setSortedTokens(sorted);
      }
      setLoading(false);
    };

    if (oldTokens) sortTokens();
  }, [oldTokens, account]);

  /**
   * Equality check to correctly update table after
   * any add-remove-rename operation.
   */
  useEffect(() => {
    if (!_isEqual(selectedAddress?.tokens, oldTokens)) {
      setOldTokens(selectedAddress.tokens);
    } else if (!account) {
      setOldTokens(selectedAddress.tokens);
    }
  }, [selectedAddress.identifier, account]);

  if (!currentRows) return null;

  return (
    <Box width="100%" overflow="auto">
      <Box>
        <EulerTable
          paginationMode="client"
          rows={loading ? [] : currentRows}
          rowHeight={smallScreen ? 130 : 50}
          getRowId={(row) => row.token._source.identifier}
          columns={currentColumns}
          sortModel={!smallScreen ? [{ field: 'amount', sort: 'desc' }] : null}
          pageSize={toShow}
          classes={{ root: classes.table }}
          loading={loading}
          components={{
            Footer: () => (
              <Box display="flex" justifyContent="space-between" p={2}>
                <Typography
                  onClick={handleHideButton}
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    lineHeight: '17px',
                    color: (theme as any).palette.terciary[700],
                  }}
                >
                  <b>{hidden ? 'Show' : 'Hide'} tokens</b> with less than $1 value
                </Typography>
                {showLoadMore ? (
                  <Button
                    onClick={loadMore}
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      lineHeight: '17px',
                      color: (theme as any).palette.primary[400],
                    }}
                  >
                    {t('Load More')}
                  </Button>
                ) : null}
              </Box>
            ),
          }}
        />
      </Box>
    </Box>
  );
};
