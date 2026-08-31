import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useCallback, useState } from 'react';
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
import { editWallet, WalletItem } from 'src/slices/user/wallet';
import { useDispatch } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { isAddress } from 'src/utils/stringUtils';

interface RenameWalletAddressProps extends DialogProps {
  onClose: () => void;
  wallet: WalletItem;
  variant: 'dialog' | 'drawer';
}

export const RenameWalletAddress: FC<RenameWalletAddressProps> = ({ onClose, wallet, variant, ...rest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [openDrawer, setOpenDrawer] = useState(true);

  const initialValues = {
    name: wallet.name,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
  });

  const handleToggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const onCloseDrawer = () => {
    onClose();
  };

  const onCloseDialog = () => {
    onClose();
  };

  const onRenameAddressSuccess = () =>
    enqueueSnackbar('Address renamed successfully.', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 2500,
      variant: 'info',
    });

  const onSubmit = useCallback(async (values): Promise<void> => {
    const newWallet = {
      ...wallet,
      name: values.name,
      type: 'address',
      network: ESupportedNetworks.BNB,
    };
    dispatch(editWallet(newWallet));
    onRenameAddressSuccess();
    onClose();
  }, []);

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
            <Typography variant="body1" fontWeight={500}>
              {t('Rename Address')}
            </Typography>
          </Box>
        </Box>
      );
    }
    return (
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} textAlign="left" ml={3}>
          {t('Rename Address')}
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
    <Grid container spacing={2} p={variant === 'drawer' ? 2 : 0} pt={!isAddress(wallet.name) ? 2 : 0}>
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
                name="name"
                margin="dense"
                id="import-wallet"
                variant="outlined"
                label={!isAddress(wallet.name) ? wallet.address : null}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
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
                {t('Rename Address')}
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
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
      onClose={onCloseDialog}
      maxWidth="sm"
      fullWidth={!isSmallScreen}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
        },
      }}
    >
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4, paddingBottom: !isAddress(wallet.name) ? 0 : '16px' }}>
        <Header />
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Body />
      </DialogContent>
    </Dialog>
  );
};
