import { ExtendedTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import Web3 from 'web3';
import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/Info';
import ReplayIcon from '@material-ui/icons/Replay';
import LoadingButton from '@material-ui/lab/LoadingButton';
import erc20Abi from 'src/abi/erc20.json';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import gtm from 'src/lib/gtm';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { getTokenData } from 'src/slices/tables/tokens';
import {
  marketSalePeriodOptions,
  marketSaleTypeOptions,
  EMarketContractSteps,
  marketContractStepOptions,
} from 'src/types/marketplace';
import { getBigNumberCurrencyLabel, uint256ToDecimalBn } from 'src/utils/bigNumber';
import { MAX_APPROVE, isBNBToken, isPrivateSale, isLockedSale } from 'src/utils/marketplace';

const useStyles = makeStyles((theme) => ({
  dataGrid: {
    padding: `0 ${theme.spacing(2)}`,
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down(900)]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  },
  previewGrid: {
    padding: `0 ${theme.spacing(2)}`,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexGrids: {
    display: 'flex',
    flexGrow: 1,
    [theme.breakpoints.down(900)]: {
      flexGrow: 0,
    },
  },
  textFieldGrids: {
    display: 'flex',
    width: '100%',
    maxWidth: '100%',
    [theme.breakpoints.down(900)]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  descriptionGrid: {
    display: 'flex',
    paddingTop: theme.spacing(0),
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenPrices: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  tokenTrade: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down(900)]: {
      alignItems: 'center',
    },
  },
  tradeData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  tradeCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: '180px',
    minWidth: '180px',
    background: theme.palette.background.default,
    borderRadius: '30px',
    '& > div > a > p': {
      fontSize: '20px',
    },
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
  arrowPositive: {
    color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
  },
  arrowNegative: {
    color: red[500],
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
  iconButton: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
      opacity: 0.5,
    },
  },
  loadingButton: {
    padding: theme.spacing(0.75, 3),
  },
  pairsDivider: {
    paddingTop: '30px',
    [theme.breakpoints.down(900)]: {
      paddingTop: 0,
    },
  },
  tagCard: {
    position: 'absolute',
    bottom: theme.spacing(-1),
    right: '40px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down(900)]: {
      bottom: theme.spacing(-1),
      right: theme.spacing(5),
    },
  },
  tradeIconGrid: {
    [theme.breakpoints.down(900)]: {
      paddingTop: theme.spacing(1),
    },
  },
  tradeIcon: {
    fontSize: '30px',
  },
  backgroundPrimary: {
    backgroundColor: theme.palette.primary.main,
  },
  backgroundGreen: {
    backgroundColor: '#259D7D',
  },
}));

