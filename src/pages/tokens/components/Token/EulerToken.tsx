import React, { FC, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { EulerChart } from 'src/components/dashboard/home/EulerChart';
import LiquidityWidget from 'src/components/dashboard/home/TokenWidget/LiquidityWidget';
import TokenCard from 'src/components/dashboard/home/TokenWidget/TokenCard';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import useSettings from 'src/hooks/useSettings';
import EulerPairTransactionContainer from 'src/pages/tokens/components/Token/EulerPairTransactionContainer';
import { ESettingsCurrencies } from 'src/types/symbol';

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      height: '22px',
      width: '22px',
    },
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      height: `calc(100% - ${theme.spacing(1)})`,
    },
    tokenGrid: {
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: 'none',
      [theme.breakpoints.down('sm')]: {
        borderRight: `none`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
    filterToggle: {
      width: '100%',
      '& > button': {
        border: 'none',
        padding: '10px 34px 6px 34px',
        boxSizing: 'border-box',
        borderRadius: '20px 20px 0px 0px',
        '& > span': {
          '& > h6': {
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '27px',
            padding: '0px 6px',
            textTransform: 'none',
            color: theme.palette.primary.light,
          },
        },
      },
    },
    selectedButton: {
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&>span': {
          '&>h6': {
            color: theme.palette.primary.contrastText,
          },
        },
      },
      '&.Mui-selected:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    fullWidthButton: {
      width: '100%',
    },
    minhalfWidthButton: {
      minWidth: '50%',
    },
    divider: {
      marginTop: '7%',
      marginBottom: '7%',
    },
  }),
);

interface ToolbarProps {
  value: string;
  setValue: React.Dispatch<string>;
  showWault?: boolean;
  showPancakeV2?: boolean;
}

const Toolbar: FC<ToolbarProps> = ({ value, setValue, showWault, showPancakeV2 }) => {
  const classes = useStyles();

  const handleToggle = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue) setValue(newValue);
  };

  return (
    <>
      <Hidden smUp>
        <ToggleButtonGroup
          className={classes.filterToggle}
          orientation="vertical"
          fullWidth
          value={value}
          exclusive
          onChange={handleToggle}
        >
          {showWault && (
            <ToggleButton
              classes={{ root: classes.selectedButton }}
              size="small"
              value="wault"
              aria-label="left aligned"
            >
              <Avatar className={classes.avatar} variant="square" aria-label="logo" src="/static/wault.png" />
              <Typography align="center" color="textPrimary" variant="subtitle2">
                Wault Wswap
              </Typography>
            </ToggleButton>
          )}
          {showPancakeV2 && (
            <ToggleButton
              classes={{ root: classes.selectedButton }}
              size="small"
              value="pancakeV2"
              aria-label="centered"
            >
              <Typography align="center" color="textPrimary" variant="subtitle2">
                Pancake V2
              </Typography>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Hidden>
      <Hidden smDown>
        <ToggleButtonGroup className={classes.filterToggle} value={value} exclusive onChange={handleToggle}>
          {showWault && (
            <ToggleButton
              className={classes.minhalfWidthButton}
              classes={{ root: classes.selectedButton }}
              size="small"
              value="wault"
              aria-label="left aligned"
            >
              <Avatar className={classes.avatar} variant="square" aria-label="logo" src="/static/wault.png" />
              <Typography align="center" color="textPrimary" variant="subtitle2">
                Wault Wswap
              </Typography>
            </ToggleButton>
          )}
          {showPancakeV2 && (
            <ToggleButton
              className={classes.minhalfWidthButton}
              classes={{ root: classes.selectedButton }}
              size="small"
              value="pancakeV2"
              aria-label="left aligned"
            >
              <Typography align="center" color="textPrimary" variant="subtitle2">
                Pancake V2
              </Typography>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Hidden>
    </>
  );
};

interface EulerTokenProps {
  showPriceWidget?: boolean;
  showLiquidityWidget?: boolean;
  showChartWidget?: boolean;
  showTradeList?: boolean;
}

const EulerToken: FC<EulerTokenProps> = ({
  showPriceWidget = true,
  showLiquidityWidget = true,
  showChartWidget = true,
  showTradeList = true,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { poolDataBUSD } = useCoinData();
  const [pancakeToggle, setPancakeToggle] = useState('pancakeV2');
  const { chain } = useContext(ConfigurationContext);

  const [symbol, setSymbol] = useState<ESettingsCurrencies>(settings.symbol || ESettingsCurrencies.BUSD);
  const [pancakeBUSDPrice, setPancakeBUSDPrice] = useState(0);

  useEffect(() => {
    if (settings.symbol !== symbol) {
      setSymbol(settings.symbol);
    }
  }, [settings]);

  useEffect(() => {
    setPancakeBUSDPrice(poolDataBUSD.price);
  }, [poolDataBUSD]);

  const pancakeBUSDInitialized = poolDataBUSD.eulerBalance !== null && pancakeBUSDPrice !== null;

  return (
    <Grid container spacing={2} justifyContent="flex-start" pt={2}>
      {showPriceWidget && (
        <Grid item xs={12} md={6}>
          <Card className={classes.mainCard}>
            <Toolbar showPancakeV2 value={pancakeToggle} setValue={setPancakeToggle} />
            {pancakeToggle === 'pancakeV2' ? (
              <Grid container>
                <Grid item xs={12}>
                  <TokenCard
                    symbol={symbol}
                    initialized={pancakeBUSDInitialized}
                    coinPrice={pancakeBUSDPrice}
                    data={poolDataBUSD}
                    buttonText={t('BUY')}
                    buttonSubtitle={t('Recommended')}
                    buttonUrl={`https://pancakeswap.finance/swap?inputCurrency=${chain.bsc.tokens.stable.address}&outputCurrency=${chain.bsc.tokens.euler.address}`}
                    recommended
                  />
                </Grid>
              </Grid>
            ) : null}
          </Card>
        </Grid>
      )}
      {showLiquidityWidget && (
        <Grid item sm={12} md={6}>
          <LiquidityWidget />
        </Grid>
      )}
      {showChartWidget && (
        <Grid item xs={12}>
          <EulerChart />
        </Grid>
      )}
      <Grid item xs={12}>
        {showTradeList && <EulerPairTransactionContainer />}
      </Grid>
    </Grid>
  );
};

export default EulerToken;
