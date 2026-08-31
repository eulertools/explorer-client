import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import { selectTokenExchangeDataByAddress } from 'src/selectors/tokenExchange';
import { getTokenExchange } from 'src/slices/entities/token-exchange';
import { linkToExchangeSwap } from 'src/utils/linkToExchangeSwap';
import { EulerError } from './EulerError';
import { EulerLoading } from './EulerLoading';
import { TruncatedTooltipText } from './TruncatedTooltipText';

const useStyles = makeStyles((theme) =>
  createStyles({
    mainCard: {
      border: 'none',
      boxShadow: 'none',
      height: '100%',
      width: '100%',
    },
    cardHeader: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      '& h5': {
        fontSize: 16,
      },
    },
    button: {
      maxWidth: 200,
      textAlign: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '100px',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    conversionGrid: {
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    active: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    conversion: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      '& .MuiButton-outlined': {
        borderRadius: '100px',
      },
    },
    starIcon: {
      color: '#F3BA2F',
      fontSize: '1rem',
      marginLeft: theme.spacing(0.5),
    },
  }),
);
interface EulerTokenBuyCardProps {
  exchangeAddress: string;
}

export const EulerTokenBuyCard = (props: EulerTokenBuyCardProps) => {
  const { exchangeAddress } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const select = selectTokenExchangeDataByAddress(exchangeAddress);
  const tokenInfo = useSelector(select);
  React.useEffect(() => {
    dispatch(getTokenExchange(exchangeAddress));
  }, [exchangeAddress]);

  if (!tokenInfo || tokenInfo.loading || !tokenInfo.detail) return <EulerLoading />;
  if (tokenInfo.error) return <EulerError error={tokenInfo.error} />;

  const { _source: data } = tokenInfo.detail;
  const url = linkToExchangeSwap(data.owner, data.base_token_address, data.quote_token_address);

  const basePrice = new BigNumber(data.price).toNumber();
  const quotePrice = new BigNumber(1).dividedBy(Number(data.price)).toNumber();
  const liquidityBase = new BigNumber(data.base_token_balance).toNumber();
  const liquidityQuote = new BigNumber(data.quote_token_balance).toNumber();
  const liquidityPoolPrice = new BigNumber(data.quote_token_balance).dividedBy(data.base_token_balance).toNumber();

  return (
    <Card className={classes.mainCard}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <Grid container spacing={3}>
            <Grid item xs={6} display="flex" alignItems="center">
              <TokenPairAvatars
                baseTokenAddress={data?.base_token_address}
                quoteTokenAddress={data?.quote_token_address}
              />
              <Typography marginBottom={0} display="inline-block" variant="h5">
                {data.symbol}
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" alignItems="center">
              <Button fullWidth className={classes.button} href={url} variant="contained" target="_blank">
                {t('BUY')}
              </Button>
            </Grid>
          </Grid>
        }
      />
      <CardContent>
        <Grid container pt={0}>
          <Grid item xs={12} sm={7} alignItems="center" display="grid">
            <Typography variant="h5">
              {data.quote_token_name}&nbsp;
              {basePrice}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">
              <TruncatedTooltipText value={`1 ${data.quote_token_name} : ${quotePrice} ${data.base_token_name}`} />
            </Typography>
          </Grid>
        </Grid>
        <Box fontSize={12} mt={2} display="grid" gridTemplateColumns="1fr 50%">
          <Box>{t('Liquidity Base')}</Box>
          <Box textAlign="right" maxWidth="100%">
            <TruncatedTooltipText value={`${liquidityBase} ${data.base_token_name}`} />
          </Box>
        </Box>
        <Box fontSize={12} mt={1} display="grid" gridTemplateColumns="1fr 50%">
          <Box>{t('Liquidity Quote')}</Box>
          <Box textAlign="right" maxWidth="100%">
            <TruncatedTooltipText value={`${liquidityQuote} ${data.quote_token_name}`} />
          </Box>
        </Box>
        <Box fontSize={12} mt={1} display="grid" gridTemplateColumns="1fr 50%">
          <Box>{t('LP Price')}</Box>
          <Box textAlign="right" maxWidth="100%">
            <TruncatedTooltipText value={liquidityPoolPrice} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
