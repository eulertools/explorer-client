import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { useIntl } from 'src/hooks/useIntl';
import VerifiedIcon from 'src/icons/svg-icons/VerifiedIcon';
import axios from 'src/lib/axios';
import { EStakingNames } from 'src/types/configuration';
import { loggerError } from 'src/utils/logger';

interface IGridItemKeyProps {
  label: string | React.ReactNode;
}

const GridItemKey: FC<IGridItemKeyProps> = ({ label }) => (
  <Grid item xs={5} style={{ paddingLeft: 16 }}>
    {label}:
  </Grid>
);

const useStyles = makeStyles((theme) =>
  createStyles({
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      height: `calc(100% - ${theme.spacing(1)})`,
    },
    stats: {
      marginTop: '0px',
      paddingLeft: theme.spacing(0.5),
    },
    liquidityText: {
      color: theme.palette.primary.light,
    },
    liquidityValue: {
      [theme.breakpoints.down(1080)]: {
        fontSize: '1.2rem',
      },
    },
    toggleIcons: {
      marginLeft: '-20px',
    },
    clickableGrid: {
      cursor: 'pointer',
    },
  }),
);

const DEFAULT_EMPTY_LABEL = '-';

const LiquidityWidget: FC = () => {
  const { t } = useTranslation();
  const intl = useIntl();
  const theme = useTheme();
  const classes = useStyles();
  const [burnt, setBurnt] = useState<number>(null);
  const [lockedHidden, setLockedHidden] = useState(true);
  const [staked, setStaked] = useState<{ euler: number; wault: number; pancake: number }>(null);
  const { chain } = useContext(ConfigurationContext);

  // Totals that are fixed
  const {
    initial = 100_000_000,
    locked = {
      company: 15_000_000,
      team: 10_000_000,
    },
    total = 100_000_000,
  } = {};

  const getBurn = useCallback(async () => {
    try {
      const address = '0x000000000000000000000000000000000000dead';

      const burntResponse = await axios.publicFetchClient.get(
        `addresses/${address}?token=${chain.bsc.tokens.euler.address}`,
        { prefix: 'bsc' },
      );

      setBurnt(burntResponse.data.tokens[0].quantity || null);
    } catch (err) {
      loggerError(err);
    }
  }, []);

  const getStaked = useCallback(async () => {
    try {
      const eulerAddress = chain.bsc.tokens.euler.tvl.find((el) => el.name === EStakingNames.EULER).address;
      const waultAddress = '0xb52603072981529c8c0db3e390b2876d97b9b7ed';
      const pancake2Address = chain.bsc.tokens.euler.tvl.find((el) => el.name === EStakingNames.PANCAKE).address;

      const [euler, wault, pancake] = await Promise.all([
        axios.publicFetchClient.get(`addresses/${eulerAddress}?token=${chain.bsc.tokens.euler.address}`, {
          prefix: 'bsc',
        }),
        axios.publicFetchClient.get(`addresses/${waultAddress}?token=${chain.bsc.tokens.euler.address}`, {
          prefix: 'bsc',
        }),
        axios.publicFetchClient.get(`addresses/${pancake2Address}?token=${chain.bsc.tokens.euler.address}`, {
          prefix: 'bsc',
        }),
      ]);

      setStaked({
        euler: euler.data.tokens[0].quantity || null,
        wault: wault.data.tokens[0].quantity || null,
        pancake: pancake.data.tokens[0].quantity || null,
      });
    } catch (err) {
      loggerError(err);
    }
  }, []);

  const handleLockedButton = () => {
    setLockedHidden((current) => !current);
  };

  useEffect(() => {
    getBurn();
    getStaked();
  }, []);

  return (
    <Card className={classes.mainCard}>
      <CardContent>
        <Grid className={classes.stats} container spacing={1} alignItems="flex-end">
          <Grid item xs={4} sm={4} mb={1}>
            <Typography className={classes.liquidityText} variant="h6">
              {t('Liquidity')}
            </Typography>
          </Grid>
          <Grid item xs={8} sm={8} mb={1} display="flex" justifyContent="flex-end">
            <Typography className={classes.liquidityValue} variant="h5">{`${
              burnt == null ? DEFAULT_EMPTY_LABEL : intl.formatNumber(total - burnt)
            }`}</Typography>
          </Grid>
          <Grid item xs={4}>
            {t('Initial')}:
          </Grid>
          <Grid item xs={8} textAlign="right">
            {intl.formatNumber(initial)}
          </Grid>
          {/* LOCKED */}
          <Grid item xs={12} mb={1} />
          {lockedHidden ? (
            <>
              <Grid item xs={4} display="flex" onClick={handleLockedButton} className={classes.clickableGrid}>
                <Box display="inline-flex">
                  <ChevronRightIcon className={classes.toggleIcons} fontSize="small" />
                </Box>
                <b>{t('Total Locked')}:</b>
              </Grid>
              <Grid item xs={8} textAlign="right" onClick={handleLockedButton} className={classes.clickableGrid}>
                <b>
                  {staked !== null
                    ? intl.formatNumber(locked.team + staked.euler + staked.wault + staked.pancake)
                    : DEFAULT_EMPTY_LABEL}
                </b>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} className={classes.clickableGrid} onClick={handleLockedButton}>
                <Box display="inline-flex">
                  <KeyboardArrowDownIcon className={classes.toggleIcons} fontSize="small" />
                  {t('Locked')}
                </Box>
              </Grid>
              <GridItemKey label="Team Markets" />
              <Grid item xs={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  {intl.formatNumber(locked.team)}&nbsp;
                  <LockOutlinedIcon fontSize="small" />
                </Box>
              </Grid>
              <GridItemKey label="Euler Staking" />
              <Grid item xs={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  {staked.euler !== null ? intl.formatNumber(staked.euler) : DEFAULT_EMPTY_LABEL}&nbsp;
                  <VerifiedIcon fill={theme.palette.primary.main} />
                </Box>
              </Grid>
              <GridItemKey label="Wault Staking" />
              <Grid item xs={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  {staked.wault !== null ? intl.formatNumber(staked.wault) : DEFAULT_EMPTY_LABEL}&nbsp;
                  <LockOutlinedIcon fontSize="small" />
                </Box>
              </Grid>
              <GridItemKey label="PancakeV2 Pool" />
              <Grid item xs={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  {staked.pancake !== null ? intl.formatNumber(staked.pancake) : DEFAULT_EMPTY_LABEL}&nbsp;
                  <LockOutlinedIcon fontSize="small" />
                </Box>
              </Grid>
              <GridItemKey label={<b>Total Locked</b>} />
              <Grid item xs={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  <b>
                    {staked !== null
                      ? intl.formatNumber(locked.team + staked.euler + staked.wault + staked.pancake)
                      : DEFAULT_EMPTY_LABEL}
                  </b>
                  &nbsp;
                  <LockOutlinedIcon fontSize="small" />
                </Box>
              </Grid>
            </>
          )}
          {/* BURNT */}
          <Grid item xs={12} mb={1} />
          <Grid item xs={4}>
            <b>{t('Total Burnt')}:</b>
          </Grid>
          <Grid item xs={8} textAlign="right">
            <b>{burnt !== null ? intl.formatNumber(burnt) : DEFAULT_EMPTY_LABEL}</b>
          </Grid>
          {/* CIRCULATING */}
          <Grid item xs={12} mb={1} />
          <Grid item xs={5}>
            <b>{t('Total Circulating')}:</b>
          </Grid>
          <Grid item xs={7} textAlign="right">
            <b>
              {burnt !== null && staked !== null
                ? intl.formatNumber(initial - locked.team - burnt - staked.euler - staked.wault - staked.pancake)
                : DEFAULT_EMPTY_LABEL}
            </b>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LiquidityWidget;
