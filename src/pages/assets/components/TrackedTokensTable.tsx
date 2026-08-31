import clsx from 'clsx';
import _isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { GridAlignment, GridCellParams, GridColumns } from '@material-ui/data-grid';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import AuthButton from 'src/components/authentication/AuthButton';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { ImportFavoriteToken } from 'src/pages/assets/components/Modal/ImportFavoriteToken';
import { getTokenFavorites } from 'src/selectors/favorites';
import { getMarketData } from 'src/slices/tables/markets';
import { removeFavorite } from 'src/slices/user/favorites';
import { useDispatch, useSelector } from 'src/store';
import { EulerSwapButton } from 'src/ui/EulerSwapButton';
import { EulerTable } from 'src/ui/EulerTable';
import { EulerToken } from 'src/ui/EulerToken';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { hexToRGB } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  table: {
    '& .MuiDataGrid-renderingZone': {
      width: '100% !important',
    },
    '& .MuiDataGrid-columnsContainer': {
      borderBottomColor: theme.palette.divider,
    },
    '& .MuiDataGrid-cell': {
      borderTopStyle: 'solid',
      borderWidth: 0,
      borderColor: theme.palette.divider,
      borderTopWidth: 'thin',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-colCellSortable': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-row': {
      width: '100% !important',
      '&:hover': {
        borderRadius: 0,
      },
      '&:first-child': {
        '& .MuiDataGrid-cell': {
          border: 'none',
        },
      },
      '&:last-child': {
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      },
    },
  },
  signInButton: {
    maxWidth: '105px',
    borderRadius: '10px',
    color: theme.palette.primary.main,
    padding: `10px ${theme.spacing(3)}`,
  },
  buttonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.5)',
    },
  },
  buttonDark: {
    background: theme.palette.background.default,
    '&:hover': {
      background: hexToRGB(theme.palette.background.default, 0.5),
    },
  },
}));

const columns: GridColumns = [
  {
    align: 'left',
    field: 'symbol',
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
          marginLeft: (theme) => theme.spacing(2),
          '& > div > a > p': {
            fontSize: '13px',
            fontWeight: 700,
            lineHeight: '17px',
          },
        }}
      >
        <EulerToken
          image={params.row.image}
          address={params.row.address}
          name={params.row.symbol}
          addressLink={params.row.address}
        />
      </Box>
    ),
  },
  {
    align: 'right' as GridAlignment,
    field: 'price',
    headerName: 'Price',
    flex: 1,
    headerAlign: 'right',
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
            textAlign: 'left',
            color: (theme) => (theme as any).palette.terciary[700],
          },
        }}
      >
        <EulerCellPrice {...params} maxDecimals={3} />
      </Box>
    ),
  },
  {
    field: 'swap',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 45,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => (
      <EulerSwapButton size="small" iconButton swapTokenFrom={params.row.address} />
    ),
  },
  {
    field: 'menu',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 45,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => {
      const { t } = useTranslation();
      const { enqueueSnackbar } = useSnackbar();
      const dispatch = useDispatch();
      const anchorRef = useRef(null);
      const [open, setOpen] = useState(false);

      const handleToggle = () => setOpen((prev) => !prev);

      const handleRemove = useCallback(() => {
        dispatch(removeFavorite(params.row.identifier));
        enqueueSnackbar('Token deleted successfully.', {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 2500,
          variant: 'info',
        });
        setOpen(false);
      }, [params.row.identifier]);

      return (
        <>
          <Tooltip title="Options" placement="bottom">
            <IconButton
              ref={anchorRef}
              onClick={handleToggle}
              sx={{
                '&:hover': {
                  opacity: 0.5,
                },
              }}
            >
              <MoreVertOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorRef.current}
            variant="menu"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            open={open}
            onClose={handleToggle}
            sx={{
              minWidth: '100px',
            }}
          >
            <MenuItem onClick={handleRemove} sx={{ minWidth: '100px' }}>
              <Typography
                sx={{
                  marginRight: (theme) => theme.spacing(5),
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '17px',
                  textAlign: 'left',
                  color: (theme) => (theme as any).palette.neutral[600],
                }}
              >
                {t('Delete')}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      );
    },
  },
];

