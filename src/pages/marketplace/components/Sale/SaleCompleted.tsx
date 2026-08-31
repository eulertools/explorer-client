import { useWeb3React } from '@web3-react/core';
import { useState, useMemo, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import gtm from 'src/lib/gtm';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { useDispatch, useSelector } from 'src/store';
import { marketSaleTypeOptions, marketSalePeriodOptions } from 'src/types/marketplace';
import { isPrivateSale, isLockedSale } from 'src/utils/marketplace';
import { getAge, localeDate } from 'src/utils/moment';
import { shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    paddingTop: theme.spacing(2),
    background: theme.palette.background.default,
    borderRadius: '30px',
    width: '100%',
  },
  itemGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    [theme.breakpoints.down(1100)]: {
      flexDirection: 'column',
    },
  },
  description: {
    display: 'flex',
    fontWeight: 700,
  },
  copyIcon: {
    display: 'flex',
    '& > button': {
      padding: 0,
      paddingLeft: theme.spacing(1),
      '&:hover': {
        backgroundColor: 'unset',
        opacity: 0.5,
      },
      '& > span > svg': {
        width: '20px',
      },
    },
  },
}));

export const SaleCompleted = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { account } = useWeb3React();
  const { sale: saleData, saleLoading } = useSelector(selectMarketplace);
  const { sale } = useContext(MarketplaceContext);
  const [displayAge, setDisplayAge] = useState(false);
  const [readableCreateDate, setReadableCreateDate] = useState(null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600));

  const privateSale = isPrivateSale(sale.kind);
  const lockedSale = isLockedSale(sale.kind);

  const currentSale = useMemo(() => marketSaleTypeOptions.find((i) => i.key === sale.kind).label, [sale.kind]);
  const currentPeriod = lockedSale
    ? useMemo(() => marketSalePeriodOptions.find((i) => i.key === sale.lockoutPeriod).label, [sale.lockoutPeriod])
    : null;

  useEffect(() => {
    if (saleData) {
      const createDate = new Date(saleData.create_date)?.toISOString();
      setReadableCreateDate(createDate);
    }
  }, [saleData]);

  useEffect(() => {
    gtm.push({ event: 'succeed_markeplace_purchase', category: 'Marketplace', action: 'Succeed MarketPlace Purchase' });
    dispatch(getSale(sale.id));
  }, []);

  if (saleLoading) {
    return <ScreenSpinner />;
  }

  if (!saleData) return null;

  return (
    <Grid container display="flex" justifyContent="space-between" gap={1}>
      <Card className={classes.mainCard}>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography className={classes.description}>Congratulations! You created a {currentSale}</Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Sale Type')}
          </Typography>
          <Typography fontWeight="500" color="textPrimary">
            {currentSale}
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Share')}
          </Typography>
          <Typography className={classes.copyIcon} fontWeight="500" color="textPrimary">
            #{saleData?.identifier}
            <IconCopyToClipboard
              text={`${window.location.toString()}/${saleData?.identifier}`}
              copyText="Copy Share Link"
            />
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Your Wallet')}
          </Typography>
          <Typography className={classes.copyIcon} fontWeight="500" color="textPrimary">
            {!isSmallScreen ? account : shortAddress(account)}
            <IconCopyToClipboard text={account} copyText="Copy your Wallet Address" />
          </Typography>
        </Grid>
        <Divider light flexItem />
        {privateSale ? (
          <>
            <Grid item xs={12} className={classes.itemGrid}>
              <Typography fontWeight="bold" color="textPrimary">
                {t('Buyer Wallet')}
              </Typography>
              <Typography className={classes.copyIcon} fontWeight="500" color="textPrimary">
                {!isSmallScreen ? saleData?.whitelisted_wallets[0] : shortAddress(saleData?.whitelisted_wallets[0])}
                <IconCopyToClipboard text={saleData?.whitelisted_wallets[0]} copyText="Copy Buyer Wallet Address" />
              </Typography>
            </Grid>
            <Divider light flexItem />
          </>
        ) : null}
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Created')}
          </Typography>
          <Typography onClick={() => setDisplayAge((prev) => !prev)} color="textPrimary" fontWeight="500">
            {readableCreateDate
              ? `${displayAge ? getAge(`${readableCreateDate}`) : localeDate(`${readableCreateDate}`)}`
              : 'N/A'}
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Payment Token')}
          </Typography>
          <Typography fontWeight="500" color="textPrimary">
            {saleData?.base_token_symbol}
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Payment Value')}
          </Typography>
          <Typography fontWeight="500" color="textPrimary">
            {saleData?.base_token_quantity}
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Return Token')}
          </Typography>
          <Typography fontWeight="500" color="textPrimary">
            {saleData?.quote_token_symbol}
          </Typography>
        </Grid>
        <Divider light flexItem />
        <Grid item xs={12} className={classes.itemGrid}>
          <Typography fontWeight="bold" color="textPrimary">
            {t('Return Value')}
          </Typography>
          <Typography fontWeight="500" color="textPrimary">
            {saleData?.quote_token_quantity}
          </Typography>
        </Grid>
        <Divider light flexItem />
        {lockedSale ? (
          <>
            <Grid item xs={12} className={classes.itemGrid}>
              <Typography fontWeight="bold" color="textPrimary">
                {t('Packages')}
              </Typography>
              <Typography fontWeight="500" color="textPrimary">
                {saleData?.packages}
              </Typography>
            </Grid>
            <Divider light flexItem />
            <Grid item xs={12} className={classes.itemGrid}>
              <Typography fontWeight="bold" color="textPrimary">
                {t('Period')}
              </Typography>
              <Typography fontWeight="500" color="textPrimary">
                {sale.lockoutPeriodUnits > 1 ? `${sale.lockoutPeriodUnits} ${currentPeriod}s` : `${currentPeriod}`}
              </Typography>
            </Grid>
            <Divider light flexItem />
          </>
        ) : null}
      </Card>
    </Grid>
  );
};
