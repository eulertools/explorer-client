import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import _debounce from 'lodash/debounce';
import React, { FC, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import axios from 'src/lib/axios';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import { NETWORK_TOKEN_ADDRESS, UNKNOWN_LABEL } from '../constants';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';
import { IDexRouterDTO } from '../types';

const RoutesContainer: FC = () => {
  const { bnbData } = useCoinData();
  const { chain } = useContext(ConfigurationContext);
  const { fromToken, toToken, updateRouteInfo, reloadCount } = React.useContext(SwapperContext);
  const classes = swapperStyles();
  const [routeInfo, setRouteInfo] = React.useState<{ toTokenAmount?: number; txGas?: BigNumber }>(null);
  const [toTokenPrice, setToTokenPrice] = React.useState<number | null>(null);
  const [fetchingRouteInfo, setFetchingRouteInfo] = React.useState<boolean>(true);

  // Leverage formik context to obtain the from token value
  const { values } = useFormikContext<{
    fromTokenAmount: number;
  }>();

  const amount = values.fromTokenAmount;

  const getRoutesDebounced = React.useCallback(
    _debounce(async (_fromToken, _toToken, _amount) => {
      try {
        setFetchingRouteInfo(true);

        const fromTokenAddress = _fromToken.address;
        const toTokenAddress = _toToken.address;
        const isFromtokenNetworkToken = fromTokenAddress === NETWORK_TOKEN_ADDRESS;
        const isToTokenNetworkToken = toTokenAddress === NETWORK_TOKEN_ADDRESS;
        const wbnbTokenAddress = chain.bsc.tokens.bnb.address;

        if (
          (isFromtokenNetworkToken && toTokenAddress.toLowerCase() === wbnbTokenAddress) ||
          (isToTokenNetworkToken && fromTokenAddress.toLowerCase() === wbnbTokenAddress)
        ) {
          setRouteInfo({
            toTokenAmount: _amount,
            txGas: new BigNumber(0.00025),
          });

          updateRouteInfo({ toTokenAmount: _amount, protocols: [] });

          return;
        }

        const tokenIn = isFromtokenNetworkToken ? wbnbTokenAddress.toLowerCase() : fromTokenAddress.toLowerCase();

        // Hack for now since endpoint doesn't accept network token
        const tokenOut = isToTokenNetworkToken ? wbnbTokenAddress.toLowerCase() : toTokenAddress.toLowerCase();

        // Priority factory default to ApeSwap for now
        const routesResponse = await axios.publicFetchClient.get<IDexRouterDTO>(
          `dexrouter?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${_amount}`,
        );

        const { toTokenAmount, protocols, gasEstimation } = routesResponse.data;

        setRouteInfo({
          toTokenAmount,
          txGas: new BigNumber(gasEstimation),
        });

        updateRouteInfo({ toTokenAmount, protocols });
        // Get the price after we have information about the route
        try {
          const toTokenPriceInfo = await axios.publicFetchClient.get(
            `/tokens/${isToTokenNetworkToken ? wbnbTokenAddress : toTokenAddress}?fields[]=price_usd`,
          );
          setToTokenPrice(toTokenPriceInfo.data?._source?.price_usd);
        } catch {
          // Swallow error in case user input a token we either don't have in our records or doesn't exist
        }
      } catch (error) {
        loggerError(error);
        setRouteInfo(null);
        updateRouteInfo({ toTokenAmount: null, protocols: null });
      } finally {
        setFetchingRouteInfo(false);
      }
    }, 400),
    [],
  );

  React.useEffect(() => {
    if (amount) {
      getRoutesDebounced(fromToken, toToken, amount);
    } else {
      setRouteInfo(null);
    }
  }, [fromToken, toToken, amount, reloadCount]);

  if (!routeInfo) {
    return null;
  }
  // EulerTool route
  const costUSDTx =
    routeInfo.txGas && bnbData?.price
      ? getBigNumberCurrencyLabel(new BigNumber(routeInfo.txGas).multipliedBy(bnbData.price), false, 4)
      : UNKNOWN_LABEL;

  // Price of toToken
  const totalUSDValueObtainedLabel =
    routeInfo.toTokenAmount && toTokenPrice
      ? getBigNumberCurrencyLabel(new BigNumber(routeInfo.toTokenAmount).multipliedBy(toTokenPrice))
      : UNKNOWN_LABEL;

  return (
    <Box color="textPrimary">
      <Box display="flex" mt={1} className={classes.txFee}>
        <Typography color="textSecondary">
          {fetchingRouteInfo ? (
            <Skeleton width={80} />
          ) : (
            `Tx cost: ${getBigNumberCurrencyLabel(routeInfo.txGas) || UNKNOWN_LABEL} BNB (~ $${costUSDTx})`
          )}
        </Typography>
        <Typography color="textSecondary">
          {fetchingRouteInfo ? <Skeleton width={80} /> : `~ $${totalUSDValueObtainedLabel}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default RoutesContainer;
