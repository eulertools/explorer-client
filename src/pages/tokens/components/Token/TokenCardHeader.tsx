import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { getReadableCurrency } from 'src/hooks/useIntl';
import { ISource } from 'src/types/search';

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

interface TokenCardHeaderProps {
  token: ISource;
}

const TokenCardHeader: FC<TokenCardHeaderProps> = ({ token }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Card className={classes.mainCard}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2} height="inherit">
          <Grid item xs={12} sm={6} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Market Cap')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              $ {getReadableCurrency(token?.market_cap || 0)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" fontSize={18} fontWeight={700} textAlign="center">
              {t('Volume')}
            </Typography>
            <Typography variant="body2" color="primary" fontSize={16} fontWeight={700} textAlign="center" marginTop={1}>
              {getReadableCurrency(+token?.total_supply || 0)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TokenCardHeader;
