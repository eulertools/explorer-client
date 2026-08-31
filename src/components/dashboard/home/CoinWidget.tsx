/* eslint-disable react/no-unused-prop-types */
import { useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import Logo from '../../Logo';

const useStyles = makeStyles((theme) =>
  createStyles({
    label: {
      fontSize: 14,
      fontWeight: 700,
      marginBottom: '8px',
    },
    value: {
      fontSize: 16,
      fontWeight: 400,
      marginBottom: '12px',
    },
    tokenValue: {
      fontSize: 16,
      fontWeight: 400,
      marginBottom: '12px',
      alignitems: 'center',
      display: 'flex',
    },
    mainContainer: {
      fontWeight: 700,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
    valueChange: {
      color: theme.palette.success.main,
      fontSize: 18,
      marginTop: 10,
    },
  }),
);

interface CoinWidgetProps {
  coinData: {
    mainValue: number;
    change: number;
    lastDayChange: number;
    lastDayChangeValue: number;
    lastDayVolume: number;
    indexPrice: number;
    fundingPrice: number;
    markPrice: number;
    lastPrice: number;
    token: String;
    tokenLink: String;
  };
  symbol: string;
}

export default function CoinWidget(props: CoinWidgetProps) {
  const { chain } = useContext(ConfigurationContext);
  const theme = useTheme();
  const styles = useStyles();
  const { coinData } = props;
  const {
    mainValue,
    change,
    lastDayChange,
    lastDayChangeValue,
    lastDayVolume,
    indexPrice,
    fundingPrice,
    markPrice,
    lastPrice,
    token,
  } = coinData;

  return (
    <Card style={{ padding: 24, height: '100%' }}>
      <CardHeader
        disableTypography
        title={
          <Grid container>
            <Grid item xs={3}>
              <Logo format="logo" />
            </Grid>
            <Grid item xs={9} className={styles.mainContainer}>
              <div style={{ fontSize: 32 }}>{mainValue.toFixed(8)}</div>
              <div
                className={styles.valueChange}
                style={{ color: lastDayChange < 0 ? theme.palette.error.main : theme.palette.success.main }}
              >
                {change.toFixed(8)}
              </div>
              <div style={{ fontSize: 12, marginTop: 8 }}>
                <span style={{ color: lastDayChange < 0 ? theme.palette.error.main : theme.palette.success.main }}>
                  (24h: {lastDayChange.toFixed(8)}
                  %)
                </span>{' '}
                {lastDayChangeValue.toFixed(8)}
              </div>
            </Grid>
          </Grid>
        }
        sx={{ padding: '0 0 16px 0', borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ pt: '8px' }} style={{ marginTop: 12, padding: 0 }}>
        <Grid container style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <div className={styles.label}>24h Volume</div>
            <div className={styles.value}>{lastDayVolume.toFixed(8)}</div>
          </Grid>
          <Grid item xs={6}>
            <div className={styles.label}>Index Price</div>
            <div className={styles.value}>{indexPrice.toFixed(8)}</div>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 14 }}>
          <Grid item xs={6}>
            <div className={styles.label}>Funding Price</div>
            <div className={styles.value}>{fundingPrice.toFixed(8)}</div>
          </Grid>
          <Grid item xs={6}>
            <div className={styles.label}>Mark Price</div>
            <div className={styles.value}>{markPrice.toFixed(8)}</div>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 14 }}>
          <Grid item xs={6}>
            <div className={styles.label}>Last Price</div>
            <div className={styles.value}>{lastPrice.toFixed(8)}</div>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 14 }}>
          <div className={styles.label}>Token contract</div>
          <div className={styles.tokenValue}>
            <Button
              aria-label="delete"
              target="_blank"
              href={`https://bscscan.com/token/${chain.bsc.tokens.euler.address}`}
            >
              {token}
              <Launch fontSize="small" style={{ cursor: 'pointer', marginLeft: 6 }} />
            </Button>
          </div>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          p: 2,
          paddingBottom: 0,
          paddingTop: '24px',
          marginTop: '24px',
        }}
      >
        <Button
          color="primary"
          variant="contained"
          target="_blank"
          style={{ margin: '0 auto', height: '42px', width: '100%' }}
          href={`https://swap.wault.finance/bsc/index.html#/swap?outputCurrency=${chain.bsc.tokens.euler.address}`}
        >
          BUY NOW!
        </Button>
      </CardActions>
    </Card>
  );
}
