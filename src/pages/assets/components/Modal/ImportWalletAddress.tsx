import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import CloseIcon from '@material-ui/icons/Close';
import useSettings from 'src/hooks/useSettings';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { addNewWallet } from 'src/slices/user/wallet';
import { useDispatch } from 'src/store';
import { ESupportedNetworks, networkToChainIdMap } from 'src/types/blockchain';
import { getConnectorSrc } from 'src/utils/avatar';
import { metamaskWallet, walletConnect } from 'src/utils/connectWallet';
import { hexToRGB, isAddress } from 'src/utils/stringUtils';

interface ImportWalletAddressProps extends DialogProps {
  onClose: () => void;
  variant: 'dialog' | 'drawer';
}

export const ImportWalletAddress: FC<ImportWalletAddressProps> = ({ onClose, variant, ...rest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { activate, account } = useWeb3React();
  const { settings } = useSettings();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [openDrawer, setOpenDrawer] = useState(true);
  const [loadingWalletConnection, setLoadingWalletConnection] = useState(false);

  const initialValues = {
    address: '',
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .test('len', 'Input a valid Address.', (value) => isAddress(value))
      .required('Address is required.'),
  });

  const handleToggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const onCloseDialog = () => {
    onClose();
  };

  const onCloseDrawer = () => {
    onClose();
  };

  const onAddAddressSuccess = () =>
    enqueueSnackbar('Address added successfully.', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 2500,
      variant: 'success',
    });

  const onSubmit = useCallback(async (values): Promise<void> => {
    const newWallet = {
      identifier: values.address,
      address: values.address,
      name: values.address,
      network: ESupportedNetworks.BNB,
      type: EPortfolioItemType.ADDRESS,
    };
    dispatch(addNewWallet(newWallet));
    onAddAddressSuccess();
    onClose();
  }, []);

  const onWalletConnected = useCallback(
    (address: string) => {
      const newWallet = {
        identifier: address,
        address,
        name: address,
        network: ESupportedNetworks.BNB,
        type: EPortfolioItemType.ADDRESS,
      };
      dispatch(addNewWallet(newWallet));
      onAddAddressSuccess();
      onClose();
    },
    [account],
  );

  const onLoadingWallet = () => setLoadingWalletConnection(true);

  const onMetamaskConnect = useCallback(async () => {
    await metamaskWallet(activate, onLoadingWallet);
  }, [onWalletConnected, settings.network, account]);

  const onWalletConnect = useCallback(async () => {
    await walletConnect(activate, onLoadingWallet, networkToChainIdMap[settings.network]);
  }, [onWalletConnected, settings.network, account]);

  /**
   * Fix for cases where user imports wallet from metamask/wallet connect.
   * Resolves undefined error on account.
   */
  useEffect(() => {
    if (loadingWalletConnection && account) {
      onWalletConnected(account);
      setLoadingWalletConnection(false);
    }
  }, [loadingWalletConnection, account]);

  const Header = () => {
    if (variant === 'drawer') {
      return (
        <Box display="flex" alignItems="center" pt={1}>
          <Box>
            <IconButton onClick={onCloseDrawer}>
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Box>
          <Box flexGrow={1} textAlign="left">
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '22px',
                color: (theme as any).palette.terciary[700],
              }}
            >
              {t('Add address')}
            </Typography>
          </Box>
        </Box>
      );
    }
    return (
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} textAlign="left" ml={3}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '22px',
              color: (theme as any).palette.terciary[700],
            }}
          >
            {t('Add address')}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const Body = () => (
    <Grid container spacing={2} p={variant === 'drawer' ? 2 : 0}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting, values, handleBlur, handleChange, handleSubmit }): JSX.Element => (
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              gap: theme.spacing(2),
              padding: variant === 'drawer' ? theme.spacing(2) : `0px ${theme.spacing(0)} 0px ${theme.spacing(2)}`,
            }}
          >
            <Grid item xs={12} width="100%" display="flex">
              <TextField
                fullWidth
                name="address"
                margin="dense"
                id="import-wallet"
                variant="outlined"
                placeholder="Paste Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
                sx={{
                  '& > div > input': {
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: (theme as any).palette.neutral[900],
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} width="100%" display="flex">
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  borderRadius: '10px',
                  padding: `8px ${theme.spacing(3)}`,
                  background: (theme as any).palette.primary[400],
                  '&:hover': {
                    background: (theme as any).palette.primary[500],
                  },
                }}
              >
                {t('Add address')}
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
      <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
        <Divider sx={{ width: '35%', height: 0 }} />
        <Typography
          textAlign="center"
          fontWeight="400"
          lineHeight="20px"
          fontSize="15px"
          color={theme.palette.text.secondary}
          width="150px"
          padding="0 5px"
        >
          {t('Or import from')}
        </Typography>
        <Divider sx={{ width: '35%', height: 0 }} />
      </Grid>
      <Grid item xs={12} sm={6} display="flex">
        <Button
          fullWidth
          variant="outlined"
          onClick={onMetamaskConnect}
          sx={{
            border: 'none',
            borderRadius: '10px',
            padding: `8px ${theme.spacing(3)}`,
            color: theme.palette.primary.main,
            background: (theme as any).palette.primary[50],
            '&:hover': {
              background: hexToRGB((theme as any).palette.primary[50], 0.5),
              border: 'none',
            },
          }}
        >
          <img
            src={getConnectorSrc('metamask')}
            alt="MetaMask"
            style={{
              width: '30px',
              paddingRight: '5px',
            }}
          />
          MetaMask
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} display="flex">
        <Button
          fullWidth
          variant="outlined"
          onClick={onWalletConnect}
          sx={{
            border: 'none',
            borderRadius: '10px',
            padding: `8px ${theme.spacing(3)}`,
            color: theme.palette.primary.main,
            background: (theme as any).palette.primary[50],
            '&:hover': {
              background: hexToRGB((theme as any).palette.primary[50], 0.5),
              border: 'none',
            },
          }}
        >
          <img
            src={getConnectorSrc('walletconnect')}
            alt="MetaMask"
            style={{
              width: '30px',
              paddingRight: '5px',
            }}
          />
          Wallet Connect
        </Button>
      </Grid>
    </Grid>
  );

  if (variant === 'drawer')
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={openDrawer}
        onClose={onCloseDrawer}
        onOpen={handleToggleDrawer}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <Header />
        <Divider flexItem variant="middle" sx={{ marginBottom: theme.spacing(1) }} />
        <Body />
      </SwipeableDrawer>
    );

  return (
    <Dialog
      {...rest}
      // classes={{ paper: classes.dialog }}
      onClose={onCloseDialog}
      maxWidth="sm"
      fullWidth={!isSmallScreen}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
        },
      }}
    >
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Header />
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Body />
      </DialogContent>
    </Dialog>
  );
};
