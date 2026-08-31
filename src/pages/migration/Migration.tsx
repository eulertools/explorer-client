import { EulerIconArrowRight, EulerIconArrowDown1 } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import Web3 from 'web3';
import * as Yup from 'yup';
import { FC, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@material-ui/core';
import Alert from '@material-ui/core/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import LoadingButton from '@material-ui/lab/LoadingButton';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import useModal from 'src/components/modal/useModal';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import { useIntl } from 'src/hooks/useIntl';
import { MigrationComplete } from 'src/pages/migration/Modal/MigrationComplete';
import { EulerToken } from 'src/ui/EulerToken';
import { PageTitle } from 'src/ui/PageTitle';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { logger } from 'src/utils/logger';
import { BNBToken } from 'src/utils/marketplace';
import { getBalance, getMigrated, onMigrate, approve } from 'src/utils/migration';
import { isAddress } from 'src/utils/stringUtils';

interface EulerTokenMigration {
  address: string;
  symbol: string;
  migrated: string;
  circulating: string;
}

interface UserEulerToken {
  balance: string;
  migrated: string;
  balance_usd: string;
  migrated_usd: string;
}

const Migration: FC = () => {
  const { t } = useTranslation();
  const intl = useIntl();
  const theme = useTheme();
  const { showModal } = useModal();
  const { poolDataBUSD } = useCoinData();
  const { account, library } = useWeb3React();
  const { chain } = useContext(ConfigurationContext);

  const [eulerData, setEulerData] = useState<EulerTokenMigration>(null);
  const [userData, setUserData] = useState<UserEulerToken>(null);
  const [loading, setLoading] = useState(false);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down(850));

  const INITIAL_EULER = 100_000_000;
  const eulerRPC = useMemo(() => chain?.bsc?.rpc, [chain?.bsc?.rpc]);
  const eulerToken = useMemo(() => chain?.bsc?.tokens?.euler, [chain?.bsc?.tokens?.euler?.address]);
  const migrationContractAddress = useMemo(() => chain?.bsc?.products?.token, [chain?.bsc?.products?.token]);
  const isMigrationEnabled = useMemo(
    () => eulerRPC && isAddress(eulerToken?.address) && isAddress(migrationContractAddress),
    [eulerRPC, migrationContractAddress, eulerToken?.address],
  );

  const web3Euler = new Web3(eulerRPC);
  const web3User = new Web3(library?.provider);

  const openCongratulationsModal = (amount: string) => {
    const congratulationsModal = showModal(MigrationComplete, {
      onClose: () => {
        congratulationsModal.hide();
      },
      amount,
    });
  };

  const onConnectWallet = () => {
    const connectWalletModal = showModal(ConnectYourWallet, {
      onWalletConnected: () => {
        connectWalletModal.hide();
      },
      onCancel: () => {
        connectWalletModal.hide();
      },
    });
  };

  const onMigrateClick = useCallback(
    async (values, { setFieldValue, setFieldTouched }) => {
      try {
        setLoading(true);
        await approve(eulerToken.address, migrationContractAddress, values.migrateInput.toString(), account, web3User);
        const migrationSuccess = await onMigrate(
          migrationContractAddress,
          account,
          values.migrateInput.toString(),
          web3User,
        );
        if (migrationSuccess) {
          openCongratulationsModal(values.migrateInput.toString());
        }
      } catch (error) {
        logger(error);
      } finally {
        setLoading(false);
        setFieldValue('migrateInput', '0');
        setFieldTouched('migrateInput', false, false);
      }
    },
    [account, eulerData],
  );

  // TODO: Remove 1 wei from the "To Unstake" value to avoid error in the contract.
  useEffect(() => {
    const getEulerData = async () => {
      const burnt = await getBalance(eulerToken.address, '0x000000000000000000000000000000000000dead', web3Euler);
      const migrated = await getBalance(eulerToken.address, migrationContractAddress, web3Euler);
      const circulating = new BigNumber(INITIAL_EULER.toString()).minus(burnt).minus(migrated).toString();

      const data = {
        address: eulerToken.address,
        symbol: eulerToken.symbol,
        circulating,
        migrated,
      };

      setEulerData(data);
    };

    const getUserData = async () => {
      const balance = await getBalance(eulerToken.address, account, web3User);
      const migrated = await getMigrated(migrationContractAddress, account, web3User);

      const eulerPrice = poolDataBUSD.price || '0';

      const data = {
        balance,
        migrated,
        balance_usd: getBigNumberCurrencyLabel(new BigNumber(balance).multipliedBy(eulerPrice), false, 4),
        migrated_usd: getBigNumberCurrencyLabel(new BigNumber(migrated).multipliedBy(eulerPrice), false, 4),
      };

      setUserData(data);
    };

    if (poolDataBUSD && isMigrationEnabled) {
      getEulerData();
    }

    if (account && poolDataBUSD) {
      getUserData();
    }

    if (!account) {
      setUserData(null);
    }
  }, [account, poolDataBUSD, loading, isMigrationEnabled]);

  return (
    <Grid container display="flex" justifyContent="space-between" spacing={2}>
      <Grid
        item
        display="flex"
        flexDirection="column"
        xs={12}
        gap={2}
        sx={{
          '& > div > div': {
            minWidth: 'auto',
          },
        }}
      >
        <Card
          sx={{
            background: theme.palette.background.paper,
            boxShadow: 'none',
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
          }}
        >
          <CardContent sx={{ padding: '0px !important' }}>
            <Grid
              container
              display="flex"
              flexDirection={isSmallScreen ? 'column' : 'row'}
              alignItems="center"
              justifyContent="space-between"
              pb={1}
              gap={0}
            >
              <Grid item display="flex">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
                  sx={{
                    alignItems: 'center',
                    fontSize: theme.spacing(3),
                    '& > div > a > p': {
                      fontSize: theme.spacing(3),
                      fontWeight: 600,
                      marginLeft: theme.spacing(0),
                    },
                  }}
                >
                  <Box
                    sx={{
                      '& > div > div': {
                        width: '32px',
                        height: '32px',
                      },
                      '& > div > a > p': {
                        fontSize: theme.spacing(3),
                        fontWeight: 600,
                        marginLeft: theme.spacing(3),
                        lineHeight: '28px',
                      },
                    }}
                  >
                    <EulerToken
                      address={migrationContractAddress}
                      name="Euler V2"
                      addressLink={BNBToken}
                      avatarSize="extra"
                    />
                  </Box>
                </Box>
              </Grid>
              <Divider flexItem orientation="vertical" sx={{ color: '#C9D5EB' }} />
              <Grid item display="flex" flexDirection="column">
                <Typography color="textPrimary" variant="h6" my={1} fontSize="18px">
                  {t('Tokens to Migrate')}
                </Typography>
                <Tooltip title={eulerData ? `${eulerData.circulating} EULER` : 'N/A'}>
                  <Typography color="textPrimary" variant="subtitle1" textAlign="center">
                    {eulerData
                      ? intl.formatNumber(new BigNumber(eulerData.circulating).toNumber(), {
                          notation: 'compact',
                          minimumSignificantDigits: 3,
                          maximumSignificantDigits: 3,
                        })
                      : 'N/A'}
                  </Typography>
                </Tooltip>
              </Grid>
              <Divider flexItem orientation="vertical" sx={{ color: '#C9D5EB' }} />
              <Grid item display="flex" flexDirection="column">
                <Typography color="textPrimary" variant="h6" my={1} fontSize="18px">
                  {t('Tokens Migrated')}
                </Typography>
                <Tooltip title={eulerData ? `${eulerData.migrated} EULER` : 'N/A'}>
                  <Typography color="textPrimary" variant="subtitle1" textAlign="center">
                    {eulerData
                      ? intl.formatNumber(new BigNumber(eulerData.migrated).toNumber(), { notation: 'compact' })
                      : 'N/A'}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ background: theme.palette.background.paper, boxShadow: 'none' }}>
          <CardContent sx={{ padding: '0px !important' }}>
            <Grid container justifyContent="space-evenly" p={4} rowGap={2}>
              <Grid item xs={12} display="flex" flexDirection="column" justifyContent="space-between">
                <Formik
                  validateOnBlur
                  validateOnChange
                  initialValues={
                    {
                      migrateInput: '0',
                    } as {
                      migrateInput: string;
                    }
                  }
                  validationSchema={Yup.object().shape({
                    migrateInput: Yup.number()
                      .required('Migrate value is required.')
                      .min(0.000000000000000001, 'Minimum Migrate value is set to 1 Wei.')
                      .max(+userData?.balance, 'Your wallet does not hold that many tokens.')
                      .typeError('Must be a number.'),
                  })}
                  onSubmit={onMigrateClick}
                >
                  {({
                    errors,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setFieldValue,
                    setFieldTouched,
                    handleBlur,
                  }): JSX.Element => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={1} alignItems="center" justifyContent="center" flexDirection="column">
                        <Grid item width="100%">
                          <Card
                            sx={{
                              background: theme.palette.background.default,
                              boxShadow: 'none',
                              padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                              display: 'flex',
                              justifyContent: 'space-around',
                              alignItems: 'center',
                              flexDirection: isSmallScreen ? 'column' : 'row',
                              gap: isSmallScreen ? theme.spacing(2) : theme.spacing(0),
                            }}
                          >
                            <Grid>
                              <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                gap={1}
                                sx={{
                                  alignItems: 'center',
                                  fontSize: theme.spacing(3),
                                  '& > div > a > p': {
                                    fontSize: theme.spacing(2),
                                    fontWeight: 700,
                                    marginLeft: theme.spacing(3),
                                    lineHeight: '20px',
                                  },
                                }}
                              >
                                <EulerToken
                                  address={eulerToken?.address}
                                  name="EULER V1"
                                  addressLink={BNBToken}
                                  avatarSize="medium"
                                />
                              </Box>
                            </Grid>
                            <Grid
                              display="flex"
                              alignItems="center"
                              sx={{
                                '& > svg > path': {
                                  stroke: isSmallScreen ? '' : theme.palette.primary.main,
                                  fill: isSmallScreen ? theme.palette.primary.main : '',
                                },
                              }}
                            >
                              {isSmallScreen ? <EulerIconArrowDown1 size="l" /> : <EulerIconArrowRight size="l" />}
                            </Grid>
                            <Grid>
                              <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                gap={1}
                                sx={{
                                  alignItems: 'center',
                                  fontSize: theme.spacing(3),
                                  '& > div > a > p': {
                                    fontSize: theme.spacing(2),
                                    fontWeight: 700,
                                    marginLeft: theme.spacing(3),
                                    lineHeight: '20px',
                                  },
                                }}
                              >
                                <EulerToken
                                  address={migrationContractAddress}
                                  name="EULER V2"
                                  addressLink={BNBToken}
                                  avatarSize="medium"
                                />
                              </Box>
                            </Grid>
                          </Card>
                        </Grid>
                        <Grid item width="100%">
                          <Card
                            sx={{
                              background: theme.palette.background.default,
                              boxShadow: 'none',
                              padding: `${theme.spacing(5)} ${theme.spacing(2)}`,
                              position: 'relative',
                            }}
                          >
                            <Tooltip title={userData ? userData.balance : 'N/A'}>
                              <Typography
                                variant="subtitle2"
                                mr={1}
                                sx={{
                                  position: 'absolute',
                                  right: '16px',
                                  top: theme.spacing(2),
                                }}
                              >
                                {userData ? `Balance : ${getBigNumberCurrencyLabel(userData.balance, false, 4)}` : ''}
                              </Typography>
                            </Tooltip>
                            <TextField
                              fullWidth
                              label="Amount"
                              size="small"
                              onFocus={(event) => {
                                event.target.select();
                              }}
                              error={Boolean(touched.migrateInput && errors.migrateInput)}
                              helperText={touched.migrateInput && errors.migrateInput}
                              value={values.migrateInput}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="migrateInput"
                              id="euler-lock-input"
                              variant="outlined"
                              style={{ margin: 0 }}
                              sx={{
                                '& > div': {
                                  background: theme.palette.background.default,
                                  borderRadius: theme.spacing(2),
                                  color: theme.palette.primary.main,
                                  fontWeight: 700,
                                },
                                '& > div > input': {
                                  textAlign: 'right',
                                },
                                '& > p': {
                                  position: 'absolute',
                                  bottom: theme.spacing(-3),
                                  minWidth: 350,
                                },
                              }}
                              disabled={isSubmitting}
                            />
                            <Button
                              onClick={() => {
                                setFieldValue('migrateInput', userData?.balance);
                                setFieldTouched('migrateInput', true, false);
                              }}
                              size="small"
                              color="primary"
                              disabled={isSubmitting}
                              sx={{
                                position: 'absolute',
                                right: '16px',
                                bottom: theme.spacing(1),
                              }}
                            >
                              {t('MAX')}
                            </Button>
                          </Card>
                        </Grid>
                        <Grid item display="flex" justifyContent="center" width="100%" mt={3}>
                          {account ? (
                            <LoadingButton
                              fullWidth
                              color="primary"
                              size="large"
                              type="submit"
                              variant="contained"
                              loadingPosition="end"
                              endIcon={<></>}
                              loading={loading}
                              // TODO: Manually disabled Migration until further notice.
                              disabled
                              sx={{ padding: theme.spacing(0.75, 3), backgroundColor: theme.palette.primary[400] }}
                            >
                              {t('Migrate')}
                            </LoadingButton>
                          ) : (
                            <Button
                              fullWidth
                              color="primary"
                              size="large"
                              variant="contained"
                              sx={{ padding: theme.spacing(0.75, 3), backgroundColor: theme.palette.primary[400] }}
                              onClick={onConnectWallet}
                            >
                              {t('Connect your wallet')}
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

interface MigrationWrapperProps extends DialogProps {
  type: 'page' | 'dialog';
  onCloseDialog?: () => void;
}

const MigrationWrapper: FC<MigrationWrapperProps> = ({ type = 'page', onCloseDialog, ...rest }) => {
  const { t } = useTranslation();
  const [alertOpen, setAlertOpen] = useState(true);

  if (type === 'page') {
    return (
      <CoinDataProvider>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              '& > h4': {
                fontSize: (theme) => theme.spacing(3),
              },
              padding: (theme) => theme.spacing(2, 2, 8),
              '@media (min-width: 600px)': {
                padding: (theme) => theme.spacing(3, 5, 8),
              },
              '@media (min-width: 960px)': {
                padding: (theme) => theme.spacing(3, 5, 8),
              },
              '@media (min-width: 1560px)': {
                padding: (theme) => theme.spacing(3, 5, 8),
              },
            }}
          >
            <PageTitle pageTitle="Migration" title="Migrate your EULERS to the new version!" />
            {/* TODO: Remove custom CSS once UI-KIT is updated with Warning colors. */}
            <Box
              sx={{
                marginBottom: (theme) => (alertOpen ? theme.spacing(2) : theme.spacing(0)),
                '& .MuiAlert-standard': {
                  display: 'flex',
                  alignItems: 'center',
                  padding: (theme) => `${theme.spacing(1)} ${theme.spacing(3)}`,
                  backgroundColor: '#FFECBC',
                },
                '& .MuiAlert-icon': {
                  color: '#FFA125 !important',
                },
                '& .MuiAlert-message': {
                  color: (theme) => (theme as any).palette.neutral[600],
                },
                '& .MuiAlert-action .MuiIconButton-label': {
                  color: '#292D32',
                },
              }}
            >
              <Collapse in={alertOpen}>
                <Alert
                  severity="warning"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="medium"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                      sx={{
                        marginRight: (theme) => theme.spacing(2),
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <b>Migration is currently on hold.</b> We are working with all the company resources and stakeholders
                  to speed up the process. We&apos;ll keep you updated.
                </Alert>
              </Collapse>
            </Box>
            <Migration />
          </Container>
        </Box>
      </CoinDataProvider>
    );
  }

  if (type === 'dialog') {
    return (
      <CoinDataProvider>
        <Dialog {...rest} onClose={onCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1} textAlign="center">
                {t('MIGRATION MANAGER')}
              </Box>
              <Box>
                <IconButton onClick={onCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ marginBottom: '24px' }}>
            <Migration />
          </DialogContent>
        </Dialog>
      </CoinDataProvider>
    );
  }
  return null;
};

export default MigrationWrapper;
