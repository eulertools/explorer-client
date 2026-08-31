import { FC, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { Card } from '@material-ui/core';
import TVChartContainer from 'src/components/tvchart';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { UITableID } from 'src/slices/filter.types';

interface TokenChartProps {
  tokenContract: string;
  symbol: string;
  name: string;
}

export const TokenChart: FC<TokenChartProps> = ({ tokenContract, symbol, name }) => {
  const { network } = useParams();
  const { chain } = useContext(ConfigurationContext);
  // Avoid re-render and loading of default values for chart after each load of new data.
  const config = useMemo(
    () => ({
      id: tokenContract,
      owner: 'pancake1',
      token0: {
        symbol,
        name,
        id: tokenContract,
      },
      token1: {
        symbol: chain[network].tokens.bnb.symbol,
        name: chain[network].tokens.bnb.symbol,
        id: chain[network].tokens.bnb.address,
      },
    }),
    [tokenContract, symbol, name, network],
  );

  return (
    <Card style={{ height: 550 }}>
      <TVChartContainer network={network} pair={config} customHeight="100%" uiTableId={UITableID.token_detail} />
    </Card>
  );
};
