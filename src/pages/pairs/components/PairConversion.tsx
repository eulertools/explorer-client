import BigNumber from 'bignumber.js';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import PairConversionToken from 'src/pages/pairs/components/PairConversionToken';
import { IPairSource } from 'src/types/pair';

const useStyles = makeStyles((theme) =>
  createStyles({
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      height: `calc(100% - ${theme.spacing(6)} - 31px)`,
      padding: '1rem',
    },
    inputs: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
    },
    syncIcon: {
      cursor: 'pointer',

      [theme.breakpoints.down('md')]: {
        transform: 'rotate(90deg)',
      },
    },
  }),
);

interface CoinExchange {
  leftInput: number;
  rightInput: number;
}

interface PairConversionProps {
  pairDetails: IPairSource;
  liquidityBase: number;
  liquidityQuote: number;
}

const PairConversion: FC<PairConversionProps> = ({ pairDetails, liquidityBase, liquidityQuote }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [orderAsc, setOrderAsc] = useState(true);
  const [pair] = useState<string[]>([pairDetails.base_token_symbol, pairDetails.quote_token_symbol]);
  const quoteRatio = new BigNumber(liquidityQuote).dividedBy(liquidityBase).toNumber();
  const baseRatio = new BigNumber(liquidityBase).dividedBy(liquidityQuote).toNumber();

  const [ratio] = useState<number[]>([baseRatio, quoteRatio]);
  const [coinExchange, setCoinExchange] = useState<CoinExchange>({
    leftInput: 1,
    rightInput: quoteRatio,
  });

  const handleLeftExchange = (e) => {
    const newValues = {
      leftInput: e.target.value,
      rightInput: e.target.value * ratio[1],
    };
    setCoinExchange(newValues);
  };
  const handleRightExchange = (e) => {
    const newValues = {
      leftInput: e.target.value * ratio[0],
      rightInput: e.target.value,
    };
    setCoinExchange(newValues);
  };

  const handleExchange = () => {
    setOrderAsc((prevOrder) => !prevOrder);
  };

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h5" color="textPrimary">
        {t('Conversion')}
      </Typography>
      <Card className={classes.mainCard}>
        <Box className={classes.inputs}>
          <Box order={orderAsc ? 1 : 3}>
            <PairConversionToken
              symbol={pair[0]}
              tokenAddress={pairDetails.base_token_address}
              coinValue={coinExchange.leftInput}
              onChange={handleLeftExchange}
            />
          </Box>
          <Box order={2} padding="1rem 2rem">
            <SyncAltIcon className={classes.syncIcon} onClick={handleExchange} />
          </Box>
          <Box order={orderAsc ? 3 : 1}>
            <PairConversionToken
              symbol={pair[1]}
              tokenAddress={pairDetails.quote_token_address}
              coinValue={coinExchange.rightInput}
              onChange={handleRightExchange}
            />
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

export default PairConversion;
