import { ExtendedTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { checksumAddress } from '../../../utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    flexBasis: 'auto',
    position: 'relative',
    borderRadius: 16,
    margin: theme.spacing(0, -3, 0, -1),
    '& > div': {
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
    },
    [theme.breakpoints.down(1280)]: {
      margin: theme.spacing(2, 3, 2),
    },
  },
  button: {
    width: '100%',
    borderRadius: '0 14px 14px 0',
    textTransform: 'uppercase',
    margin: theme.spacing(0, 0, 0, 0),
    background: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    minHeight: 'inherit',
  },
  mainButton: {
    padding: 0,
    minHeight: '42.25px',
  },
  minHeight: {
    minHeight: 'inherit',
  },
  startIcon: {
    padding: theme.spacing(0, 0, 0, 1),
    display: 'inherit',
    [theme.breakpoints.down(1280)]: {
      padding: theme.spacing(0, 0, 0, 1),
    },
  },
  endIcon: {
    display: 'inherit',
    minHeight: 'inherit',
    margin: theme.spacing(0, -0.5, 0, 0),
    [theme.breakpoints.down(1280)]: {
      padding: theme.spacing(0, 0, 0, 0),
      margin: theme.spacing(0, -2, 0, 0),
    },
  },
  textField: {
    margin: theme.spacing(0, 1.2, 0, 0),
    [theme.breakpoints.down(1280)]: {
      padding: theme.spacing(0, 1, 0, 0),
      margin: theme.spacing(0, 3, 0, 0),
    },
  },
}));

function CoinSummaryWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { poolDataBUSD } = useCoinData();
  const classes = useStyles();
  const poolsInfoFetched = poolDataBUSD.eulerBalance !== null;
  const { chain } = useContext(ConfigurationContext);

  const usdPrice = React.useMemo(() => {
    if (poolsInfoFetched) {
      return poolsInfoFetched ? new BigNumber(poolDataBUSD.busdBalance).dividedBy(poolDataBUSD.eulerBalance) : null;
    }

    return null;
  }, [poolDataBUSD]);

  return (
    <Grid className={classes.mainGrid} item xs={12}>
      <Button
        fullWidth
        disableRipple
        classes={{ startIcon: classes.startIcon, endIcon: classes.endIcon, label: classes.minHeight }}
        className={classes.mainButton}
        size="medium"
        variant="outlined"
        onClick={() => navigate('/token/euler')}
        startIcon={
          <Avatar
            sx={{ width: 25, height: 25 }}
            alt="euler-avatar"
            src={`${process.env.REACT_APP_ASSETS_URL}/tokens/bsc/${checksumAddress(
              chain.bsc.tokens.euler.address,
            )}/logo.png`}
          />
        }
        endIcon={
          <Button
            fullWidth
            className={classes.button}
            variant="contained"
            color="primary"
            size="medium"
            href="/bsc/swap"
          >
            <Typography fontSize={14} fontWeight={700}>
              {t('BUY')}
            </Typography>
          </Button>
        }
      >
        <Typography fontSize={14} fontWeight={700} className={classes.textField}>
          {poolsInfoFetched ? getBigNumberCurrencyLabel(usdPrice, false, 3, true) : '-'} BUSD
        </Typography>
      </Button>
    </Grid>
  );
}

const CoinSummaryWidgetWrapper = () => (
  <CoinDataProvider>
    <CoinSummaryWidget />
  </CoinDataProvider>
);

export default CoinSummaryWidgetWrapper;
