import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import { PoolDataBUSDModel } from 'src/contexts/CoinDataContext';
import { ESettingsCurrencies } from 'src/types/symbol';
import { currencyformatter } from 'src/utils/currencyHelpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainCard: {
      border: 'none',
      boxShadow: 'none',
    },
    buttonGrid: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(0.5),
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'flex-start',
      },
    },
    stats: {
      marginTop: '0px',
    },
    button: {
      maxWidth: 200,
      textAlign: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '100px',
    },
    buttonRecommended: {
      maxWidth: 200,
      textAlign: 'center',
      backgroundColor: theme.palette.success.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '100px',
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    },
    buttonWarning: {
      backgroundColor: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
    starIcon: {
      color: '#F3BA2F',
      fontSize: '1rem',
      marginLeft: theme.spacing(0.5),
    },
  }),
);

interface TokenCardProps {
  symbol: ESettingsCurrencies;
  initialized: boolean;
  coinPrice: number;
  data: PoolDataBUSDModel;
  buttonText: string;
  buttonUrl: string;
  buttonSubtitle?: string;
  buttonIcon?: boolean;
  recommended?: boolean;
  warningButton?: boolean;
}

const TokenCard: FC<TokenCardProps> = ({
  symbol,
  initialized,
  coinPrice,
  data,
  buttonText,
  buttonSubtitle,
  buttonIcon,
  buttonUrl,
  recommended = false,
  warningButton = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const recommendedColor = useMemo(() => {
    if (recommended) {
      return theme.palette.success.main;
    }
    if (warningButton) {
      return theme.palette.error.main;
    }

    return theme.palette.text.primary;
  }, [recommended, warningButton]);

  return (
    <Card className={classes.mainCard}>
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Typography variant="h5">
              {symbol === ESettingsCurrencies.BNB ? 'BNB' : '$'}&nbsp;{initialized ? coinPrice.toFixed(6) : '-'}
            </Typography>
            <Typography variant="h6">
              1 BUSD : {initialized ? currencyformatter.format(data.eulerBalance / data.busdBalance) : '-'} EULER
            </Typography>
          </Grid>
          <Grid className={classes.buttonGrid} item xs={12} sm={3}>
            <Button
              fullWidth
              className={`${recommended ? classes.buttonRecommended : classes.button} ${
                warningButton && classes.buttonWarning
              }`}
              href={buttonUrl}
              variant="contained"
              target="_blank"
            >
              {buttonText}
            </Button>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="overline" color={recommendedColor} paddingTop="2px" fontSize="0.625rem">
                {buttonSubtitle}
              </Typography>
              {buttonIcon && <StarIcon className={classes.starIcon} />}
            </Box>
          </Grid>
        </Grid>
        <Grid className={classes.stats} container spacing={2} alignItems="flex-end">
          <Grid item xs={5}>
            {t('Liquidity Base')}
          </Grid>
          <Grid item xs={7} textAlign="right">
            <Box>{`${initialized ? currencyformatter.format(data.eulerBalance) : '-'} EULER`}</Box>
          </Grid>
          <Grid item xs={5}>
            {t('Liquidity Quote')}
          </Grid>
          <Grid item xs={7} textAlign="right">
            <Box>{`${initialized ? currencyformatter.format(data.busdBalance) : '-'} BUSD`}</Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
