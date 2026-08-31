import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@material-ui/core';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useCoinData from 'src/hooks/useCoinData';
import { useEulerContract, SUBSCRIPTION_ABI, TransferResponse } from 'src/hooks/useEulerContract';
import { selectSubscriptionModal } from 'src/selectors/subscriptionModal';
import { UserSubscriptionType } from 'src/slices/user/account';
import { sendTransactionInformation } from 'src/slices/user/subscriptionModal';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { subscriptionConfig } from '../config';

// import { currencyformatter } from "src/utils/currencyHelpers";

const WrappedComponent = () => {
  const { connect, createContract, error, loading, transfer } = useEulerContract({ autoConnect: false });
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { poolDataBUSD } = useCoinData();
  const { chain } = useContext(ConfigurationContext);

  const poolInfoInitialized = poolDataBUSD.eulerBalance !== null;
  const usdPrice = poolInfoInitialized
    ? new BigNumber(poolDataBUSD.busdBalance).dividedBy(poolDataBUSD.eulerBalance)
    : null;
  const modalSubscription = useSelector(selectSubscriptionModal);

  React.useEffect(() => {
    connect();
    createContract(SUBSCRIPTION_ABI, chain.bsc.tokens.euler.address);
  }, [connect]);

  let amount = subscriptionConfig[modalSubscription.selectedPlan || UserSubscriptionType.free].price.notHolder;
  if (modalSubscription.eulerHolder)
    amount = subscriptionConfig[modalSubscription.selectedPlan || UserSubscriptionType.free].price.holder;
  const euler = new BigNumber(amount).dividedBy(usdPrice);

  const handleTransfer = React.useCallback(() => {
    const base = euler.toFixed(0);
    transfer(user.wallet_hash, base.padEnd(18 + base.length, '0')).then((t: TransferResponse) => {
      if (t) dispatch(sendTransactionInformation(t));
    });
  }, [euler]);

  if (!poolInfoInitialized) {
    return (
      <Box minHeight="400px">
        <Box>
          <Box>
            <EulerError error="Unable to get euler price" />
          </Box>
        </Box>
      </Box>
    );
  }

  if (modalSubscription.tx) {
    return (
      <Box minHeight="400px" display="grid" justifyContent="center" alignItems="center">
        <Box>
          <Box>
            <Typography>Your transfer hash</Typography>
            <Typography>
              <Box display="grid" justifyContent="center">
                <EulerAddress address={modalSubscription.tx.transactionHash} />
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box minHeight="400px" gridTemplateColumns="50%" justifyContent="center" alignItems="center">
      <Box>
        {error ? (
          <Box pt={3}>
            <EulerError error={error} />
          </Box>
        ) : null}
        {loading ? (
          <EulerLoading />
        ) : (
          <Box
            display="grid"
            gridTemplateRows="100px 60px 60px"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Typography>
              Transfer <strong>{euler.toFixed(0)} EULER </strong>
              <Typography variant="caption">({amount} USD)</Typography> <br />
              from your account to the following account:
            </Typography>
            <EulerAddress address={chain.bsc.company_wallet} addressRender={EulerAddressRenderTypes.truncate_right} />
            <Box display="grid" justifyContent="center" alignItems="center">
              <Button variant="contained" onClick={handleTransfer}>
                Transfer
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const SubscriptionModalPayment = () => (
  <CoinDataProvider>
    <WrappedComponent />
  </CoinDataProvider>
);
