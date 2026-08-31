import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import Web3 from 'web3';
import * as Yup from 'yup';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { getBigNumberCurrencyLabel, uint256ToDecimalBn } from 'src/utils/bigNumber';
import SnackbarService from 'src/utils/snackbar';
import { DEFAULT_LABEL, EMetamaskErrors, EULER_AIRDROP_MIN, IWeb3ContractsGrouped } from './shared';
import { stakingStyles } from './styles';

interface IProps {
  eulerUSDPrice: BigNumber;
  contractsInformation: IWeb3ContractsGrouped;
  web3: Web3;
}

function UnstakeForm(props: IProps): JSX.Element {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const classes = stakingStyles();
  const theme = useTheme();
  const isMountedRef = useIsMountedRef();

  const { eulerUSDPrice, contractsInformation, web3 } = props;

  const onUnstake = React.useCallback(
    async (values, { setStatus, setSubmitting, resetForm }) => {
      // Stake
      try {
        // Convert user input to uint256
        const amount = web3.utils.toWei(new BigNumber(values.unstakeInput).toString(), 'ether');

        await contractsInformation?.staking.methods.withdraw(amount).send({ from: account });

        resetForm();
      } catch (error) {
        let errorMessage = 'Unknown error, please try again.';

        if (error.code === EMetamaskErrors.USER_DENIED_TRANSACTION) {
          errorMessage = 'You cancelled the unstake';
        }

        SnackbarService.error(errorMessage, {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 3500,
        });
      }

      if (isMountedRef.current) {
        setStatus({ success: true });
        setSubmitting(false);
      }
    },
    [contractsInformation, web3],
  );

  const eulerStaked = contractsInformation?.userInfo?.amount || DEFAULT_LABEL;
  const bnEulerStaked = uint256ToDecimalBn(eulerStaked);
  const formattedEulerStaked = React.useMemo(
    () => (eulerStaked !== DEFAULT_LABEL ? bnEulerStaked.toString() : DEFAULT_LABEL),
    [eulerStaked],
  );
  const eligibleForAirdrop = React.useMemo(
    () => (eulerStaked !== DEFAULT_LABEL ? bnEulerStaked.isGreaterThanOrEqualTo(EULER_AIRDROP_MIN) : false),
    [eulerStaked],
  );

  const disableButton = eulerStaked === DEFAULT_LABEL || formattedEulerStaked === '0' || !account;

  return (
    <>
      <Box>
        <Typography
          color={eligibleForAirdrop ? theme.palette.success.main : 'textPrimary'}
          variant="h6"
          marginBottom={1}
        >
          {eligibleForAirdrop ? '$EULER Staked (Airdrop Eligible)' : '$EULER Staked'}
        </Typography>
        <Typography color={eligibleForAirdrop ? theme.palette.success.main : 'textPrimary'} variant="h5">
          {getBigNumberCurrencyLabel(formattedEulerStaked)}
        </Typography>
        {eulerStaked !== DEFAULT_LABEL ? (
          <Typography color="textSecondary" variant="overline">
            {eulerUSDPrice
              ? getBigNumberCurrencyLabel(eulerUSDPrice.multipliedBy(formattedEulerStaked), false, 4)
              : DEFAULT_LABEL}{' '}
            USD
          </Typography>
        ) : null}
      </Box>
      <Formik
        validateOnChange={false}
        initialValues={{ unstakeInput: 0 } as { unstakeInput: number }}
        validationSchema={Yup.object().shape({
          unstakeInput: Yup.number()
            .required('Value is required')
            .min(0.000000000000000001, 'Minimum unstake is set to 1 wei')
            .max(+formattedEulerStaked, 'Unstake amount is higher than the available')
            .typeError('Must be a number'),
        })}
        onSubmit={onUnstake}
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
        }): JSX.Element => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} display="flex" alignItems="flex-start" marginTop={1}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  onFocus={(event) => {
                    event.target.select();
                  }}
                  error={Boolean(touched.unstakeInput && errors.unstakeInput)}
                  helperText={touched.unstakeInput && errors.unstakeInput}
                  value={values.unstakeInput}
                  onChange={handleChange}
                  margin="normal"
                  name="unstakeInput"
                  id="euler-unstake-input"
                  variant="outlined"
                  style={{ margin: 0 }}
                  InputProps={{
                    className: classes.stakeInput,
                    endAdornment: (
                      <Button
                        onClick={() => {
                          setFieldValue('unstakeInput', formattedEulerStaked);
                          setFieldTouched('unstakeInput', true, false);
                        }}
                        size="small"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        MAX
                      </Button>
                    ),
                  }}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  className={classes.button}
                  color="primary"
                  disabled={disableButton || !values.unstakeInput || isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {t('UNSTAKE')}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

export default UnstakeForm;
