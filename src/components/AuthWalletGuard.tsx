import { useWeb3React } from '@web3-react/core';
import type { FC } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import { useEagerConnect } from 'src/hooks/useMetamaskAccount';
import SplashScreen from './SplashScreen';

const AuthWalletGuard: FC = ({ children }) => {
  const auth = useAuth();
  const { account, active } = useWeb3React();
  const tried = useEagerConnect();

  if (!auth.isInitialized || (!active && !tried)) {
    return <SplashScreen />;
  }

  if (!auth.isAuthenticated && !account) {
    return <Navigate to="/bsc" />;
  }

  return <>{children}</>;
};

export default AuthWalletGuard;
