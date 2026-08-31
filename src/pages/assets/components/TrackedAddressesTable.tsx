import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { FC, useContext, useState, useRef, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GridAlignment, GridCellParams, GridColumns } from '@material-ui/data-grid';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ModeEditOutlinedIcon from '@material-ui/icons/ModeEditOutlined';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import AuthButton from 'src/components/authentication/AuthButton';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { AssetsContext } from 'src/pages/assets/AssetsContext';
import { ImportWalletAddress } from 'src/pages/assets/components/Modal/ImportWalletAddress';
import { RenameWalletAddress } from 'src/pages/assets/components/Modal/RenameWalletAddress';
import { deleteWallet } from 'src/slices/user/wallet';
import { useDispatch } from 'src/store';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { EulerTable } from 'src/ui/EulerTable';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { hexToRGB, isAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  lightThemeIcons: {
    color: 'rgba(62, 62, 62, 1)',
  },
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
    boxShadow: 'none',
  },
  buttonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.75)',
      boxShadow: 'none',
    },
  },
  buttonDark: {
    background: theme.palette.background.default,
    '&:hover': {
      background: hexToRGB(theme.palette.background.default, 0.5),
      boxShadow: 'none',
    },
  },
  cellPriceText: {
    textAlign: 'left',
  },
  optionIconButton: {
    '&:hover': {
      opacity: 0.5,
    },
  },
  menu: {
    minWidth: '100px',
  },
  drawer: {
    '& .MuiPaper-root': {
      borderRadius: '20px 20px 0 0',
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
    renderCell: (params: GridCellParams) => {
      const theme = useTheme();
      const { selectedAddress } = useContext(AssetsContext);

      return (
        <Box
          sx={{
            marginLeft: theme.spacing(2),
            '& > div > span': {
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '17px',
              color:
                params.row.identifier === selectedAddress?.identifier
                  ? (theme as any).palette.secondary[600]
                  : (theme as any).palette.terciary[700],
            },
          }}
        >
          <EulerAddress
            address={String(params.value)}
            addressRender={
              isAddress(String(params.value))
                ? EulerAddressRenderTypes.truncate_center
                : EulerAddressRenderTypes.truncate_right
            }
            title={isAddress(String(params.value)) ? String(params.value) : String(params.row.address)}
            removeIcons
          />
        </Box>
      );
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'total',
    headerName: 'Balance',
    flex: 1,
    headerAlign: 'center',
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
    renderCell: (params: GridCellParams) => {
      const { selectedAddress } = useContext(AssetsContext);

      return (
        <Box
          sx={{
            '& > p': {
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: '17px',
              textAlign: 'left',
              color: (theme) =>
                params.row.identifier === selectedAddress?.identifier
                  ? (theme as any).palette.secondary[600]
                  : (theme as any).palette.terciary[700],
            },
          }}
        >
          <EulerCellPrice {...params} maxDecimals={3} />
        </Box>
      );
    },
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
      const classes = useStyles();
      const dispatch = useDispatch();
      const anchorRef = useRef(null);
      const [open, setOpen] = useState(false);
      const [openRenameDialog, setOpenRenameDialog] = useState(false);

      const walletItem = useMemo(
        () => ({
          identifier: params.row.identifier,
          address: params.row.address,
          name: params.row.name,
          type: params.row.type,
          network: params.row.network,
        }),
        [params.row],
      );

      const handleToggle = () => setOpen((prev) => !prev);

      const handleRename = () => {
        setOpenRenameDialog((prev) => !prev);
        setOpen(false);
      };

      const handleRemove = useCallback(() => {
        dispatch(deleteWallet(params.row.identifier));
        enqueueSnackbar('Address deleted successfully.', {
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
            <IconButton className={classes.optionIconButton} ref={anchorRef} onClick={handleToggle}>
              <MoreVertOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Menu
            className={classes.menu}
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
          >
            <MenuItem className={classes.menu} onClick={handleRename}>
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
                {t('Rename')}
              </Typography>
            </MenuItem>
            <MenuItem className={classes.menu} onClick={handleRemove}>
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
          {openRenameDialog ? (
            <RenameWalletAddress open onClose={handleRename} wallet={walletItem} variant="dialog" />
          ) : null}
        </>
      );
    },
  },
];

const mobileColumns: any = (onHideTable) => [
  {
    align: 'left',
    field: 'name',
    headerName: 'Name',
    headerAlign: 'left',
    flex: 1.5,
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
    renderCell: (params: GridCellParams) => {
      const theme = useTheme();
      const { selectedAddress } = useContext(AssetsContext);

      return (
        <Box
          sx={{
            marginLeft: theme.spacing(2),
            '& > div > span': {
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '17px',
              color:
                params.row.identifier === selectedAddress?.identifier
                  ? (theme as any).palette.secondary[600]
                  : (theme as any).palette.terciary[700],
            },
          }}
        >
          <EulerAddress
            address={String(params.value)}
            addressRender={
              isAddress(String(params.value))
                ? EulerAddressRenderTypes.truncate_center
                : EulerAddressRenderTypes.truncate_right
            }
            title={isAddress(String(params.value)) ? String(params.value) : String(params.row.address)}
            showSeeDetailLink={false}
            hashColor={theme.palette.text.primary}
            hashIconColor={theme.palette.text.primary}
          />
        </Box>
      );
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'balance',
    headerName: 'Balance',
    flex: 1,
    headerAlign: 'center',
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
    renderCell: (params: GridCellParams) => {
      const { selectedAddress } = useContext(AssetsContext);

      return (
        <Box
          sx={{
            '& > p': {
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: '17px',
              textAlign: 'left',
              color: (theme) =>
                params.row.identifier === selectedAddress?.identifier
                  ? (theme as any).palette.secondary[600]
                  : (theme as any).palette.terciary[700],
            },
          }}
        >
          <EulerCellPrice {...params} maxDecimals={3} />
        </Box>
      );
    },
  },
  {
    field: 'rename',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 45,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      const anchorRef = useRef(null);
      const [openRenameDrawer, setOpenRenameDrawer] = useState(false);

      const walletItem = useMemo(
        () => ({
          identifier: params.row.identifier,
          address: params.row.address,
          name: params.row.name,
          type: params.row.type,
          network: params.row.network,
        }),
        [params.row],
      );

      const handleRename = () => {
        setOpenRenameDrawer((prev) => !prev);
        onHideTable();
      };

      return (
        <>
          <Tooltip title="Rename" placement="bottom">
            <IconButton className={classes.optionIconButton} ref={anchorRef} onClick={handleRename}>
              <ModeEditOutlinedIcon />
            </IconButton>
          </Tooltip>
          {openRenameDrawer ? (
            <RenameWalletAddress open={false} onClose={handleRename} wallet={walletItem} variant="drawer" />
          ) : null}
        </>
      );
    },
  },
  {
    field: 'delete',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 45,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      const dispatch = useDispatch();

      const handleRemove = useCallback(() => {
        dispatch(deleteWallet(params.row.identifier));
      }, [params.row.identifier]);

      return (
        <Tooltip title="Delete" placement="bottom">
          <IconButton className={classes.optionIconButton} onClick={handleRemove}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      );
    },
  },
];

interface TrackedAddressesTableProps {
  isMobile?: boolean;
  setHidden?: Dispatch<SetStateAction<boolean>>;
}

export const TrackedAddressesTable: FC<TrackedAddressesTableProps> = ({ isMobile, setHidden }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const { addresses, selectedAddress, updateSelectedAddress } = useContext(AssetsContext);

  const [openAddAddressDialog, setOpenAddAddressDialog] = useState(false);
  const [openAddressDrawer, setOpenAddressDrawer] = useState(false);

  const onHideTable = () => setHidden((prev) => !prev);

  const onAddAddressClick = () => {
    if (isMobile) {
      setOpenAddressDrawer((prev) => !prev);
      onHideTable();
    } else {
      setOpenAddAddressDialog((prev) => !prev);
    }
  };

  const handleCell = useCallback(
    ({ field, row }) => {
      const sameRow = selectedAddress?.identifier === row?.identifier;
      if (field !== 'menu' && field !== 'rename' && field !== 'delete' && !sameRow) {
        updateSelectedAddress(row);
      }
    },
    [selectedAddress, updateSelectedAddress],
  );

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" pt={1}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '20px',
            color: (theme as any).palette.terciary[700],
            padding: theme.spacing(2),
          }}
        >
          {t('Tracked addresses')}
        </Typography>
        {isAuthenticated ? (
          <Button
            variant="text"
            onClick={onAddAddressClick}
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: '17px',
              color: (theme as any).palette.primary[400],
              padding: theme.spacing(2),
              paddingRight: theme.spacing(3),
            }}
          >
            {t('Add address')}
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
                rows={addresses}
                columns={isMobile ? mobileColumns(onHideTable) : columns}
                getRowId={(row) => row.identifier}
                classes={{ root: classes.table }}
                components={{
                  Footer: () => null,
                }}
                disableSelectionOnClick={false}
                getRowClassName={(params) =>
                  params.row.identifier === selectedAddress?.identifier ? 'tracked-address-row-selected' : ''
                }
                onCellClick={handleCell}
              />
            </Box>
          </Box>
        ) : (
          <Box display="flex" textAlign="center" alignItems="center" flexDirection="column" width="100%" gap={2} p={10}>
            <Typography variant="subtitle1" fontWeight={500}>
              {t('Please sign in to see addresses')}
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
      {openAddAddressDialog ? <ImportWalletAddress open onClose={onAddAddressClick} variant="dialog" /> : null}
      {openAddressDrawer ? <ImportWalletAddress open={false} onClose={onAddAddressClick} variant="drawer" /> : null}
    </Paper>
  );
};
