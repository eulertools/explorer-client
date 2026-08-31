import { ExtendedTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GridCellParams } from '@material-ui/data-grid';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/Info';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { useModal } from 'src/components/modal';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useWalletConnected from 'src/hooks/useWalletConnected';
import TradeIcon from 'src/icons/svg-icons/TradeIcon';
import gtm from 'src/lib/gtm';
import { MarketplaceContext, initialPurchaseObject } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { selectMarketplace } from 'src/selectors/marketplace';
import { UITableID } from 'src/slices/filter.types';
import { getSale, setVariationPercentage } from 'src/slices/tables/marketplace';
import { getTokenData } from 'src/slices/tables/tokens';
import { useDispatch, useSelector } from 'src/store';
import { marketSaleTypeOptions, EMarketContractSteps, IMarketSource } from 'src/types/marketplace';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isBNBToken, isLockedSale } from 'src/utils/marketplace';
import { getAge, localeDate } from 'src/utils/moment';

const useStyles = makeStyles((theme) => ({
  tokenExchange: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  tokenPrices: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    [theme.breakpoints.down(900)]: {
      justifyContent: 'center',
    },
  },
  tokenTrade: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '125px',
    gap: theme.spacing(1),
  },
  buyButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  buttonText: {
    fontWeight: 700,
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    [theme.breakpoints.down(1400)]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
    },
  },
  tradeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%',
    background: theme.palette.background.default,
    borderRadius: '15px',
    boxShadow: 'none',
  },
  tagCard: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    [theme.breakpoints.down(900)]: {
      bottom: theme.spacing(-1),
      right: theme.spacing(5),
    },
  },
  tagText: {
    color: theme.palette.primary.main,
  },
  tagReturn: {
    backgroundColor: '#e0f1f2',
    color: theme.palette.success.main,
  },
  tooltip: {
    marginLeft: theme.spacing(1),
  },
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
      backgroundColor: theme.palette.background.default,
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: '13px',
      color: theme.palette.text.primary,
    },
  },
  arrowPositive: {
    color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
  },
  arrowNegative: {
    color: red[500],
  },
  tradeButton: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '11px',
    height: '50px',
    backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    padding: theme.spacing(1, 3),
  },
  kindLabel: {
    fontWeight: 700,
    [theme.breakpoints.down(900)]: {
      textAlign: 'center',
      width: '100%',
    },
  },
  cardContainer: {
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
    [theme.breakpoints.down(700)]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  gridMain: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  backGrid: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3),
      justifyContent: 'space-evenly',
    },
  },
}));

