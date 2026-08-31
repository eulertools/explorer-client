import { ExtendedTheme, EulerIconInfoCircle } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import _debounce from 'lodash/debounce';
import Web3 from 'web3';
import * as Yup from 'yup';
import { useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ContentPasteIcon from '@material-ui/icons/ContentPaste';
import erc20Abi from 'src/abi/erc20.json';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { SaleTokenSelectorV2 } from 'src/pages/marketplace/components/Sale/SaleTokenSelectorV2';
import { selectAddressDetail } from 'src/selectors/address';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { MarketToken } from 'src/types/marketplace';
import { ISource } from 'src/types/search';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isPrivateSale, BNBTokenObj } from 'src/utils/marketplace';
import { isAddress } from 'src/utils/stringUtils';
import { SaleFees } from './SaleFees';

const useStyles = makeStyles((theme) => ({
  mainForm: {
    display: 'grid',
    width: '100%',
  },
  descriptionGrid: {
    display: 'flex',
    paddingTop: theme.spacing(0),
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
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
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: '246px',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: theme.spacing(1),
      boxShadow: `2px 2px 4px ${theme.palette.divider}`,
    },
  },
  tooltipArrow: {
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.background.paper,
      '&::before': {
        boxShadow: `2px 2px 4px ${theme.palette.divider}`,
      },
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
  boxContainer: {
    background: theme.palette.background.default,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  button: {
    boxShadow: 'none',
    border: 'none',
    borderRadius: theme.spacing(1),
    width: '100%',
    background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
  },
  buttonContinue: {
    boxShadow: 'none',
    borderRadius: theme.spacing(1),
    width: '100%',
  },
  inputTokenAmount: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1.5),
    textAlign: 'right',
  },
  red: {
    color: theme.palette.error.main,
  },
  orange: {
    color: theme.palette.warning.main,
  },
  grey: {
    color: theme.palette.text.secondary,
  },
  green: {
    color: theme.palette.success.main,
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

export const SaleFormV2 = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { account, library } = useWeb3React();
  const { updateSaleSettings, sale, updateSale } = useContext(MarketplaceContext);

  const [baseTokenWallet, setBaseTokenWallet] = useState<ITokenWallet>(initialTokenWallet);

  const [ratio, setRatio] = useState<BigNumber>(null);
  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);
  const [marketValue, setMarketValue] = useState<BigNumber>(null);

  const privateSale = isPrivateSale(sale.kind);

  const { tokens, loading } = useSelector((state) => state.tokens);
  const tableId = UITableID.marketplace_token_selector;
  const filters = useSelector(selectFilterState(tableId));
  const [tokenList, setTokenList] = useState([]);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [usdtToken, setUsdtToken] = useState<ISource>({} as ISource);

  const walletTokenList = useSelector(selectAddressDetail)
    .tokens.map((tkn) => {
      const token = {
        name: tkn.token._source.name,
        address: tkn.name,
        quantity: tkn.quantity,
        price: tkn.value,
        symbol: tkn.token._source.symbol,
      };
      return token;
    })
    .sort((a, b) => b.price * b.quantity - a.price * a.quantity);

  let newWalletTokenList;
  if (walletTokenList.length > 0 && (!filters.filter.query || filters.filter.query.toUpperCase().includes('BNB'))) {
    newWalletTokenList = [BNBTokenObj, ...walletTokenList];
  } else {
    newWalletTokenList = walletTokenList;
  }

  const [filteredTokenList, setFilteredTokenList] = useState(newWalletTokenList);

  const onStaticListChange = useCallback(
    _debounce((x) => {
      const tokenListFiltered = newWalletTokenList.filter(
        (tkn) => tkn.symbol.toLowerCase().includes(x.toLowerCase()) || tkn.name.toLowerCase().includes(x.toLowerCase()),
      );
      setFilteredTokenList(tokenListFiltered);
    }, 500),
    [],
  );

  const setFilterQuery = useCallback((query: string) => {
    dispatch(
      setFilterValue(tableId, {
        filterName: 'query',
        filterValue: query,
      }),
    );
  }, []);

  const onDynamicListChange = useCallback(
    _debounce((x) => {
      setFilterQuery(x);
    }, 500),
    [],
  );

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
        'Deposit token can not be the same as return.',
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
        'Return token can not be the same as deposit.',
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
      .max(+baseTokenWallet?.balance || 0.000000000000000002, 'Amount is higher than the available.')
      .required('Deposit Amount is required')
      .typeError('Amount should be a number.'),
    amountQuote: Yup.number()
      .positive('Amount should be a positive number.')
      .required('Return Amount is required')
      .typeError('Amount should be a number.'),
    isPrivate: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    updateSale((prevState) => {
      const newObj: MarketToken = {
        ...prevState,
        tokenBase: values.tokenBase,
        tokenQuote: values.tokenQuote,
        amountBase: values.amountBase,
        amountQuote: values.amountQuote,
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
    enableReinitialize: false,
    initialValues: {
      myWallet: account,
      buyerWallet: '',
      tokenBase: walletTokenList[0],
      amountBase: '',
      tokenQuote: tokenList.find((tkn) => tkn.symbol === 'USDT') || {},
      amountQuote: '',
      isPrivate: privateSale,
    },
    onSubmit: handleSubmit,
    validateOnBlur: false,
  });

  useEffect(() => {
    const token = tokenList.find((tkn) => tkn.symbol === 'USDT');
    if (token && firstLoading) {
      setUsdtToken(token);
      formik.setFieldValue('tokenQuote', token);
      setFirstLoading(false);
    }
  }, [tokenList, sale]);

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

  useEffect(() => {
    getBaseTokenBalance();
    if (formik.values.tokenBase === '') {
      setFilteredTokenList(newWalletTokenList);
    }
  }, [formik.values.tokenBase]);

  useEffect(() => {
    const basePrice = formik.values.tokenBase.price;
    const baseAmount = formik.values.amountBase;
    const quotePrice = formik.values.tokenQuote.price;
    const quoteAmount = formik.values.amountQuote;

    if (basePrice && quotePrice && baseAmount) {
      const calcMarketValue = new BigNumber(basePrice)
        .multipliedBy(new BigNumber(baseAmount))
        .dividedBy(new BigNumber(quotePrice));
      setMarketValue(calcMarketValue);
    } else setMarketValue(null);

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

  useEffect(() => {
    if (!loading && tokens) {
      let newtokenList;
      if (tokens.length > 0 && (!filters.filter.query || filters.filter.query.toUpperCase().includes('BNB'))) {
        newtokenList = [BNBTokenObj, ...tokens];
      } else {
        newtokenList = tokens;
      }
      setTokenList(newtokenList.map((tn) => ({ ...tn, price: tn.price_usd })));
    }
  }, [tokens, loading]);

  const getColorClass = () => {
    if (variationPercentage.decimalPlaces(2).isLessThanOrEqualTo(-10)) {
      return classes.red;
    }
    if (variationPercentage.decimalPlaces(2).isLessThan(-5)) {
      return classes.orange;
    }
    if (variationPercentage.decimalPlaces(2).isLessThan(0)) {
      return classes.grey;
    }
    return classes.green;
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit} id="myForm" className={classes.mainForm}>
      <Grid container display="flex" flexDirection="column" justifyContent="space-between" minHeight="340px">
        {privateSale ? (
          <TextField
            fullWidth
            size="small"
            margin="none"
            id="buyerWallet"
            name="buyerWallet"
            variant="outlined"
            label={t('Taker wallet address')}
            placeholder="0x..."
            value={formik.values.buyerWallet}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!(formik.touched.buyerWallet && formik.errors.buyerWallet)}
            helperText={linkedHelperText('buyerWallet', 'myWallet')}
            InputProps={{ endAdornment: <ContentPasteIcon /> }}
            sx={{ paddingBottom: theme.spacing(1) }}
          />
        ) : null}

        <Box>
          <Box className={classes.boxContainer}>
            <Grid container display="flex" justifyContent="space-between">
              <InputLabel shrink sx={{ color: 'terciary.700' }}>
                You Send
              </InputLabel>
              <InputLabel shrink sx={{ transformOrigin: 'top right', color: 'terciary.700' }}>
                Balance:{' '}
                <>
                  {baseTokenWallet?.balance && !baseTokenWallet.loading
                    ? getBigNumberCurrencyLabel(baseTokenWallet.balance)
                    : '--'}
                </>
              </InputLabel>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <SaleTokenSelectorV2
                  formik={formik}
                  fieldValue="tokenBase"
                  linkedField="amountBase"
                  helperText={linkedHelperText('tokenBase', 'amountBase')}
                  tokenList={filteredTokenList}
                  onNameChange={onStaticListChange}
                  initialValue={walletTokenList[0]}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  id="amountBase"
                  name="amountBase"
                  variant="outlined"
                  placeholder={t('Amount')}
                  value={formik.values.amountBase}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.amountBase && formik.errors.amountBase)}
                  helperText={linkedHelperText('amountBase', 'tokenBase')}
                  disabled={baseTokenWallet.loading}
                  className={classes.inputTokenAmount}
                  sx={{
                    input: { textAlign: 'end', fontWeight: 500, color: 'neutral.900' },
                    marginTop: '0px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.spacing(1.5),
                    },
                    '& .MuiFormHelperText-root': {
                      margin: theme.spacing(0),
                      fontSize: '11px',
                      textAlign: 'left',
                      background: theme.palette.background.default,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container display="flex" justifyContent="space-between">
              <InputLabel shrink sx={{ color: 'terciary.700' }}>
                {formik.values.tokenBase.name}
              </InputLabel>
              <InputLabel shrink sx={{ transformOrigin: 'top right', color: 'terciary.700' }}>
                {formik.values.tokenBase.price ? `~ $${getBigNumberCurrencyLabel(formik.values.tokenBase.price)}` : ' '}
              </InputLabel>
            </Grid>
          </Box>

          <Box className={classes.boxContainer} mt={2}>
            <Grid container display="flex" justifyContent="space-between">
              <InputLabel shrink sx={{ color: 'terciary.700' }}>
                You Get
              </InputLabel>
              <InputLabel sx={{ '& button': { p: 0 } }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    formik.setFieldValue('amountQuote', marketValue);
                  }}
                  sx={{ color: 'primary.400', fontWeight: 600 }}
                  disabled={!marketValue}
                >
                  Set to market
                </Button>
              </InputLabel>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <SaleTokenSelectorV2
                  formik={formik}
                  fieldValue="tokenQuote"
                  linkedField="amountQuote"
                  helperText={linkedHelperText('tokenQuote', 'amountQuote')}
                  tokenList={tokenList}
                  onNameChange={onDynamicListChange}
                  initialValue={usdtToken}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  id="amountQuote"
                  name="amountQuote"
                  variant="outlined"
                  placeholder={t('Amount')}
                  value={formik.values.amountQuote}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.amountQuote && formik.errors.amountQuote)}
                  helperText={linkedHelperText('amountQuote', 'tokenQuote')}
                  className={classes.inputTokenAmount}
                  sx={{
                    input: { textAlign: 'end', fontWeight: 500, color: 'neutral.900' },
                    marginTop: '0px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.spacing(1.5),
                    },
                    '& .MuiFormHelperText-root': {
                      margin: theme.spacing(0),
                      fontSize: '11px',
                      textAlign: 'left',
                      background: theme.palette.background.default,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container display="flex" justifyContent="space-between">
              <InputLabel shrink sx={{ color: 'terciary.700' }}>
                {formik.values.tokenQuote.name}
              </InputLabel>
              <InputLabel shrink sx={{ transformOrigin: 'top right', color: 'terciary.700' }}>
                {formik.values.tokenQuote.price
                  ? `~ $${getBigNumberCurrencyLabel(formik.values.tokenQuote.price)}`
                  : ' '}
              </InputLabel>
            </Grid>
          </Box>
        </Box>

        {ratio?.isGreaterThan(0) && variationPercentage ? (
          <>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography fontWeight={600} fontSize={11} color="terciary.700">
                Rate
              </Typography>
              <Typography fontWeight={500} fontSize={11} color="neutral.500">
                {`1 ${formik.values.tokenBase.symbol} = ${getBigNumberCurrencyLabel(ratio, false, 7)} ${
                  formik.values.tokenQuote.symbol
                }`}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box display="flex">
                <Typography fontWeight={600} fontSize={11} color="terciary.700">
                  {`${formik.values.tokenBase.symbol} per ${formik.values.tokenQuote.symbol}`}
                </Typography>
                <Tooltip
                  classes={{ tooltipArrow: classes.tooltipArrow, popper: classes.tooltipPopper }}
                  enterTouchDelay={0}
                  title={
                    <Typography fontSize={11} fontWeight={500} color="neutral.500">
                      Percent deviation from market value. You can set the market rate by cliking ‘Set to market’
                    </Typography>
                  }
                  placement="top"
                  sx={{
                    fontSize: 'small',
                  }}
                  arrow
                >
                  <Box sx={{ transform: 'rotate(180deg)', marginLeft: theme.spacing(0.5), maxHeight: '15px' }}>
                    <EulerIconInfoCircle size="s" colorLight="terciary-400" />
                  </Box>
                </Tooltip>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                <Typography fontWeight={700} fontSize={13} color="neutral.500" marginRight={1}>
                  {`~ $${getBigNumberCurrencyLabel(formik.values.tokenBase.price)}`}
                </Typography>
                <Box display="flex">
                  <Typography variant="subtitle1" fontWeight={700} fontSize={13} className={getColorClass()}>
                    {`${getBigNumberCurrencyLabel(variationPercentage.decimalPlaces(2), false, 2)}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <SaleFees />
          </>
        ) : null}
        <Grid container mt={1} display="flex" flexDirection="column" alignItems="center">
          <Grid item mt={1} display="flex" gap={2} width="100%">
            <Button
              onClick={handleBack}
              sx={{
                boxShadow: 'none',
                border: 'none',
                borderRadius: theme.spacing(1.25),
                width: '100%',
                background: theme.palette.primary[50],
                color: theme.palette.primary[400],
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {t('Back')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting || !variationPercentage}
              sx={{
                background: theme.palette.primary[400],
                boxShadow: 'none',
                borderRadius: theme.spacing(1.25),
                width: '100%',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {t('Continue')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
