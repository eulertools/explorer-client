import { FC, useContext, useRef } from 'react';
import Card from '@material-ui/core/Card';
import TVChartContainer from 'src/components/tvchart';
import ConfigurationContext from 'src/contexts/ConfigurationContext';

export const EulerChart: FC = () => {
  const { chain } = useContext(ConfigurationContext);

  const pair = useRef({
    id: chain.bsc.tokens.euler.address,
    owner: 'pancake1',
    token0: {
      symbol: 'EULER2',
      name: 'EULER',
      id: chain.bsc.tokens.euler.address,
    },
    token1: {
      symbol: 'BNB',
      name: 'BNB',
      id: chain.bsc.tokens.bnb.address,
    },
  });

  return (
    <Card style={{ height: 550 }}>
      <TVChartContainer pair={pair.current} customHeight="100%" network="bsc" />
    </Card>
  );
};
