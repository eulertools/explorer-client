import { FC } from 'react';
import { Card } from '@material-ui/core';
import MarketChartTV from 'src/components/tvmarketchart';

interface MarketChartProps {
  symbol: string;
  identifier: string;
}

export const MarketChart: FC<MarketChartProps> = ({ symbol, identifier }) => (
  <Card style={{ height: 650 }}>
    <MarketChartTV symbol={symbol} identifier={identifier} customHeight="100%" />
  </Card>
);
