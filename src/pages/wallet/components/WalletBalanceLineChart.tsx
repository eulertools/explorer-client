import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const data = {
  series: [
    {
      type: 'area',
      color: '#5B8FF9',
      data: [3350, 1840, 2254, 5780, 9349, 5241, 2770, 2051, 3764, 2385, 5912, 8323],
      name: 'Balance',
    },
  ],
  xaxis: {
    dataPoints: [
      '01 Jan',
      '02 Jan',
      '03 Jan',
      '04 Jan',
      '05 Jan',
      '06 Jan',
      '07 Jan',
      '08 Jan',
      '09 Jan',
      '10 Jan',
      '11 Jan',
      '12 Jan',
    ],
  },
};

export interface WalletBalanceLineChartProps {}
export const WalletBalanceLineChart = () => {
  const theme = useTheme();

  const chart = {
    options: {
      chart: {
        type: 'area',
        height: 230,
        toolbar: {
          autoSelected: 'pan',
          show: false,
        },
      },
      colors: ['#00BAEC'],
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        show: false,
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 3,
      },
      theme: {
        mode: theme.palette.mode,
      },
      tooltip: {
        theme: theme.palette.mode,
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true,
        },
        categories: data.xaxis.dataPoints,
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      yaxis: [
        {
          axisBorder: {
            color: theme.palette.divider,
            show: true,
          },
          axisTicks: {
            color: theme.palette.divider,
            show: true,
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary,
            },
          },
        },
        {
          axisTicks: {
            color: theme.palette.divider,
            show: true,
          },
          axisBorder: {
            color: theme.palette.divider,
            show: true,
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary,
            },
          },
          opposite: true,
        },
      ],
    },
    series: data.series,
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        title={
          <Box>
            <Typography color="textPrimary" variant="h6">
              Balance Line Chart
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Chart height={220} type="area" {...(chart as ApexOptions)} />
      </CardContent>
    </Card>
  );
};
