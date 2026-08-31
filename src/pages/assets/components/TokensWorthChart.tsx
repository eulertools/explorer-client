import Chart from 'react-apexcharts';
import { useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import useSettings from 'src/hooks/useSettings';

export const TokensWorthChart = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  const chart = {
    options: {
      chart: {
        background: 'transparent',
        stacked: false,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 5,
        curve: 'smooth' as 'smooth',
      },
      theme: {
        mode: theme.palette.mode,
      },
      xaxis: {
        categories: [
          'Test0',
          'Test1',
          'Test2',
          'Test3',
          'Test4',
          'Test5',
          'Test6',
          'Test7',
          'Test8',
          'Test9',
          'Test10',
          'Test11',
          'Test12',
          'Test13',
          'Test14',
          'Test15',
          'Test16',
          'Test17',
          'Test18',
          'Test19',
          'Test20',
        ],
        tickAmount: 20,
        labels: {
          style: {
            colors: `rgba(163, 163, 163, ${settings.theme === 'DARK' ? '0.2' : '0.7'})`,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        lines: {
          show: false,
        },
        labels: {
          show: false,
          style: {
            colors: `rgba(163, 163, 163, ${settings.theme === 'DARK' ? '0.2' : '0.7'})`,
          },
        },
      },
      grid: {
        borderColor: `rgba(240, 240, 240, ${settings.theme === 'DARK' ? '0.2' : '0.7'})`,
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
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
    },
    series: [
      {
        name: 'Total',
        data: [42, 25, 30, 60, 75, 80, 70, 65, 85, 50, 38, 50, 60, 50, 47, 55, 30],
      },
    ],
  };

  return (
    <Grid item xs={12} pl={2} pr={1} pt={2}>
      <Chart width="100%" height={600} type="area" {...chart} />
    </Grid>
  );
};
