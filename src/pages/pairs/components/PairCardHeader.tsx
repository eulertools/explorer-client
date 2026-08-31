import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { getReadableCurrency } from 'src/hooks/useIntl';
import { IPairSource } from 'src/types/pair';

const useStyles = makeStyles(() => ({
  mainCard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '16px',
    height: 'inherit',
    width: 'inherit',
  },
}));

interface IPairCardHeaderProps {
  pairDetails?: IPairSource;
}

const PairCardHeader: FC<IPairCardHeaderProps> = ({ pairDetails }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const lpPrice = '--';

  // if (pairDetails?.base_token_balance && pairDetails?.quote_token_balance) {
  //   lpPrice = getBigNumberCurrencyLabel(
  //     new BigNumber(pairDetails?.base_token_balance).dividedBy(pairDetails.quote_token_balance),
  //   );
  // }
  // Actually it is: ((volume base * price base usd) + (volume quote + price quote usd)) / total supply

  return (
    <Card className={classes.mainCard}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2} height="inherit">
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Liquidity Base')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(pairDetails?.base_token_balance) || '--'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Liquidity Quote')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(pairDetails?.quote_token_balance) || '--'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('LP Price')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {lpPrice}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Last Hour')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(pairDetails?.volumes?.hour) || '--'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Volume 24H')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(pairDetails?.volumes?.day) || '--'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Total Locked')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(pairDetails?.total_volume_locked) || '--'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PairCardHeader;
