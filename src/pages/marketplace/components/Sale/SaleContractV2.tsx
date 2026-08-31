import { ExtendedTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import Web3 from 'web3';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@material-ui/core';
import Alert from '@material-ui/core/Alert';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';
import erc20Abi from 'src/abi/erc20.json';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import gtm from 'src/lib/gtm';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import {
  marketSalePeriodOptions,
  EMarketContractSteps,
  marketContractStepOptions,
  MarketToken,
} from 'src/types/marketplaceV2';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import { MAX_APPROVE, isBNBToken } from 'src/utils/marketplace';

const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%',
    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    boxShadow: 'none',
    border: 'none',
    borderRadius: theme.spacing(1),
    width: '100%',
    background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
  },
  loadingButton: {
    padding: theme.spacing(0.75, 3),
    borderRadius: theme.spacing(1),
    boxShadow: 'none',
    width: '100%',
  },
}));

export const SaleContractV2 = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { account, library } = useWeb3React();
  const { chain } = useContext(ConfigurationContext);
  const { marketContractInstance, sale, updateSale, updateSaleSettings, modal, updateModal } = useContext(
    MarketplaceContext,
  );
  const {
    buyerWallet,
    tokenBase,
    tokenQuote,
    amountBase,
    amountQuote,
    kind,
    lockoutPeriod,
    lockoutPeriodUnits,
    numberPackages,
  } = sale;

  const [open, setOpen] = useState(false);
  const toggleCollapse = () => {
    setOpen((curr) => !curr);
  };

  const [isImmediatly, setIsImmediatly] = useState<boolean>(true);

  const contractStep = useMemo(() => marketContractStepOptions.find((i) => i.key === modal.step)?.label, [modal.step]);

  const handleBack = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const validationSchema = Yup.object().shape({
    timePeriod: Yup.number(),
    timeUnit: Yup.number()
      .required('Time unit is required.')
      .positive('Time unit should be a positive number.')
      .typeError('Installments should be a number.'),
    installments: Yup.number()
      .positive('Installements should be a positive number.')
      .required('Installements are required')
      .typeError('Installments should be a number.'),
  });

  const handleSubmit = (values) => {
    updateSale((prevState) => {
      const newObj: MarketToken = {
        ...prevState,
        lockoutPeriod: values.timePeriod,
        lockoutPeriodUnits: values.timeUnits,
        numberPackages: values.installments,
      };
      return newObj;
    });
    updateSaleSettings((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      timePeriod: 1,
      timeUnit: 1,
      installments: 1,
    },
    onSubmit: handleSubmit,
    validateOnBlur: false,
  });

  const linkedHelperText = useMemo(
    () => (baseField: string, quoteField: string) => {
      if (formik.touched[baseField] && formik.errors[baseField]) {
        return formik.errors[baseField].toString();
      }
      if (formik.touched[quoteField] && formik.errors[quoteField]) {
        return '';
      }
      return '';
    },
    [formik],
  );

  const approveToken = useCallback(async (tokenContract: string, amount: string): Promise<void> => {
    const web3 = new Web3(library?.provider);
    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenContract);
    try {
      const allowance = await erc20ContractInstance.methods
        .allowance(account, chain.bsc.products.marketplace)
        .call({ from: account });

      const amountFromWei = Web3.utils.fromWei(amount, 'ether');
      const allowanceFromWei = Web3.utils.fromWei(allowance, 'ether');

      const amountBn = uint256ToDecimalBn(amountFromWei);
      const allowanceBn = uint256ToDecimalBn(allowanceFromWei);

      if (allowanceBn.isZero()) {
        await erc20ContractInstance.methods
          .approve(chain.bsc.products.marketplace, MAX_APPROVE)
          .send({ from: account });
      } else if (allowanceBn.isLessThan(amountBn)) {
        await erc20ContractInstance.methods
          .increaseAllowance(chain.bsc.products.marketplace, MAX_APPROVE)
          .send({ from: account });
      }
    } catch (error) {
      loggerError('TOKEN APPROVAL FAILED', error);
    }
  }, []);

  const handleCreateSale = useCallback(async (): Promise<void> => {
    try {
      updateModal((prev) => ({
        ...prev,
        showModal: true,
        loading: true,
        activeModal: 'sale',
        kind,
        step: EMarketContractSteps.WAITING_APPROVAL,
      }));

      const fees = await marketContractInstance.methods.getCreateFees(kind, account).call();
      const feeWei = Web3.utils.fromWei(fees);
      let value = new BigNumber(feeWei);

      const weiAmountBase = Web3.utils.toWei(new BigNumber(amountBase).decimalPlaces(18).toString(), 'ether');
      const weiAmountQuote = Web3.utils.toWei(new BigNumber(amountQuote).decimalPlaces(18).toString(), 'ether');

      /**
       * We use this address to represent BNB in Testnet
       * therefore we don't need to approve a Sale
       * when an user wants to use BNB.
       */
      if (!isBNBToken(tokenBase.address.toLowerCase())) {
        await approveToken(tokenBase.address.toLowerCase(), weiAmountBase);
      } else {
        value = value.plus(new BigNumber(amountBase));
      }

      /**
       * Backend requires time in a seconds format
       * therefore we can remove the last 3 values
       * from a basic getTime().
       */
      let opening = new Date().getTime().toString();
      opening = opening.slice(0, opening.length - 3);

      const totalLockoutPeriod = new BigNumber(lockoutPeriod).multipliedBy(lockoutPeriodUnits);

      const newSaleObject = {
        seller: account,
        tokenBase: tokenBase.address.toLowerCase(),
        tokenQuote: tokenQuote.address.toLowerCase(),
        amountBase: weiAmountBase,
        amountQuote: weiAmountQuote,
        lockoutPeriod: totalLockoutPeriod.toNumber(),
        numberPackages,
        kind,
        tokenBaseId: 0,
        tokenQuoteId: 0,
        openingTime: +opening,
        closingTime: 0,
        amountPending: 0,
      };

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.WAITING_CONFIRMATION }));

      if (buyerWallet) {
        const response = await marketContractInstance.methods
          .create(kind, newSaleObject, buyerWallet)
          .send({ from: account, value: Web3.utils.toWei(value.toString()) });
        updateSale((prev) => ({ ...prev, id: response.events.CreateSale.returnValues.saleId }));
      } else {
        const response = await marketContractInstance.methods
          .create(kind, newSaleObject)
          .send({ from: account, value: Web3.utils.toWei(value.toString()) });
        updateSale((prev) => ({ ...prev, id: response.events.CreateSale.returnValues.saleId }));
      }

      // Send analytics for sale created
      gtm.push({ event: 'sale_created', category: 'Marketplace', action: 'User created a sale' });

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.CONFIRMED, loading: false }));
      updateSaleSettings((prev) => ({ ...prev, saleCompleted: true }));
    } catch (error) {
      updateModal((prev) => ({
        ...prev,
        step: EMarketContractSteps.REJECTED_CONFIRMATION,
        loading: false,
        error: error.message,
      }));
      setOpen(true);
    }
  }, [sale]);

  useEffect(() => {
    if (formik.values.timePeriod !== 1) {
      setIsImmediatly(false);
    } else {
      setIsImmediatly(true);
      formik.setFieldValue('timeUnit', 1);
    }
  }, [formik.values.timePeriod]);

  return (
    <form noValidate onSubmit={formik.handleSubmit} id="myForm">
      <Grid container display="flex" flexDirection="column" justifyContent="space-between" minHeight="500px">
        <Grid container spacing={2}>
          <Grid item xs={6} mt={1}>
            <TextField
              id="timePeriod"
              name="timePeriod"
              size="small"
              label="Transaction delay"
              value={formik.values.timePeriod}
              onChange={formik.handleChange}
              className={classes.input}
              select
            >
              {marketSalePeriodOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} mt={1}>
            <TextField
              label="Time unit"
              id="timeUnit"
              name="timeUnit"
              size="small"
              value={formik.values.timeUnit}
              helperText={linkedHelperText('timeUnit', 'timeUnit')}
              error={!!(formik.touched.timeUnit && formik.errors.timeUnit)}
              className={classes.input}
              disabled={isImmediatly}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12} mt={1} mb={5}>
            <TextField
              label="Installments"
              id="installments"
              name="installments"
              size="small"
              value={formik.values.installments}
              helperText={linkedHelperText('installments', 'installments')}
              error={!!(formik.touched.installments && formik.errors.installments)}
              className={classes.input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={2}>
          {modal.step === EMarketContractSteps.REJECTED_CONFIRMATION && open ? (
            <Grid item xs={12} mt={5} justifyContent="center">
              <Collapse in={open}>
                <Alert severity="error" onClose={toggleCollapse} sx={{ border: 1, borderColor: 'error.main' }}>
                  Something went wrong. Please try later
                </Alert>
              </Collapse>
            </Grid>
          ) : null}
          <Grid item display="flex" xs={12} gap={2} width="100%">
            <Button
              onClick={handleBack}
              disabled={modal.loading}
              sx={{
                boxShadow: 'none',
                border: 'none',
                borderRadius: theme.spacing(1.25),
                width: '100%',
                background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {t('Back')}
            </Button>
            <LoadingButton
              loading={modal.loading}
              loadingPosition="end"
              endIcon={<></>}
              fullWidth
              onClick={handleCreateSale}
              sx={{
                background: theme.palette.primary[400],
                boxShadow: 'none',
                borderRadius: theme.spacing(1.25),
                width: '100%',
                fontWeight: 600,
                fontSize: '16px',
              }}
              size="large"
              variant="contained"
              disabled={formik.isSubmitting}
              onBlur={formik.handleBlur}
            >
              {!modal.loading ? t('Post ad') : `${contractStep}`}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