export const tradeColumns = (tableId: UITableID) => [
  {
    field: 'identifier',
    headerName: 'Tokens',
    renderCell: (params: GridCellParams) => {
      const { t } = useTranslation();
      const theme = useTheme();
      const classes = useStyles();
      const isMobile = useMediaQuery(theme.breakpoints.down(700));
      const dispatch = useDispatch();
      const { chain } = useContext(ConfigurationContext);
      const isConnected = useWalletConnected();
      const { showModal } = useModal();
      const { isAuthenticated } = useAuth();
      const { sale, saleLoading } = useSelector(selectMarketplace);
      const { modal, updateModal, updatePurchase } = useContext(MarketplaceContext);

      const [tokenPrices, setTokenPrices] = useState<{ basePrice: any; quotePrice: any }>(null);
      const [displayAge, setDisplayAge] = useState(false);
      const [buttonLoading, setButtonLoading] = useState(false);

      const { row } = params;
      const saleInformation = (row as unknown) as IMarketSource;

      const kindLabel = useMemo(() => marketSaleTypeOptions.find((i) => i.key === +saleInformation.kind).label, [
        saleInformation.kind,
      ]);
      const lockedSale = isLockedSale(+saleInformation.kind);

      const readableCreateDate = useMemo(() => new Date(saleInformation.create_date).toISOString(), [
        saleInformation.create_date,
      ]);
      const readableUpdateDate = useMemo(() => new Date(saleInformation.update_date).toISOString(), [
        saleInformation.update_date,
      ]);

      const handleNewPurchase = () => {
        if (!isAuthenticated) {
          const authModal = showModal(AuthDialog, {
            onClose: () => {
              authModal.hide();
            },
          });
          return;
        }
        gtm.push({
          event: 'clicked_marketplace_purchase',
          category: 'Marketplace',
          action: 'Clicked MarketPlace Purchase',
        });
        if (isConnected === 1) {
          dispatch(getSale(saleInformation.identifier));
          setButtonLoading(true);
        } else {
          const connectWalletModal = showModal(ConnectYourWallet, {
            onWalletConnected: () => {
              connectWalletModal.hide();
            },
            onCancel: () => {
              connectWalletModal.hide();
            },
          });
        }
      };

      const ratio = getBigNumberCurrencyLabel(+saleInformation.ratio, false, 9);

      useEffect(() => {
        if (tokenPrices?.basePrice && tokenPrices?.quotePrice) {
          const depositValue = new BigNumber(tokenPrices.quotePrice).multipliedBy(saleInformation.quote_token_quantity);
          const returnValue = new BigNumber(tokenPrices.basePrice).multipliedBy(saleInformation.base_token_quantity);
          const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);

          dispatch(setVariationPercentage(saleInformation.identifier, percentage.toNumber()));
        }
      }, [tokenPrices]);

      useEffect(() => {
        if (sale !== initialPurchaseObject && !saleLoading && modal.activeModal !== 'sale') {
          updatePurchase((prev) => ({ ...prev, ...sale }));
          updateModal((prev) => ({
            ...prev,
            showModal: true,
            activeModal: 'purchase',
            loading: false,
            kind: +sale.kind,
            step: EMarketContractSteps.CREATING_PURCHASE,
          }));
          setButtonLoading(false);
        }
      }, [sale, saleLoading]);

      useEffect(() => {
        const getPrices = async () => {
          const [base, quote] = await Promise.all([
            getTokenData(saleInformation.base_token_address, chain),
            getTokenData(saleInformation.quote_token_address, chain),
          ]);
          setTokenPrices({ basePrice: base?.price_usd, quotePrice: quote?.price_usd });
        };

        const refreshInterval = setInterval(() => {
          getPrices();
        }, 10000);

        // First run
        getPrices();

        return () => clearInterval(refreshInterval);
      }, []);

      return (
        <Grid
          container
          className={classes.gridMain}
          px={2}
          spacing={4}
          display="flex"
          flexDirection={!isMobile ? 'row' : 'column'}
          justifyContent="space-between"
          alignItems={isMobile ? 'center' : null}
        >
          <Grid item display="flex" className={classes.cardContainer} md={12} lg={5} flexDirection="row">
            <Grid item display="flex" flexDirection="column" justifyContent="center" position="relative">
              <Card className={classes.tradeCard}>
                <AvatarThumbnail
                  address={saleInformation.quote_token_address}
                  alt={saleInformation.quote_token_symbol}
                  size="large"
                />
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography fontWeight={700} mr={0.5} fontSize="14px">
                      {saleInformation.quote_token_symbol}
                    </Typography>
                    <Typography fontWeight={700} fontSize="14px">
                      {getBigNumberCurrencyLabel(saleInformation.quote_token_quantity, false, 7)}
                    </Typography>
                  </Box>
                  <Card className={clsx(classes.tagCard)}>
                    <Typography fontWeight={700} fontSize="12px" letterSpacing="2px" className={classes.tagText}>
                      {t('DEPOSIT')}
                    </Typography>
                  </Card>
                </Box>
                <Tooltip
                  className={classes.tooltip}
                  classes={{ popper: classes.tooltipPopper }}
                  enterTouchDelay={0}
                  title={
                    <Typography color="inherit" whiteSpace="nowrap">
                      <>
                        {saleInformation.quote_token_symbol}
                        <br />
                      </>
                      {`Market Price: $${
                        tokenPrices?.quotePrice ? getBigNumberCurrencyLabel(tokenPrices.quotePrice, false, 4) : 0
                      }`}
                      {isBNBToken(saleInformation.quote_token_address) ? null : (
                        <>
                          <br />
                          {`Contract: ${saleInformation.quote_token_address}`}
                        </>
                      )}
                    </Typography>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </Card>
            </Grid>
            <Grid item display="flex" flexDirection="column" justifyContent="center" mx={4}>
              <TradeIcon />
            </Grid>
            <Grid item display="flex" flexDirection="column" justifyContent="center" position="relative">
              <Card className={classes.tradeCard}>
                <AvatarThumbnail
                  address={saleInformation.base_token_address}
                  alt={saleInformation.base_token_symbol}
                  size="large"
                />
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography fontWeight={700} mr={0.5} fontSize="14px">
                      {saleInformation.base_token_symbol}
                    </Typography>
                    <Typography fontWeight={700} fontSize="14px">
                      {getBigNumberCurrencyLabel(saleInformation.base_token_quantity, false, 7)}
                    </Typography>
                  </Box>
                  <Card className={clsx(classes.tagCard, classes.tagReturn)}>
                    <Typography fontWeight={700} fontSize="12px" letterSpacing="2px">
                      {t('RETURN')}
                    </Typography>
                  </Card>
                </Box>
                <Tooltip
                  className={classes.tooltip}
                  classes={{ popper: classes.tooltipPopper }}
                  enterTouchDelay={0}
                  title={
                    <Typography>
                      <>
                        {saleInformation.base_token_symbol}
                        <br />
                      </>
                      {`Market Price: $${
                        tokenPrices?.basePrice ? getBigNumberCurrencyLabel(tokenPrices.basePrice, false, 4) : 0
                      }`}
                      {isBNBToken(saleInformation.base_token_address) ? null : (
                        <>
                          <br />
                          {`Contract: ${saleInformation.base_token_address}`}
                        </>
                      )}
                    </Typography>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </Card>
            </Grid>
          </Grid>
          <Grid
            item
            display="flex"
            alignItems="center"
            className={classes.backGrid}
            flexDirection={!isMobile ? 'row' : 'column'}
            justifyContent="space-between"
            md={7}
            lg={6}
          >
            <Grid item display="flex" ml={4}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems={isMobile ? 'center' : null}
              >
                <Box className={classes.tokenPrices}>
                  <Typography fontSize="13px" fontWeight={700} className={classes.kindLabel}>
                    {kindLabel} #{saleInformation.identifier}
                  </Typography>
                </Box>
                <Box className={classes.tokenPrices}>
                  <Typography
                    fontSize="12px"
                    fontWeight={700}
                    textAlign="center"
                    color="textSecondary"
                    onClick={() => setDisplayAge((prev) => !prev)}
                  >
                    {displayAge ? (
                      <TruncatedTooltipText value={getAge(`${lockedSale ? readableUpdateDate : readableCreateDate}`)} />
                    ) : (
                      <TruncatedTooltipText
                        value={localeDate(`${lockedSale ? readableUpdateDate : readableCreateDate}`)}
                      />
                    )}
                  </Typography>
                </Box>
                {lockedSale ? (
                  <Box className={classes.tokenPrices}>
                    <Typography fontWeight={700}>{`${saleInformation.packages} package${
                      +saleInformation.packages > 1 ? 's' : ''
                    }`}</Typography>
                  </Box>
                ) : null}
              </Box>
            </Grid>
            <Grid item display="flex">
              <Box className={classes.tokenTrade}>
                <Typography fontSize="12px" fontWeight={700}>
                  {`1 ${saleInformation.quote_token_symbol} = ${getBigNumberCurrencyLabel(ratio, false, 4)} ${
                    saleInformation.base_token_symbol
                  }`}
                </Typography>
                {saleInformation.variationPercentage ? (
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                    {saleInformation.variationPercentage <= 0 ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    <Typography
                      className={
                        +saleInformation.variationPercentage <= 0 ? classes.arrowNegative : classes.arrowPositive
                      }
                      variant="subtitle1"
                      fontSize="14px"
                      fontWeight={700}
                    >{`${getBigNumberCurrencyLabel(
                      Math.abs(saleInformation.variationPercentage),
                      false,
                      2,
                    )}%`}</Typography>
                    <Tooltip
                      className={classes.tooltip}
                      classes={{ popper: classes.tooltipPopper }}
                      enterTouchDelay={0}
                      title={
                        <Typography color="inherit">
                          {`Based on current market values, swapping 
                            ${saleInformation.quote_token_symbol} for ${saleInformation.base_token_symbol} results in a
                            ${getBigNumberCurrencyLabel(Math.abs(saleInformation.variationPercentage), false, 2)}% 
                            ${saleInformation.variationPercentage <= 0 ? 'loss' : 'profit'}.`}
                        </Typography>
                      }
                    >
                      <InfoIcon />
                    </Tooltip>
                  </Box>
                ) : null}
              </Box>
            </Grid>
            <Grid item display="flex">
              <Box className={classes.buyButton}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <LoadingButton
                    loading={buttonLoading}
                    loadingPosition="end"
                    endIcon={<></>}
                    fullWidth
                    onClick={handleNewPurchase}
                    className={classes.tradeButton}
                    size="large"
                  >
                    {tableId === UITableID.marketplace_trade_list ? (
                      <Typography className={classes.buttonText}>
                        {buttonLoading ? t('LOADING...') : t('BUY')}
                      </Typography>
                    ) : (
                      <Typography className={classes.buttonText}>
                        {buttonLoading ? t('LOADING') : t('VIEW DETAILS')}
                      </Typography>
                    )}
                  </LoadingButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      );
    },
    flex: 1,
  },
];
