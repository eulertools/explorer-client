import { FC, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import EagerConnectGuard from 'src/components/EagerConnectGuard';
import DashboardLayout from 'src/components/dashboard/DashboardLayout';
import useSettings from 'src/hooks/useSettings';
import { ESupportedNetworks } from 'src/types/blockchain';

const NetworkDashboardLayout: FC = () => {
  const { settings, saveSettings } = useSettings();
  const { network } = useParams();

  useEffect(() => {
    if (network && settings.network !== network) {
      const validNetwork = Object.values(ESupportedNetworks).find((n) => n === network);

      if (validNetwork) {
        saveSettings({
          ...settings,
          // TODO remove once we support more networks and use validNetwork
          network: ESupportedNetworks.BNB,
        });
      }
    }
  }, []);

  // TODO we need to move network out of the path. Once that is done we can remove this hack
  if (
    (network === ESupportedNetworks.POLYGON || network === ESupportedNetworks.BNBTEST) &&
    window.location.pathname.includes('nft')
  ) {
    return (
      <EagerConnectGuard>
        <DashboardLayout />
      </EagerConnectGuard>
    );
  }

  if (network === ESupportedNetworks.BNB) {
    return (
      <EagerConnectGuard>
        <DashboardLayout />
      </EagerConnectGuard>
    );
  }

  return <Navigate to={`/${settings.network}`} />;
};

export default NetworkDashboardLayout;
