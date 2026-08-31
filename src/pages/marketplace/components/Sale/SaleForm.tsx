import { ExtendedTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import Web3 from 'web3';
import * as Yup from 'yup';
import { useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/Info';
import erc20Abi from 'src/abi/erc20.json';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { SaleTokenSelector } from 'src/pages/marketplace/components/Sale/SaleTokenSelector';
import { marketSalePeriodOptions, MarketToken } from 'src/types/marketplace';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isPrivateSale, isLockedSale, isBNBToken } from 'src/utils/marketplace';
import { isAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainForm: {
    display: 'grid',
    gap: theme.spacing(2),
    width: '100%',
  },
  descriptionGrid: {
    display: 'flex',
    paddingTop: theme.spacing(0),
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  formGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    [theme.breakpoints.down(1100)]: {
      flexDirection: 'column',
    },
  },
  lockedFormGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    [theme.breakpoints.down(1100)]: {
      flexDirection: 'column',
      minWidth: '100%',
    },
  },
  description: {
    display: 'flex',
    fontWeight: 700,
  },
  tooltip: {
    marginLeft: theme.spacing(1),
  },
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
      backgroundColor: 'rgba(51, 103, 249, 95)',
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: '50px',
    },
  },
  infoIcon: {
    '&:hover': {
      color: 'rgba(51, 103, 249, 95)',
    },
  },
  myWallet: {
    '& > label': {
      color: `${theme.palette.primary.main} !important`,
    },
    '& > div > input': {
      WebkitTextFillColor: `${theme.palette.primary.main} !important`,
    },
    '& > div > fieldset': {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  tooltipText: {
    position: 'absolute',
    right: 0,
    top: theme.spacing(-2),
  },
  tooltipTextLeft: {
    position: 'absolute',
    left: 0,
    top: theme.spacing(-2),
  },
  arrowPositive: {
    color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
  },
  arrowNegative: {
    color: red[500],
  },
}));

interface ITokenWallet {
  balance: string;
  loading: boolean;
}

const initialTokenWallet = {
  balance: null,
  loading: false,
};

