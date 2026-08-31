import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import _isEqual from 'lodash/isEqual';
import Web3 from 'web3';
import * as Yup from 'yup';
import { FC, memo, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { LockToken } from 'src/types/locker';
import { marketSalePeriodOptions, MarketSalePeriod } from 'src/types/marketplace';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerToken } from 'src/ui/EulerToken';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { approve, getData, getBalance, onLock, onUnlock, checkLockerEnabled } from 'src/utils/locker';
import { logger } from 'src/utils/logger';
import { isBNBToken } from 'src/utils/marketplace';
import { getAge, localeDate } from 'src/utils/moment';

interface LockerDialogProps extends DialogProps {
  onClose: () => void;
  token: LockToken;
}

const LockingDialog: FC<LockerDialogProps> = ({ onClose, token, ...rest }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { account, library } = useWeb3React();
  const web3 = new Web3(library?.provider);
  const { chain } = useContext(ConfigurationContext);

  const [tokenData, setTokenData] = useState<LockToken>(null);
  const [displayAge, setDisplayAge] = useState(false);
  const [minDateTime, setMinDateTime] = useState(new Date());
  const [maxDateTime, setMaxDateTime] = useState(new Date());

  const lockerContractAddress = useMemo(() => chain?.bsc?.products?.locker, [chain?.bsc?.products?.locker]);
  const taxContractAddress = useMemo(() => chain?.bsc?.products?.manager_tax, [chain?.bsc?.products?.manager_tax]);
  const isLockerEnabled = useMemo(
    () => checkLockerEnabled(lockerContractAddress) && checkLockerEnabled(taxContractAddress),
    [lockerContractAddress],
  );

  const onCloseDialog = () => {
    onClose();
  };

  const updateMinDateTime = () => {
    let newMinDate = new Date();
    let newMinTimestamp: number;
    if (tokenData.deadline) {
      const deadlineDate = new Date(tokenData.deadline * 1000);
      if (newMinDate <= deadlineDate) {
        newMinDate = deadlineDate;
        newMinTimestamp = newMinDate.getTime();
        setMinDateTime(new Date(newMinTimestamp));
        return;
      }
    }
    newMinTimestamp = newMinDate.setMinutes(newMinDate.getMinutes() + 10);
    setMinDateTime(new Date(newMinTimestamp));
  };

  const updateMaxDateTime = () => {
    const newMaxDate = new Date();
    const newMaxDateTimestamp = newMaxDate.setFullYear(newMaxDate.getFullYear() + 1);
    setMaxDateTime(new Date(newMaxDateTimestamp));
  };

  const updateTokenData = async () => {
    const { amount, deadline } = await getData?.(token.address.toLowerCase(), lockerContractAddress, account, web3);
    const balance = await getBalance(token.address.toLowerCase(), account, web3);

    if (amount && deadline) {
      setTokenData((prev) => ({
        ...prev,
        balance,
        deadline: +deadline,
        locked: +Web3.utils.fromWei(amount),
      }));
    }
  };

  const onLockClick = useCallback(
    async (values) => {
      try {
        const weiAmount = Web3.utils.toWei(new BigNumber(values.lockInput).toString(), 'ether');

        /**
         * Always consider the deadline in the moment user clicks Lock,
         * period and amountPeriod are defined in seconds so we need to
         * multiply by 1000 to get correct timestamp.
         */
        const now = new Date();
        const deadline = new Date(now.setTime(now.getTime() + values.period * values.amountPeriod * 1000));

        if (!isBNBToken(tokenData.address.toLowerCase())) {
          await approve(tokenData.address.toLowerCase(), lockerContractAddress, account, weiAmount, web3);
        }

        await onLock(
          tokenData.address.toLowerCase(),
          lockerContractAddress,
          taxContractAddress,
          account,
          values.lockInput.toString(),
          deadline,
          web3,
        );
      } catch (error) {
        logger(error);
      }
    },
    [account, tokenData],
  );

  const onUnlockClick = useCallback(async () => {
    try {
      await onUnlock(tokenData.address.toLowerCase(), lockerContractAddress, taxContractAddress, account, web3);
    } catch (error) {
      logger(error);
    }
  }, [account, tokenData]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      updateTokenData();
      updateMinDateTime();
      updateMaxDateTime();
    }, 10000);

    // First Run
    if (tokenData) {
      updateMinDateTime();
      updateMaxDateTime();
    }

    return () => clearInterval(refreshInterval);
  }, [tokenData]);

  useEffect(() => {
    setTokenData(token);
  }, []);

  return (
    <Dialog {...rest} onClose={onCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} textAlign="center">
            {t('LOCK MANAGER')}
          </Box>
          <Box>
            <IconButton onClick={onCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        {!tokenData ? (
          <EulerLoading />
        ) : (
          <Grid container display="flex" justifyContent="space-between" spacing={2}>
            <Grid
              item
              xs={12}
              sx={{
                '& > div > div': {
                  minWidth: 'auto',
                },
              }}
            >
              <Card sx={{ background: theme.palette.background.default }}>
                <CardHeader
                  sx={{ paddingRight: 0 }}
                  title={
                    <Grid container spacing={2} pb={2} sx={{ background: theme.palette.background.paper }}>
                      <Grid item xs={12} md={3} display="flex" alignItems="flex-start">
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            [theme.breakpoints.down('md')]: {
                              alignItems: 'center',
                            },
                          }}
                        >
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
                              },
                            }}
                          >
                            <EulerToken
                              address={tokenData.address}
                              name={tokenData.symbol}
                              addressLink={tokenData.address}
                              avatarSize="extra"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                        <Typography color="primary" variant="h5" my={1}>
                          {t('BALANCE')}
                        </Typography>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                          <Tooltip title={`${tokenData.balance} ${tokenData.symbol}`}>
                            <Typography color="textPrimary" variant="subtitle1">
                              {tokenData
                                ? `${getBigNumberCurrencyLabel(tokenData.balance, false, 4)} ${tokenData.symbol}`
                                : 'N/A'}
                            </Typography>
                          </Tooltip>
                          {tokenData.total_usd ? (
                            <Typography color="textSecondary" variant="overline">
                              {`${getBigNumberCurrencyLabel(tokenData.total_usd, false, 4)} USD`}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                        <Typography color="primary" variant="h5" my={1}>
                          {t('LOCKED')}
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Tooltip title={`${tokenData.locked} ${tokenData.symbol}`}>
                            <Typography color="textPrimary" variant="subtitle1">
                              {tokenData
                                ? `${getBigNumberCurrencyLabel(tokenData.locked || 0, false, 4)} ${tokenData.symbol}`
                                : 'N/A'}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                        <Typography color="primary" variant="h5" my={1}>
                          {tokenData.deadline ? t('DEADLINE') : t('DATE')}
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Typography
                            onClick={() => setDisplayAge((prev) => !prev)}
                            color="textPrimary"
                            variant="subtitle1"
                            fontWeight="bold"
                          >
                            {tokenData.deadline
                              ? `${
                                  displayAge
                                    ? getAge(new Date(tokenData.deadline * 1000).toISOString())
                                    : localeDate(new Date(tokenData.deadline * 1000).toISOString())
                                }`
                              : localeDate(new Date().toISOString())}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  }
                />
                <CardContent>
                  <Grid container justifyContent="space-evenly" pb={1} rowGap={2}>
                    <Grid item xs={12} display="flex" flexDirection="column" justifyContent="space-between">
                      <Formik
                        validateOnBlur
                        validateOnChange
                        initialValues={
                          {
                            lockInput: '0',
                            period: 60,
                            amountPeriod: 1,
                          } as {
                            lockInput: string;
                            period: number;
                            amountPeriod: number;
                          }
                        }
                        validationSchema={Yup.object().shape({
                          lockInput: Yup.number()
                            .required('Lock value is required.')
                            .min(0.000000000000000001, 'Minimum Lock value is set to 1 Wei.')
                            .max(+tokenData.balance, 'Your wallet does not hold that many tokens.')
                            .typeError('Must be a number.'),
                          period: Yup.number()
                            .positive('Time Period should be a positive number.')
                            .required('Time Period is required.'),
                          amountPeriod: Yup.number()
                            .positive('Time Unit should be a positive number.')
                            .test('isInteger', 'Time Unit should be an integer.', (value) => Number.isInteger(value))
                            .test(
                              'minDate',
                              'Minimum is 10 minutes or current deadline.',
                              // Need to use function() to be able to access {this.parent}
                              // eslint-disable-next-line func-names
                              function (value) {
                                // eslint-disable-next-line react/no-this-in-sfc
                                const { period } = this.parent;
                                const now = new Date();
                                const deadline = new Date(now.setTime(now.getTime() + period * value * 1000));
                                if (deadline > minDateTime) {
                                  return true;
                                }
                                return false;
                              },
                            )
                            .test(
                              'maxDate',
                              'Deadline cannot go over 1 year.',
                              // Need to use function() to be able to access {this.parent}
                              // eslint-disable-next-line func-names
                              function (value) {
                                // eslint-disable-next-line react/no-this-in-sfc
                                const { period } = this.parent;
                                const now = new Date();
                                const deadline = new Date(now.setTime(now.getTime() + period * value * 1000));
                                if (deadline < maxDateTime) {
                                  return true;
                                }
                                return false;
                              },
                            )
                            .required('Time Unit is required.')
                            .typeError('Time Unit should be a number.'),
                        })}
                        onSubmit={onLockClick}
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
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Amount"
                                  size="small"
                                  onFocus={(event) => {
                                    event.target.select();
                                  }}
                                  error={Boolean(touched.lockInput && errors.lockInput)}
                                  helperText={touched.lockInput && errors.lockInput}
                                  value={values.lockInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="lockInput"
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
                                    '& > p': {
                                      position: 'absolute',
                                      bottom: theme.spacing(-3),
                                      minWidth: 350,
                                    },
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <Button
                                        onClick={() => {
                                          setFieldValue('lockInput', tokenData.balance);
                                          setFieldTouched('lockInput', true, false);
                                        }}
                                        size="small"
                                        color="primary"
                                        disabled={isSubmitting}
                                      >
                                        {t('MAX')}
                                      </Button>
                                    ),
                                  }}
                                  disabled={isSubmitting}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  select
                                  size="small"
                                  id="period"
                                  name="period"
                                  variant="outlined"
                                  label={t('Time Period')}
                                  value={values.period}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={!!(touched.period && errors.period)}
                                  helperText={touched.period && errors.period}
                                  sx={{
                                    '& > p': {
                                      position: 'absolute',
                                      bottom: theme.spacing(-3),
                                      minWidth: 350,
                                    },
                                  }}
                                >
                                  {marketSalePeriodOptions.map((option) => (
                                    <MenuItem key={option.key} value={option.key}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  id="amountPeriod"
                                  name="amountPeriod"
                                  variant="outlined"
                                  label={t('Time Unit')}
                                  value={values.amountPeriod}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={!!(touched.amountPeriod && errors.amountPeriod)}
                                  helperText={touched.amountPeriod && errors.amountPeriod}
                                  sx={{
                                    '& > div': {
                                      background: theme.palette.background.default,
                                      borderRadius: theme.spacing(2),
                                      color: theme.palette.primary.main,
                                      fontWeight: 700,
                                    },
                                    '& > p': {
                                      position: 'absolute',
                                      bottom: theme.spacing(-3),
                                      minWidth: 350,
                                    },
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <Button
                                        onClick={() => {
                                          /**
                                           * Setup minimum lock deadline in a easy way,
                                           * defaults to 10 minutes or current deadline
                                           * defined in number of minutes until said
                                           * date.
                                           */
                                          const diff = Math.abs(new Date().getTime() - minDateTime.getTime());
                                          const timeDiffMin = Math.ceil(diff / 1000 / 60);

                                          setFieldValue('period', MarketSalePeriod.MINUTE);
                                          setFieldValue('amountPeriod', timeDiffMin);

                                          setFieldTouched('period', true, false);
                                          setFieldTouched('amountPeriod', true, false);
                                        }}
                                        size="small"
                                        color="primary"
                                        disabled={isSubmitting}
                                      >
                                        {t('MIN')}
                                      </Button>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center">
                                <Button
                                  color="primary"
                                  disabled={isLockerEnabled && isSubmitting}
                                  size="large"
                                  type="submit"
                                  variant="contained"
                                  sx={{ padding: theme.spacing(0.75, 3) }}
                                >
                                  {t('LOCK')}
                                </Button>
                              </Grid>
                              <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center">
                                <Button
                                  color="primary"
                                  disabled={
                                    isLockerEnabled &&
                                    !(tokenData.deadline > 0 && new Date(tokenData.deadline * 1000) < new Date())
                                  }
                                  size="large"
                                  variant="contained"
                                  onClick={onUnlockClick}
                                  sx={{ padding: theme.spacing(0.75, 3) }}
                                >
                                  {t('UNLOCK')}
                                </Button>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(LockingDialog, (prevProps, nextProps) => _isEqual(prevProps, nextProps));
