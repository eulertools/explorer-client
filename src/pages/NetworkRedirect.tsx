import type { FC } from 'react';
import { Navigate } from 'react-router';
import useSettings from 'src/hooks/useSettings';
import { ESupportedNetworks } from 'src/types/blockchain';

const NetworkRedirect: FC = () => {
  const { settings } = useSettings();
  const network = settings.network || ESupportedNetworks.BNB;

  return <Navigate to={`/${network}`} />;
};

export default NetworkRedirect;
