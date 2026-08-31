import { ExtendedTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import { FC, useState, useMemo, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/Info';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { EulerToken } from 'src/ui/EulerToken';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isLockedSale, getPeriodAndUnit } from 'src/utils/marketplace';
import { getAge, localeDate } from 'src/utils/moment';

const useStyles = makeStyles((theme) => ({
  titleBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
    },
  },
  tradeTitle: {
    alignItems: 'center',
    fontSize: theme.spacing(3),
    '& > div > a > p': {
      fontSize: theme.spacing(3),
    },
  },
  cardHeaderContainer: {
    background: theme.palette.background.paper,
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
}));

interface IPurchaseHeaderProps {
  tokenPrices: { basePrice: any; quotePrice: any };
}

export const PurchaseHeader: FC<IPurchaseHeaderProps> = ({ tokenPrices }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { purchase, purchaseState } = useContext(MarketplaceContext);

  const [displayAge, setDisplayAge] = useState(false);
  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);

  const lockedSale = isLockedSale(+purchase.kind);

  const [timePeriod, timeUnit] = useMemo(() => getPeriodAndUnit(purchase?.period), [purchase]);

  const readableCreateDate = new Date(purchase?.create_date).toISOString();

  const ratio = getBigNumberCurrencyLabel(+purchase.ratio, false, 9);

  useEffect(() => {
    if (tokenPrices?.basePrice && tokenPrices?.quotePrice) {
      const depositValue = new BigNumber(tokenPrices.quotePrice).multipliedBy(purchase.quote_token_quantity);
      const returnValue = new BigNumber(tokenPrices.basePrice).multipliedBy(purchase.base_token_quantity);
      const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);

      setVariationPercentage(percentage);
    }
  }, [tokenPrices]);

  return (
    <Grid className={classes.cardHeaderContainer} container spacing={2} pb={2}>
      <Grid item xs={12} md={4} display="flex" alignItems="flex-start">
        <Box className={classes.titleBox}>
          <Typography color="textPrimary" variant="h5" my={1} display="flex" gap={1} className={classes.tradeTitle}>
            {purchaseState.canClaim ? t('CLAIM') : t('TRADE')}
            <Hidden mdDown>
              <EulerToken
                address={purchase.quote_token_address}
                name={purchase.quote_token_symbol}
                addressLink={purchase.quote_token_address}
              />
              /
              <EulerToken
                address={purchase.base_token_address}
                name={purchase.base_token_symbol}
                addressLink={purchase.base_token_address}
              />
            </Hidden>
          </Typography>
          <Hidden mdUp>
            <Box className={classes.tradeTitle} display="flex" flexDirection="row" alignItems="center" gap={1}>
              <EulerToken
                address={purchase.quote_token_address}
                name={purchase.quote_token_symbol}
                addressLink={purchase.quote_token_address}
              />
              /
              <EulerToken
                address={purchase.base_token_address}
                name={purchase.base_token_symbol}
                addressLink={purchase.base_token_address}
              />
            </Box>
          </Hidden>
        </Box>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          {t('RATE')}
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography color="textPrimary" variant="subtitle1">
            {`1 ${purchase.quote_token_symbol}`}
          </Typography>
          <Typography color="textPrimary" variant="subtitle1">
            {`${getBigNumberCurrencyLabel(ratio, false, 4)} ${purchase.base_token_symbol}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          {t('VARIATION')}
        </Typography>
        {variationPercentage ? (
          <Box display="flex" flexDirection="row" alignItems="center">
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
                  ${purchase.quote_token_symbol} for ${purchase.base_token_symbol} results in a
                  ${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}% 
                  ${variationPercentage.isLessThanOrEqualTo(0) ? 'loss' : 'profit'}.`}
                </Typography>
              }
            >
              <InfoIcon className={classes.infoIcon} />
            </Tooltip>
          </Box>
        ) : (
          '--'
        )}
      </Grid>
      {lockedSale ? (
        <>
          <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="textPrimary" variant="h5" my={1}>
              {t('TRADE LIMIT')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" textAlign="center">
              <Typography color="textPrimary" variant="subtitle1">
                {`${getBigNumberCurrencyLabel(purchase.base_token_quantity / +purchase.packages, false, 7)} ${
                  purchase.base_token_symbol
                }`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="textPrimary" variant="h5" my={1}>
              {t('PERIOD')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" textAlign="center">
              <Typography color="textPrimary" variant="subtitle1">
                {purchase?.period !== '0'
                  ? `1 EVERY ${
                      +timeUnit > 1 ? `${timeUnit} ${timePeriod.toUpperCase()}S` : `${timePeriod.toUpperCase()}`
                    }`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
            <Typography color="textPrimary" variant="h5" my={1}>
              {t('TOTAL')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography color="textPrimary" variant="subtitle1">
                {`${getBigNumberCurrencyLabel(purchase.base_token_quantity, false, 7)} ${purchase.base_token_symbol}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
            <Typography color="textPrimary" variant="h5" my={1}>
              {t('DATE')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography
                onClick={() => setDisplayAge((prev) => !prev)}
                color="textPrimary"
                variant="subtitle1"
                fontWeight="bold"
              >
                {readableCreateDate
                  ? `${displayAge ? getAge(`${readableCreateDate}`) : localeDate(`${readableCreateDate}`)}`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
