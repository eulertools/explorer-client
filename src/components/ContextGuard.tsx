import { FC, useContext } from 'react';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import ServerError from 'src/pages/ServerError';
import SplashScreen from './SplashScreen';

const ContextGuard: FC = ({ children }) => {
  const { loading, loadingError } = useContext(ConfigurationContext);

  if (loading) {
    return <SplashScreen />;
  }
  if (loadingError) {
    return <ServerError />;
  }

  return <>{children}</>;
};

export default ContextGuard;
