import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useSettings from 'src/hooks/useSettings';
import WalletConnectIcon from 'src/icons/svg-icons/WalletConnectIcon';
import gtm from 'src/lib/gtm';
import { AssetsContext, initialSelectedAddress } from 'src/pages/assets/AssetsContext';
import { networkToChainIdMap } from 'src/types/blockchain';
import { PageTitle } from 'src/ui/PageTitle';
import { getConnectorSrc } from 'src/utils/avatar';
import { metamaskWallet, walletConnect } from 'src/utils/connectWallet';
import { isAddress } from 'src/utils/stringUtils';

interface AssetsLandingProps {
  onWalletConnected?: (acc?: string) => void;
}

const AssetsLanding: FC<AssetsLandingProps> = ({ onWalletConnected }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { activate } = useWeb3React();
  const { settings } = useSettings();
  const { updateDemo, onImportAddress } = useContext(AssetsContext);

  const toggleDemo = useCallback(() => updateDemo((d) => !d), [updateDemo]);

  const onImport = useCallback(
    async (values): Promise<void> => {
      const newAddress = {
        ...initialSelectedAddress,
        address: values.address,
        name: values.address,
        identifier: 'tempAddress',
      };

      onImportAddress(newAddress);
      gtm.push({
        event: 'clicked_assets_import_wallet',
        category: 'Assets',
        action: 'clicked assets import wallet',
      });
    },
    [onImportAddress],
  );

  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const smallScreen = useMediaQuery(theme.breakpoints.down(675));

  const initialValues = {
    address: '',
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .test('len', 'Input a valid Address.', (value) => isAddress(value))
      .required('Address is required.'),
  });

  const onWalletConnect = useCallback(async () => {
    await walletConnect(activate, onWalletConnected, networkToChainIdMap[settings.network]);
  }, [onWalletConnected, settings.network]);

  const onMetamaskConnect = useCallback(async () => {
    await metamaskWallet(activate, onWalletConnected);
  }, [onWalletConnected]);

  return (
    <Grid container display="flex" flexDirection="column">
      <Grid item display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            '& > h4': {
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: '28px',
              color: (theme as any).palette.neutral[700],
            },
          }}
        >
          <PageTitle title={t('Assets')} />
        </Box>
        {!smallScreen ? (
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '20px',
              color: (theme as any).palette.neutral[600],
              marginBottom: theme.spacing(3),
            }}
          >
            {t('Check your assets, view your favorites and more')}
          </Typography>
        ) : null}
      </Grid>
      {smallScreen ? (
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '20px',
              color: (theme as any).palette.neutral[600],
              marginBottom: theme.spacing(2),
            }}
          >
            {t('Check your assets, view your favorites and more')}
          </Typography>
        </Grid>
      ) : null}
      <Card sx={{ padding: theme.spacing(3), maxWidth: '760px', width: '100%' }}>
        <Grid item display="flex" flexDirection="column" gap={2}>
          <Grid item display="flex">
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '24px',
                color: (theme as any).palette.terciary[700],
                marginBottom: theme.spacing(1),
              }}
            >
              {t('Set your wallet')}
            </Typography>
          </Grid>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onImport}>
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
                }}
              >
                <Grid item xs={12} width="100%" display="flex">
                  <TextField
                    fullWidth
                    required
                    name="address"
                    margin="dense"
                    id="import-wallet"
                    variant="outlined"
                    label="Wallet Address"
                    placeholder="Paste wallet address"
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
                    size="large"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: (theme as any).palette.primary[400],
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: '20px',
                        color: (theme as any).palette.neutral[0],
                        marginTop: '3px',
                        marginBottom: '3px',
                        margin: `3px ${theme.spacing(2)}`,
                      }}
                    >
                      {t('Import Wallet')}
                    </Typography>
                  </Button>
                </Grid>
              </form>
            )}
          </Formik>
          <Grid item display="flex" alignItems="center">
            <Divider sx={{ width: '39%', height: 1 }} />
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '20px',
                color: (theme as any).palette.neutral[500],
                textAlign: 'center',
                width: '150px',
                padding: '0px 5px',
              }}
            >
              {t('Or import from')}
            </Typography>
            <Divider sx={{ width: '39%', height: 1 }} />
          </Grid>
          <Grid item display="flex" xs={12} flexDirection={isMobile ? 'column' : 'row'} gap={2}>
            <Grid item display="flex" xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onMetamaskConnect}
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: (theme as any).palette.primary[400],
                  borderRadius: '10px',
                  height: '40px',
                  padding: `8px ${theme.spacing(3)}`,
                  backgroundColor: (theme as any).palette.primary[50],
                  border: 'none',
                  '&:hover': {
                    borderRadius: '10px',
                    border: 'none',
                  },
                  '& > span': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  },
                  '& > span > img': {
                    width: '20px',
                  },
                }}
              >
                <img src={getConnectorSrc('metamask')} alt="MetaMask" />
                MetaMask
              </Button>
            </Grid>
            <Grid item display="flex" xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onWalletConnect}
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: (theme as any).palette.primary[400],
                  borderRadius: '10px',
                  height: '40px',
                  padding: `8px ${theme.spacing(3)}`,
                  backgroundColor: (theme as any).palette.primary[50],
                  border: 'none',
                  '&:hover': {
                    borderRadius: '10px',
                    border: 'none',
                  },
                  '& > span': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  },
                  '& > span > img': {
                    width: '30px',
                  },
                }}
              >
                <WalletConnectIcon />
                Wallet Connect
              </Button>
            </Grid>
          </Grid>
          <Grid item display="flex">
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '20px',
                color: (theme as any).palette.neutral[500],
                marginTop: theme.spacing(1),
              }}
            >
              {t("Don't have a wallet?")}
              <Link
                underline="hover"
                onClick={toggleDemo}
                sx={{
                  color: (theme as any).palette.primary[400],
                  paddingLeft: theme.spacing(1),
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                {t('View a Demo')}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default AssetsLanding;
