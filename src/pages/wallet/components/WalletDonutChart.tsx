import { FC } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { selectWalletTokens } from 'src/selectors/wallets';
import { getAmountPriceToken } from 'src/utils/price';

export interface ChartToken {
  name: string;
  amount: number;
}

interface WalletDonutChartProps {
  tokenList?: ChartToken[];
}

export const WalletDonutChart: FC<WalletDonutChartProps> = ({ tokenList }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tokens = useSelector(selectWalletTokens);

  let map = tokens
    .map((tkn) => ({
      name: tkn.token._source.name,
      amount: getAmountPriceToken(tkn),
    }))
    .sort((a, b) => b.amount - a.amount);

  if (tokenList) {
    map = tokenList
      .map((tkn) => ({
        name: tkn.name,
        amount: tkn.amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  if (map.length > 4) {
    map[4].name = 'Others';
    for (let i = 5; i < map.length; i += 1) {
      map[4].amount += map[i].amount;
    }
    map = map.slice(0, 5);
  }
  const labels = map.map((tkn) => tkn.name);
  const values = map.map((tkn) => tkn.amount);
  const chart = {
    options: {
      chart: {
        background: 'transparent',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      labels,
      legend: {
        fontSize: '10px',
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.subtitle2.fontWeight,
        itemMargin: {
          vertical: 8,
        },
        labels: {
          colors: theme.palette.text.primary,
        },
        markers: {
          width: 8,
          height: 8,
        },
        show: true,
      },
      stroke: {
        width: 0,
      },
      theme: {
        mode: theme.palette.mode,
      },
    },
    series: values,
  };

  return (
    <>
      {!map || map.length === 0 ? null : (
        <Card>
          <CardHeader
            disableTypography
            title={
              <Box>
                <Typography color="textPrimary" variant="h6">
                  {t('Balance Donut Chart').toUpperCase()}
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Chart width="100%" height={220} type="donut" {...chart} />
          </CardContent>
        </Card>
      )}
    </>
  );
};
