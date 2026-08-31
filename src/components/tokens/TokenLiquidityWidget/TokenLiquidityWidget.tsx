import React, { FC } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, createStyles, Grid, makeStyles, Typography } from '@material-ui/core';

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

interface TokenLiquidityWidgetProps {
  symbol: string;
}

const TokenLiquidityWidget: FC<TokenLiquidityWidgetProps> = () => {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const classes = useStyles();
  const chartOptions = {
    series: [
      {
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14],
      },
    ],
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['#7E83FB', '#8B92FB', '#A2A9FC'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <Card>
      <CardHeader className={classes.noPadBottom} title="Liquidity" />
      <CardContent>
        <Grid className={classes.stats} container spacing={1} alignItems="flex-end">
          <Grid item xs={6} md={6}>
            <Typography>
              {month}&nbsp;{year}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={250} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TokenLiquidityWidget;