export const SaleForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const { updateSaleSettings, sale, updateSale } = useContext(MarketplaceContext);

  const [baseTokenWallet, setBaseTokenWallet] = useState<ITokenWallet>(initialTokenWallet);
  const [quoteTokenWallet, setQuoteTokenWallet] = useState<ITokenWallet>(initialTokenWallet);

  const [ratio, setRatio] = useState<BigNumber>(null);
  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);

  const privateSale = isPrivateSale(sale.kind);
  const lockedSale = isLockedSale(sale.kind);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800));
  const isSmallModal = useMediaQuery(theme.breakpoints.between(1100, 1350));

  const validationSchema = Yup.object().shape({
    myWallet: Yup.string()
      .test('len', 'Input a valid Wallet Address.', (value) => isAddress(value))
      .required('Wallet is required.'),
    buyerWallet: Yup.string()
      .test('validAddress', 'Input a valid Wallet Address.', (value) => {
        if (privateSale) {
          return isAddress(value);
        }
        return true;
      })
      .test(
        'sameValue',
        'Buyer Wallet cannot be the same as your Wallet.',
        // Need to use function() to be able to access {this.parent}
        // eslint-disable-next-line func-names
        function (value) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { myWallet, isPrivate } = this.parent;
          if (value === myWallet && isPrivate) {
            return false;
          }
          return true;
        },
      )
      .when('isPrivate', {
        is: true,
        then: Yup.string().required('Buyer Wallet is required.'),
      }),
    tokenBase: Yup.object()
      .test('len', 'Input a valid Token Address.', (value) => isAddress(value.address) || isAddress(value.symbol))
      .test(
        'sameToken',
        'Deposit Token cannot be the same as Return.',
        // Need to use function() to be able to access {this.parent}
        // eslint-disable-next-line func-names
        function (value) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { tokenQuote } = this.parent;
          if (value.address === tokenQuote.address) {
            return false;
          }
          return true;
        },
      )
      .required('Deposit Token is required.'),
    tokenQuote: Yup.object()
      .test('len', 'Input a valid Token Address.', (value) => isAddress(value.address) || isAddress(value.symbol))
      .test(
        'sameToken',
        'Return Token cannot be the same as Deposit.',
        // Need to use function() to be able to access {this.parent}
        // eslint-disable-next-line func-names
        function (value) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { tokenBase } = this.parent;
          if (value.address === tokenBase.address) {
            return false;
          }
          return true;
        },
      )
      .required('Deposit Token is required.'),
    amountBase: Yup.number()
      .positive('Amount should be a positive number.')
      .min(0.000000000000000001, 'Minimum is set to 1 Wei.')
      .max(+baseTokenWallet?.balance || 0.00000000000000002, 'Amount is higher than the available.')
      .required('Deposit Amount is required')
      .typeError('Amount should be a number.'),
    amountQuote: Yup.number()
      .positive('Amount should be a positive number.')
      .required('Return Amount is required')
      .typeError('Amount should be a number.'),
    period: Yup.number().when('isLocked', {
      is: true,
      then: Yup.number().positive('Time Period should be a positive number.').required('Time Period is required.'),
    }),
    amountPeriod: Yup.number().when('isLocked', {
      is: true,
      then: Yup.number()
        .positive('Time Unit should be a positive number.')
        .test('isInteger', 'Time Unit should be an integer.', (value) => Number.isInteger(value))
        .required('Time Unit is required.')
        .typeError('Time Unit should be a number.'),
    }),
    package: Yup.number().when('isLocked', {
      is: true,
      then: Yup.number()
        .positive('Package should be a positive number.')
        .test('isInteger', 'Package should be an integer.', (value) => Number.isInteger(value))
        .required('Package is required.')
        .typeError('Package should be a number.'),
    }),
    isPrivate: Yup.boolean(),
    isLocked: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    updateSale((prevState) => {
      const newObj: MarketToken = {
        ...prevState,
        tokenBase: values.tokenBase,
        tokenQuote: values.tokenQuote,
        amountBase: values.amountBase,
        amountQuote: values.amountQuote,
        lockoutPeriod: values.period,
        lockoutPeriodUnits: values.amountPeriod,
        numberPackages: values.package,
        kind: sale.kind,
        sellerWallet: values.myWallet,
        buyerWallet: values.buyerWallet,
      };
      return newObj;
    });
    updateSaleSettings((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      myWallet: account,
      buyerWallet: '',
      period: lockedSale ? 2_592_000 : 0,
      amountPeriod: lockedSale ? 1 : 0,
      package: lockedSale ? 1 : 0,
      tokenBase: {
        key: '',
        symbol: '',
        address: '',
        price: '',
      },
      amountBase: '',
      tokenQuote: {
        key: '',
        symbol: '',
        address: '',
        price: '',
      },
      amountQuote: '',
      isPrivate: privateSale,
      isLocked: lockedSale,
    },
    onSubmit: handleSubmit,
    validateOnBlur: false,
  });

  const timePeriod = useMemo(() => marketSalePeriodOptions.find((i) => i.key === formik.values.period)?.label, [
    formik.values.period,
  ]);

  /**
   * Fix padding issue for Material UI in cases where a field
   * has an error and their linked field doesn't.
   */
  const linkedHelperText = useMemo(
    () => (baseField: string, quoteField: string) => {
      if (formik.touched[baseField] && formik.errors[baseField]) {
        return formik.errors[baseField].toString();
      }
      if (formik.touched[quoteField] && formik.errors[quoteField]) {
        return ' ';
      }
      return '';
    },
    [formik],
  );

  const getBaseTokenBalance = useCallback(async () => {
    try {
      if (!isAddress(formik.values.tokenBase.address)) {
        setBaseTokenWallet(initialTokenWallet);
      }
      const web3 = new Web3(library?.provider);
      if (formik.values.tokenBase.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        setBaseTokenWallet((prevState) => ({
          balance: prevState.balance,
          loading: true,
        }));

        const response = await web3.eth.getBalance(account);

        setBaseTokenWallet({
          balance: Web3.utils.fromWei(response),
          loading: false,
        });
      } else if (formik.values.tokenBase.address !== '') {
        setBaseTokenWallet((prevState) => ({
          balance: prevState.balance,
          loading: true,
        }));

        const contractInstance = new web3.eth.Contract(erc20Abi.abi as any, formik.values.tokenBase.address);
        const response = await contractInstance?.methods.balanceOf(account).call({ from: account });

        setBaseTokenWallet({
          balance: Web3.utils.fromWei(response),
          loading: false,
        });
      }
    } catch (error) {
      formik.setFieldError('tokenBase', 'Failed to obtain Token Balance.');
    }
  }, [formik.values.tokenBase]);

  const getQuoteTokenBalance = useCallback(async () => {
    try {
      if (!isAddress(formik.values.tokenQuote.address)) {
        setQuoteTokenWallet(initialTokenWallet);
      }
      const web3 = new Web3(library?.provider);
      if (formik.values.tokenQuote.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        setQuoteTokenWallet((prevState) => ({
          balance: prevState.balance,
          loading: true,
        }));

        const response = await web3.eth.getBalance(account);

        setQuoteTokenWallet({
          balance: Web3.utils.fromWei(response),
          loading: false,
        });
      } else if (formik.values.tokenQuote.address !== '') {
        setQuoteTokenWallet((prevState) => ({
          balance: prevState.balance,
          loading: true,
        }));

        const contractInstance = new web3.eth.Contract(erc20Abi.abi as any, formik.values.tokenQuote.address);
        const response = await contractInstance?.methods.balanceOf(account).call({ from: account });

        setQuoteTokenWallet({
          balance: Web3.utils.fromWei(response),
          loading: false,
        });
      }
    } catch (error) {
      // Shallow Error
    }
  }, [formik.values.tokenQuote]);

  useEffect(() => {
    getBaseTokenBalance();
  }, [formik.values.tokenBase]);

  useEffect(() => {
    getQuoteTokenBalance();
  }, [formik.values.tokenQuote]);

  useEffect(() => {
    const basePrice = formik.values.tokenBase.price;
    const baseAmount = formik.values.amountBase;
    const quotePrice = formik.values.tokenQuote.price;
    const quoteAmount = formik.values.amountQuote;
    if (basePrice && quotePrice && baseAmount && quoteAmount) {
      const depositValue = new BigNumber(basePrice).multipliedBy(baseAmount);
      const returnValue = new BigNumber(quotePrice).multipliedBy(quoteAmount);
      const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);
      const calcRatio = new BigNumber(quoteAmount).dividedBy(baseAmount);

      setVariationPercentage(percentage);
      setRatio(calcRatio);
    } else {
      setVariationPercentage(null);
      setRatio(null);
    }
  }, [formik.values]);

  return (
    <Grid container display="flex" justifyContent="space-between">
      <form noValidate onSubmit={formik.handleSubmit} id="myForm" className={classes.mainForm}>
        <Grid item xs={12} className={classes.formGrid}>
          <TextField
            className={classes.myWallet}
            fullWidth
            size="small"
            margin="dense"
            id="myWallet"
            name="myWallet"
            variant="outlined"
            label={t('My Wallet')}
            value={formik.values.myWallet}
            helperText={linkedHelperText('myWallet', 'buyerWallet')}
            disabled
            InputProps={{ endAdornment: <IconCopyToClipboard text={formik.values.myWallet} isNestedButton /> }}
          />
          {privateSale ? (
            <TextField
              fullWidth
              size="small"
              margin="dense"
              id="buyerWallet"
              name="buyerWallet"
              variant="outlined"
              label={t('Buyer Wallet')}
              value={formik.values.buyerWallet}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.buyerWallet && formik.errors.buyerWallet)}
              helperText={linkedHelperText('buyerWallet', 'myWallet')}
              InputProps={{ endAdornment: <IconCopyToClipboard text={formik.values.buyerWallet} isNestedButton /> }}
            />
          ) : null}
        </Grid>
        {lockedSale ? (
          <Grid item xs={12} mt={1} className={classes.lockedFormGrid}>
            <Grid item xs={12} sm={6} className={classes.lockedFormGrid}>
              <TextField
                fullWidth
                select
                size="small"
                margin="dense"
                id="period"
                name="period"
                variant="outlined"
                label={t('Time Period')}
                value={formik.values.period}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.period && formik.errors.period)}
                helperText={linkedHelperText('period', 'package')}
              >
                {marketSalePeriodOptions.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                id="amountPeriod"
                name="amountPeriod"
                variant="outlined"
                label={t('Time Unit')}
                value={formik.values.amountPeriod}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.amountPeriod && formik.errors.amountPeriod)}
                helperText={formik.errors.amountPeriod ? formik.errors.amountPeriod.toString() : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.lockedFormGrid}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                id="package"
                name="package"
                variant="outlined"
                label={t('Packages')}
                value={formik.values.package}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.package && formik.errors.package)}
                helperText={linkedHelperText('package', 'period')}
                InputProps={{
                  endAdornment: (
                    <Tooltip
                      className={classes.tooltip}
                      classes={{ popper: classes.tooltipPopper }}
                      enterTouchDelay={0}
                      title={
                        <Typography color="inherit">
                          {`Select the number of packages 
                          for the Sale to be split into
                          and delivered to the buyer every 
                          ${
                            formik.values.amountPeriod > 1
                              ? `${formik.values.amountPeriod} ${timePeriod}s`
                              : `${timePeriod}`
                          }`}
                        </Typography>
                      }
                    >
                      <InfoIcon className={classes.infoIcon} />
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
          </Grid>
        ) : null}
        <Grid item xs={12} mt={1} className={classes.formGrid}>
          <Box width="100%" position="relative">
            {formik.values?.tokenBase?.address && !isBNBToken(formik.values?.tokenBase?.address) ? (
              <Box className={classes.tooltipText} mr={1}>
                <EulerAddress
                  address={formik.values?.tokenBase?.address}
                  addressRender={
                    isSmallScreen || isSmallModal
                      ? EulerAddressRenderTypes.truncate_center
                      : EulerAddressRenderTypes.truncate_right
                  }
                  showSeeDetailLink={false}
                  hashColor={theme.palette.text.primary}
                  hashIconColor={theme.palette.primary.main}
                />
              </Box>
            ) : null}
            <SaleTokenSelector
              formik={formik}
              fieldValue="tokenBase"
              linkedField="amountBase"
              label="Deposit Token"
              helperText={linkedHelperText('tokenBase', 'amountBase')}
            />
          </Box>
          <Box width="100%" position="relative">
            {baseTokenWallet?.balance ? (
              <Typography className={classes.tooltipText} variant="subtitle2" mr={1}>
                Balance: {!baseTokenWallet.loading ? baseTokenWallet.balance : '--'}
              </Typography>
            ) : null}
            {formik.values.tokenBase.price ? (
              <Typography className={classes.tooltipTextLeft} variant="subtitle2" ml={1}>
                Price: ${formik.values.tokenBase.price}
              </Typography>
            ) : null}
            <TextField
              fullWidth
              size="small"
              margin="dense"
              id="amountBase"
              name="amountBase"
              variant="outlined"
              label={t('Deposit Amount')}
              value={formik.values.amountBase}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.amountBase && formik.errors.amountBase)}
              helperText={linkedHelperText('amountBase', 'tokenBase')}
              disabled={baseTokenWallet.loading}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => {
                      formik.setFieldValue('amountBase', baseTokenWallet?.balance);
                      formik.setFieldTouched('amountBase', true, false);
                    }}
                    size="small"
                    color="primary"
                    disabled={!baseTokenWallet?.balance || baseTokenWallet?.loading}
                  >
                    MAX
                  </Button>
                ),
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} mt={1} className={classes.formGrid}>
          <Box width="100%" position="relative">
            {formik.values?.tokenQuote?.address && !isBNBToken(formik.values?.tokenQuote?.address) ? (
              <Box className={classes.tooltipText} mr={1}>
                <EulerAddress
                  address={formik.values?.tokenQuote?.address}
                  addressRender={
                    isSmallScreen || isSmallModal
                      ? EulerAddressRenderTypes.truncate_center
                      : EulerAddressRenderTypes.truncate_right
                  }
                  showSeeDetailLink={false}
                  hashColor={theme.palette.text.primary}
                  hashIconColor={theme.palette.primary.main}
                />
              </Box>
            ) : null}
            <SaleTokenSelector
              formik={formik}
              fieldValue="tokenQuote"
              linkedField="amountQuote"
              label="Return Token"
              helperText={linkedHelperText('tokenQuote', 'amountQuote')}
            />
          </Box>
          <Box width="100%" position="relative">
            {quoteTokenWallet?.balance ? (
              <Typography className={classes.tooltipText} variant="subtitle2" mr={1}>
                Balance: {!quoteTokenWallet.loading ? quoteTokenWallet.balance : '--'}
              </Typography>
            ) : null}
            {formik.values.tokenQuote.price ? (
              <Typography className={classes.tooltipTextLeft} variant="subtitle2" ml={1}>
                Price: ${formik.values.tokenQuote.price}
              </Typography>
            ) : null}
            <TextField
              fullWidth
              size="small"
              margin="dense"
              id="amountQuote"
              name="amountQuote"
              variant="outlined"
              label={t('Return Amount')}
              value={formik.values.amountQuote}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.amountQuote && formik.errors.amountQuote)}
              helperText={linkedHelperText('amountQuote', 'tokenQuote')}
            />
          </Box>
        </Grid>
        {ratio?.isGreaterThan(0) && variationPercentage ? (
          <Grid item xs={12} className={classes.formGrid}>
            <>
              <Box display="flex">
                <Typography fontWeight={700}>
                  {`1 ${formik.values.tokenBase.symbol} = ${getBigNumberCurrencyLabel(ratio, false, 7)} ${
                    formik.values.tokenQuote.symbol
                  }`}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                {variationPercentage.isLessThanOrEqualTo(0) ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                <Typography
                  className={variationPercentage.isLessThanOrEqualTo(0) ? classes.arrowNegative : classes.arrowPositive}
                  variant="subtitle1"
                  fontWeight={700}
                  fontSize={18}
                >{`${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}%`}</Typography>
                <Tooltip
                  className={classes.tooltip}
                  classes={{ popper: classes.tooltipPopper }}
                  enterTouchDelay={0}
                  title={
                    <Typography color="inherit">
                      {`Based on current market values, swapping 
                    ${formik.values.tokenBase.symbol} for ${formik.values.tokenQuote.symbol} results in a
                    ${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}% 
                    ${variationPercentage.isLessThanOrEqualTo(0) ? 'loss' : 'profit'}.`}
                    </Typography>
                  }
                >
                  <InfoIcon className={classes.infoIcon} />
                </Tooltip>
              </Box>
            </>
          </Grid>
        ) : null}
        <Grid container mt={1} display="flex" flexDirection="column" alignItems="center">
          <Grid item mb={1} width="100%">
            <Divider orientation="horizontal" flexItem />
          </Grid>
          <Grid item mt={1} display="flex" gap={2}>
            <Button variant="outlined" onClick={handleBack}>
              {t('BACK')}
            </Button>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              {t('CONTINUE')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};
