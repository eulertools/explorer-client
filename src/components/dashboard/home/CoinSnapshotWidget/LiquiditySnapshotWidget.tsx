import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, createStyles, Grid, makeStyles, useTheme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import LockIcon from '@material-ui/icons/Lock';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import axios from 'src/lib/axios';
import { loggerError } from 'src/utils/logger';
import { currencyformatter } from '../../../../utils/currencyHelpers';

interface ISectionLabelProps {
  sectionLabel: string | React.ReactNode;
}

const SectionTitle: FC<ISectionLabelProps> = ({ sectionLabel }) => (
  <Grid item xs={12}>
    <Divider light style={{ marginBottom: 8 }} />
    {sectionLabel}:
  </Grid>
);
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
    noPadBottom: {
      paddingBottom: '0px',
    },
    active: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    stats: {
      marginTop: '0px',
    },
    actions: {
      display: 'block',
      textAlign: 'center',
    },
  }),
);

const LiquiditySnapshotWidget: FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [burnt, setBurnt] = useState<number>(null);
  const [, setMining] = useState<number>(null);
  const { chain } = useContext(ConfigurationContext);
  // const [marketing, setMarketing] = useState<number>(null);

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
      );

      setBurnt(burntResponse.data.tokens[0].quantity || null);
    } catch (err) {
      loggerError(err);
    }
  }, []);

  const getMining = useCallback(async () => {
    try {
      const address = '0x5A1f3BeE1b7B369Efd99B896101917a9d9BaDf6D';

      const minedResponse = await axios.publicFetchClient.get(
        `addresses/${address}?token=${chain.bsc.tokens.euler.address}`,
      );

      setMining(minedResponse.data.tokens[0].quantity || null);
    } catch (err) {
      loggerError(err);
    }
  }, []);

  useEffect(() => {
    getBurn();
    getMining();
    // getMarketing();
  }, []);

  return (
    <Card sx={{ marginBottom: 1, height: `calc(100% - ${theme.spacing(1)})` }}>
      <CardHeader
        className={classes.noPadBottom}
        title={`Liquidity ${burnt == null ? '-' : currencyformatter.format(total - burnt)}`}
      />
      <CardContent>
        <Grid className={classes.stats} container spacing={1} alignItems="flex-end">
          <Grid item xs={4}>
            Initial:
          </Grid>
          <Grid item xs={8} textAlign="right">
            {currencyformatter.format(initial)}
          </Grid>
          {/* LOCKED */}
          <SectionTitle sectionLabel="Locked" />
          <GridItemKey label="Company Reserve" />
          <Grid item xs={7}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              {currencyformatter.format(locked.company)}&nbsp;
              <LockIcon fontSize="small" />
            </Box>
          </Grid>
          <GridItemKey label="Team Markets" />
          <Grid item xs={7}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              {currencyformatter.format(locked.team)}&nbsp;
              <LockIcon fontSize="small" />
            </Box>
          </Grid>
          {/* <GridItemKey label="Marketing Markets" />
          <Grid item xs={7}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              {currencyformatter.format(marketing)}&nbsp;
              <LockIcon fontSize="small" />
            </Box>
          </Grid> */}
          <GridItemKey label={<b>Total Locked</b>} />
          <Grid item xs={7}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <b>{currencyformatter.format(locked.team + locked.company)}</b>&nbsp;
              <LockIcon fontSize="small" />
            </Box>
          </Grid>
          {/* BURNT */}
          <Grid item xs={12}>
            <Divider light style={{ marginBottom: 8 }} />
          </Grid>
          <Grid item xs={4}>
            <b>Total Burnt:</b>
          </Grid>
          <Grid item xs={8} textAlign="right">
            <b>{currencyformatter.format(burnt)}</b>
          </Grid>
          {/* CIRCULATING */}
          <Grid item xs={12}>
            <Divider light style={{ marginBottom: 8 }} />
          </Grid>
          <Grid item xs={5}>
            <b>Total Circulating:</b>
          </Grid>
          <Grid item xs={7} textAlign="right">
            <b>{currencyformatter.format(initial - locked.company - locked.team - burnt)}</b>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LiquiditySnapshotWidget;
