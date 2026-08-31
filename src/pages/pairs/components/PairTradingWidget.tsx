import { FC } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import TVChartContainer from 'src/components/tvchart';
import { IPairSource } from 'src/types/pair';

interface IProps {
  pairDetails: IPairSource;
  height?: string;
}

const PairTradingWidget: FC<IProps> = (props) => {
  const { pairDetails, height } = props;
  const { network } = useParams();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { base_token_name, base_token_address, quote_token_name, quote_token_address, owner } = pairDetails;

  const pairChartData = {
    id: pairDetails.address,
    owner,
    token0: {
      symbol: base_token_name,
      name: base_token_name,
      id: base_token_address,
    },
    token1: {
      symbol: quote_token_name,
      name: quote_token_name,
      id: quote_token_address,
    },
  };

  if (pairDetails === null) {
    return <ScreenSpinner />;
  }

  return (
    <Grid item xs={12} paddingBottom={3} marginTop={3}>
      <TVChartContainer pair={pairChartData} customHeight={height} network={network} />
    </Grid>
  );
};

export default PairTradingWidget;