export const SaleContract = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down(900));
  const { account, library } = useWeb3React();
  const { chain } = useContext(ConfigurationContext);
  const { marketContractInstance, sale, updateSale, updateSaleSettings, modal, updateModal } = useContext(
    MarketplaceContext,
  );
  const {
    sellerWallet,
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

  const [tokenPairData, setTokenPairData] = useState<{
    baseName: string;
    baseSymbol: string;
    basePrice: any;
    quoteName: string;
    quoteSymbol: string;
    quotePrice: any;
  }>(null);

  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);

  const privateSale = isPrivateSale(kind);
  const lockedSale = isLockedSale(kind);

  const mainTitle = useMemo(() => marketSaleTypeOptions.find((i) => i.key === kind)?.label, [kind]);
  const timePeriod = useMemo(() => marketSalePeriodOptions.find((i) => i.key === +lockoutPeriod)?.label, [
    lockoutPeriod,
  ]);
  const contractStep = useMemo(() => marketContractStepOptions.find((i) => i.key === modal.step)?.label, [modal.step]);

  const handleBack = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const handleViewDetails = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const approveToken = useCallback(async (tokenContract: string, amount: string): Promise<void> => {
    const web3 = new Web3(library?.provider);
    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenContract);

    const allowance = await erc20ContractInstance.methods
      .allowance(account, chain.bsc.products.marketplace)
      .call({ from: account });

    const amountFromWei = Web3.utils.fromWei(amount, 'ether');
    const allowanceFromWei = Web3.utils.fromWei(allowance, 'ether');

    const amountBn = uint256ToDecimalBn(amountFromWei);
    const allowanceBn = uint256ToDecimalBn(allowanceFromWei);

    if (allowanceBn.isZero()) {
      await erc20ContractInstance.methods.approve(chain.bsc.products.marketplace, MAX_APPROVE).send({ from: account });
    } else if (allowanceBn.isLessThan(amountBn)) {
      await erc20ContractInstance.methods
        .increaseAllowance(chain.bsc.products.marketplace, MAX_APPROVE)
        .send({ from: account });
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

      const weiAmountBase = Web3.utils.toWei(new BigNumber(amountBase).toString(), 'ether');
      const weiAmountQuote = Web3.utils.toWei(new BigNumber(amountQuote).toString(), 'ether');

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
    } catch (error) {
      updateModal((prev) => ({
        ...prev,
        step: EMarketContractSteps.REJECTED_CONFIRMATION,
        loading: false,
        error: error.message,
      }));
    }
  }, [sale]);

  const getTokenPairData = async () => {
    const [base, quote] = await Promise.all([
      getTokenData(tokenBase.address, chain),
      getTokenData(tokenQuote.address, chain),
    ]);
    setTokenPairData({
      baseName: base?.name,
      baseSymbol: isBNBToken(tokenBase.address) ? 'BNB' : base?.symbol,
      basePrice: base?.price_usd,
      quoteName: quote?.name,
      quoteSymbol: isBNBToken(tokenQuote.address) ? 'BNB' : quote?.symbol,
      quotePrice: quote?.price_usd,
    });
  };

  useEffect(() => {
    getTokenPairData();
  }, []);

  const ratio = useMemo(() => getBigNumberCurrencyLabel(amountQuote / amountBase, false, 9), [amountQuote, amountBase]);

  useEffect(() => {
    if (tokenPairData?.basePrice && tokenPairData?.quotePrice) {
      const depositValue = new BigNumber(tokenPairData.basePrice).multipliedBy(amountBase);
      const returnValue = new BigNumber(tokenPairData.quotePrice).multipliedBy(amountQuote);
      const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);

      setVariationPercentage(percentage);
    }
  }, [tokenPairData]);

  return (
    <Grid container display="flex" justifyContent="space-between">
      <Grid item xs={12} pt={2} className={classes.descriptionGrid}>
        <Typography fontWeight={700} fontSize={18}>
          {`${mainTitle}`}
        </Typography>
      </Grid>
      <Grid container className={classes.dataGrid}>
        <Grid item xs={12} sm={privateSale ? 6 : 12} pb={2} pr={privateSale ? 1 : 0} className={classes.textFieldGrids}>
          <TextField
            className={classes.myWallet}
            fullWidth
            size="small"
            margin="dense"
            variant="outlined"
            id="sellerWallet"
            name="sellerWallet"
            label={t('My Wallet')}
            value={sellerWallet}
            disabled
            InputProps={{ endAdornment: <IconCopyToClipboard text={sellerWallet} isNestedButton /> }}
          />
        </Grid>
        {privateSale ? (
          <Grid item xs={12} sm={6} pb={2} pl={1} className={classes.textFieldGrids}>
            <TextField
              className={classes.myWallet}
              fullWidth
              size="small"
              margin="dense"
              variant="outlined"
              id="buyerWallet"
              name="buyerWallet"
              label={t('Buyer Wallet')}
              value={buyerWallet}
              disabled
              InputProps={{ endAdornment: <IconCopyToClipboard text={buyerWallet} isNestedButton /> }}
            />
          </Grid>
        ) : null}
      </Grid>
      <Grid container className={classes.previewGrid}>
        <Grid item className={classes.flexGrids}>
          <Grid
            display="flex"
            flexDirection={!isMobile ? 'row' : 'column'}
            justifyContent="center"
            alignItems={isMobile ? 'center' : null}
            gap={1}
          >
            <Grid item display="flex" flexDirection="column" justifyContent="center" position="relative">
              <Card className={classes.tradeCard}>
                <AvatarThumbnail address={tokenBase.address} alt={tokenPairData?.baseSymbol} size="large" />
                <Box>
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                    <Typography fontWeight={700}>{tokenPairData?.baseSymbol || tokenBase.symbol}</Typography>
                    <Tooltip
                      className={classes.tooltip}
                      classes={{ popper: classes.tooltipPopper }}
                      enterTouchDelay={0}
                      title={
                        <Typography color="inherit" whiteSpace="nowrap">
                          {`${tokenPairData?.baseSymbol || tokenBase.symbol} Market Price: $${
                            tokenPairData?.basePrice ? getBigNumberCurrencyLabel(tokenPairData.basePrice, false, 4) : 0
                          }`}
                          {isBNBToken(tokenBase.address) ? null : (
                            <>
                              <br />
                              {`${tokenPairData?.baseSymbol || tokenBase.symbol} Contract: ${tokenBase.address}`}
                            </>
                          )}
                        </Typography>
                      }
                    >
                      <InfoIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Box>
                  <Typography fontWeight={700}>{getBigNumberCurrencyLabel(amountBase, false, 7)}</Typography>
                </Box>
              </Card>
              <Card className={clsx(classes.tagCard, classes.backgroundPrimary)}>
                <Typography fontWeight={700} fontSize="0.75rem" letterSpacing="2px">
                  {t('DEPOSIT')}
                </Typography>
              </Card>
            </Grid>
            <Grid className={classes.tradeIconGrid} item display="flex" flexDirection="column" justifyContent="center">
              <ReplayIcon
                className={classes.tradeIcon}
                htmlColor={((theme as unknown) as ExtendedTheme).eulerActionGreen}
              />
            </Grid>
            <Grid item display="flex" flexDirection="column" justifyContent="center" position="relative">
              <Card className={classes.tradeCard}>
                <AvatarThumbnail address={tokenQuote.address} alt={tokenPairData?.quoteSymbol} size="large" />
                <Box>
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                    <Typography fontWeight={700}>{tokenPairData?.quoteSymbol || tokenQuote.symbol}</Typography>
                    <Tooltip
                      className={classes.tooltip}
                      classes={{ popper: classes.tooltipPopper }}
                      enterTouchDelay={0}
                      title={
                        <Typography color="inherit">
                          {`${tokenPairData?.quoteSymbol || tokenQuote.symbol} Market Price : $${
                            tokenPairData?.quotePrice
                              ? getBigNumberCurrencyLabel(tokenPairData.quotePrice, false, 4)
                              : 0
                          }`}
                          {isBNBToken(tokenQuote.address) ? null : (
                            <>
                              <br />
                              {`${tokenPairData?.quoteSymbol || tokenQuote.symbol} Contract: ${tokenQuote.address}`}
                            </>
                          )}
                        </Typography>
                      }
                    >
                      <InfoIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Box>
                  <Typography fontWeight={700}>{getBigNumberCurrencyLabel(amountQuote, false, 7)}</Typography>
                </Box>
              </Card>
              <Card className={clsx(classes.tagCard, classes.backgroundGreen)}>
                <Typography fontWeight={700} fontSize="0.75rem" letterSpacing="2px">
                  {t('RETURN')}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {lockedSale ? (
          <Grid item className={classes.tokenTrade}>
            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" gap={1}>
              <Box className={classes.tokenPrices}>
                <Typography fontWeight={700}>
                  {sale
                    ? `1 PACKAGE EVERY ${
                        lockoutPeriodUnits > 1
                          ? `${lockoutPeriodUnits} ${timePeriod?.toUpperCase()}S`
                          : `${timePeriod?.toUpperCase()}`
                      }`
                    : 'N/A'}
                </Typography>
              </Box>
              <Box className={classes.tokenPrices}>
                <Typography fontWeight={700}>
                  {numberPackages > 1 ? `${numberPackages} PACKAGES TOTAL` : `${numberPackages} PACKAGE TOTAL`}
                </Typography>
              </Box>
              <Box className={classes.tokenPrices}>
                <Typography fontWeight={700}>
                  {`${getBigNumberCurrencyLabel(amountBase / numberPackages, false, 7)} ${
                    tokenBase.symbol
                  } PER PACKAGE`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ) : null}
        <Grid item display="flex">
          <Box className={classes.tradeData} alignItems="center">
            <Typography fontWeight={700}>
              {`1 ${tokenPairData?.baseSymbol || tokenBase.symbol} = ${ratio} ${
                tokenPairData?.quoteSymbol || tokenQuote.symbol
              }`}
            </Typography>
            {variationPercentage ? (
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
                    ${tokenPairData?.baseSymbol || tokenBase.symbol} for ${
                        tokenPairData?.quoteSymbol || tokenQuote.symbol
                      } results in a
                    ${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}% 
                    ${variationPercentage.isLessThanOrEqualTo(0) ? 'loss' : 'profit'}.`}
                    </Typography>
                  }
                >
                  <InfoIcon className={classes.infoIcon} />
                </Tooltip>
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      <Grid container mt={1} display="flex" flexDirection="column" alignItems="center">
        <Grid item mb={1} width="100%">
          <Divider orientation="horizontal" flexItem />
        </Grid>
        <Grid item mt={1} display="flex" gap={2}>
          {!(modal.step === EMarketContractSteps.CONFIRMED) ? (
            <Button variant="outlined" size="large" onClick={handleBack} disabled={modal.loading}>
              {t('BACK')}
            </Button>
          ) : null}
          {modal.step === EMarketContractSteps.CONFIRMED ? (
            <Button color="primary" variant="contained" size="large" onClick={handleViewDetails}>
              {t('VIEW DETAILS')}
            </Button>
          ) : (
            <LoadingButton
              loading={modal.loading}
              loadingPosition="end"
              endIcon={<></>}
              fullWidth
              onClick={handleCreateSale}
              className={classes.loadingButton}
              color="primary"
              size="large"
              variant="contained"
            >
              {!modal.loading ? t('CREATE SALE') : `${contractStep}`}
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