export const TrackedTokensTable: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const favoriteTokens = useSelector(getTokenFavorites);
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();

  const [oldFavoriteTokens, setOldFavoriteTokens] = useState(favoriteTokens);
  const [tokenList, setTokenList] = useState([]);

  const [openAddTokenDialog, setOpenAddTokenDialog] = useState(false);
  const [openTokenDrawer, setOpenTokenDrawer] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down(675));

  const onAddTokenClick = () => {
    if (isMobile) {
      setOpenTokenDrawer((prev) => !prev);
    } else {
      setOpenAddTokenDialog((prev) => !prev);
    }
  };

  useEffect(() => {
    const getPrices = async () => {
      const list = await Promise.all(
        oldFavoriteTokens.map(async (fav) => {
          const tokenData = await getMarketData(fav.address.toLocaleLowerCase(), settings.network);
          return {
            ...fav,
            symbol: tokenData?.symbol || fav.symbol,
            price: tokenData?.price_usd?.cg,
            price_change_percentage_1h: tokenData?.price_change_percentage_1h?.cg,
            price_change_percentage_24h: tokenData?.price_change_percentage_24h?.cg,
            price_change_percentage_7d: tokenData?.price_change_percentage_7d?.cg,
            price_change_percentage_30d: tokenData?.price_change_percentage_30d?.cg,
            image: tokenData?.image?.cg?.thumb,
          };
        }),
      );
      const sorted = list.sort((a, b) => +b.price - +a.price);

      setTokenList(sorted);
    };
    getPrices();
  }, [oldFavoriteTokens]);

  /**
   * Equality check to correctly update table after
   * any add-remove-rename operation.
   */
  useEffect(() => {
    if (!_isEqual(favoriteTokens, oldFavoriteTokens)) {
      setOldFavoriteTokens(favoriteTokens);
    }
  }, [favoriteTokens]);

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '20px',
            color: (theme as any).palette.terciary[700],
            padding: theme.spacing(2),
          }}
        >
          {t('Tracked tokens')}
        </Typography>
        {isAuthenticated ? (
          <Button
            onClick={onAddTokenClick}
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: '17px',
              color: (theme as any).palette.primary[400],
              padding: theme.spacing(2),
              paddingRight: theme.spacing(3),
            }}
          >
            {t('Add token')}
          </Button>
        ) : null}
      </Box>
      <Divider />
      <Grid item xs={12} display="flex">
        {isAuthenticated ? (
          <Box width="100%" overflow="auto">
            <Box>
              <EulerTable
                paginationMode="client"
                rows={tokenList}
                columns={columns}
                getRowId={(row) => row.identifier}
                classes={{ root: classes.table }}
                components={{
                  Footer: () => null,
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box display="flex" textAlign="center" alignItems="center" flexDirection="column" width="100%" gap={2} p={10}>
            <Typography variant="subtitle1" fontWeight={500}>
              {t('Please sign in to see favorites')}
            </Typography>
            <AuthButton
              label="Sign in"
              variant="contained"
              buttonProps={{
                className: clsx(
                  classes.signInButton,
                  settings.theme === 'DARK' ? classes.buttonDark : classes.buttonLight,
                ),
                size: 'large',
              }}
            />
          </Box>
        )}
      </Grid>
      {openAddTokenDialog ? <ImportFavoriteToken open onClose={onAddTokenClick} variant="dialog" /> : null}
      {openTokenDrawer ? <ImportFavoriteToken open={false} onClose={onAddTokenClick} variant="drawer" /> : null}
    </Paper>
  );
};
