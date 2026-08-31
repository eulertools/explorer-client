import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import { BALANCE_OF_ABI, useEulerContract } from 'src/hooks/useEulerContract';
import { setEulerBalance } from 'src/slices/user/subscriptionModal';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { useStyles } from '../styles';
import { AdvanceCard } from './AdvanceCard';
import { BasicCard } from './BasicCard';
import { EnterpriseCard } from './EnterpriseCard';

export const SubscriptionCards = () => {
  const { chain } = useContext(ConfigurationContext);
  const classes = useStyles();
  const { connect, createContract, getEulerBalance, error, loading } = useEulerContract({ autoConnect: false });
  const dispatch = useDispatch();
  const { user } = useAuth();
  React.useEffect(() => {
    const load = async () => {
      if (!user.wallet_hash) return;
      connect();
      await createContract(BALANCE_OF_ABI, chain.bsc.tokens.euler.address);
      const balance = await getEulerBalance(user.wallet_hash);
      dispatch(setEulerBalance(balance));
    };
    load();
  }, []);
  if (loading) return <EulerLoading />;
  return (
    <>
      {error ? <EulerError error={error} /> : null}
      <Box className={classes.root}>
        <Box className={classes.item}>
          <BasicCard />
        </Box>
        <Box className={classes.item}>
          <AdvanceCard />
        </Box>
        <Box className={classes.item}>
          <EnterpriseCard />
        </Box>
      </Box>
    </>
  );
};
