import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { IPairSource } from 'src/types/pair';
import { getTokenSrc } from 'src/utils/avatar';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { linkToExchangeSwap } from 'src/utils/linkToExchangeSwap';

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      height: '22px',
      width: '22px',
    },
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      height: `calc(100% - ${theme.spacing(6)} - 31px)`,
      display: 'flex',
      flexDirection: 'column',
    },
    buttonGrid: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(0.5),
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    toolbarButton: {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      borderRadius: 0,
      cursor: 'default',
      padding: '10px 34px 6px 34px',
      pointerEvents: 'none',
      '&>span': {
        '&>h6': {
          color: theme.palette.primary.contrastText,
          fontSize: '16px',
          fontWeight: 700,
          padding: '0px 6px',
        },
      },
    },
    button: {
      maxWidth: 200,
      textAlign: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '100px',
    },
  }),
);

interface ToolbarProps {
  owner: string;
}

const Toolbar: FC<ToolbarProps> = ({ owner }) => {
  const classes = useStyles();
  return (
    <Button classes={{ root: classes.toolbarButton }} size="small">
      {owner === 'wswap' && (
        <>
          <Avatar className={classes.avatar} variant="square" aria-label="logo" src="/static/wault.png" />
          <Typography align="center" color="textPrimary" variant="subtitle2">
            Wault Wswap
          </Typography>
        </>
      )}
      {owner === 'pancake1' && (
        <>
          <AvatarThumbnail src={getTokenSrc('cake')} alt={owner[0].toUpperCase()} />
          <Typography align="center" color="textPrimary" variant="subtitle2">
            Pancake V1
          </Typography>
        </>
      )}
      {owner === 'pancake2' && (
        <>
          <AvatarThumbnail src={getTokenSrc('cake')} alt={owner[0].toUpperCase()} />
          <Typography align="center" color="textPrimary" variant="subtitle2">
            Pancake V2
          </Typography>
        </>
      )}
    </Button>
  );
};

interface PairCardProps {
  title?: boolean;
  pairDetails: IPairSource;
  baseValue: number;
  quoteValue: number;
  liquidityBase: number;
  liquidityQuote: number;
  lpPrice: number;
}

const PairCard: FC<PairCardProps> = ({
  title,
  pairDetails,
  baseValue,
  quoteValue,
  liquidityBase,
  liquidityQuote,
  lpPrice,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const url = linkToExchangeSwap(pairDetails.owner, pairDetails.base_token_address, pairDetails.quote_token_address);

  return (
    <>
      {title ? (
        <Typography variant="h5" color="textPrimary">
          {t('Price')}
        </Typography>
      ) : null}
      <Card className={classes.mainCard}>
        <Toolbar owner={pairDetails.owner} />
        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <Typography variant="h5">
                1 {pairDetails.base_token_symbol}: {getBigNumberCurrencyLabel(baseValue)}{' '}
                {pairDetails.quote_token_symbol}
              </Typography>
              <Typography variant="h6">
                1 {pairDetails.quote_token_symbol}: {getBigNumberCurrencyLabel(quoteValue)}{' '}
                {pairDetails.base_token_symbol}
              </Typography>
            </Grid>
            <Grid className={classes.buttonGrid} item xs={12} sm={5}>
              <Button fullWidth variant="contained" className={classes.button} href={url} target="_blank">
                {t('BUY')}
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={0} alignItems="flex-end">
            <Grid item xs={5}>
              {t('Liquidity Base')}
            </Grid>
            <Grid item xs={7} textAlign="right">
              <Box>
                {getBigNumberCurrencyLabel(liquidityBase)} {pairDetails.base_token_symbol}
              </Box>
            </Grid>
            <Grid item xs={5}>
              {t('Liquidity Quote')}
            </Grid>
            <Grid item xs={7} textAlign="right">
              <Box>
                {getBigNumberCurrencyLabel(liquidityQuote)} {pairDetails.quote_token_symbol}
              </Box>
            </Grid>
            <Grid item xs={4}>
              {t('LP Price')}
            </Grid>
            <Grid item xs={8} textAlign="right">
              $ {lpPrice === 0 ? '-' : getBigNumberCurrencyLabel(lpPrice)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default PairCard;
