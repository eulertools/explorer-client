import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import useAuth from 'src/hooks/useAuth';
import { selectAccount } from 'src/selectors/account';
import { selectWallet } from 'src/selectors/wallets';
import { getMyWallets } from 'src/slices/user/wallet';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { logger } from 'src/utils/logger';
import WalletDetails from './WalletDetails';
import { WalletCreate } from './WalletsCreate';

export const WalletsFacade = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [selectedWallet, setSelectedWallet] = useState<string>(null);

  const { getWalletsLoading, myWallets, errorMyWallets } = useSelector(selectWallet);
  const { subscription, loading: subsLoading } = useSelector(selectAccount);

  const params = useParams();
  const { address } = params;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyWallets());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    logger('Wallets facade', { myWallets, address });
    if (myWallets.length > 0 && !subsLoading) {
      // Total wallets the user is able to create
      const totalWalletsAllowed = subscription?.permissions?.wallets ?? 1;
      if (address && myWallets.slice(0, totalWalletsAllowed).find((w) => w.address === address)) {
        setSelectedWallet(address);
      } else {
        setSelectedWallet(myWallets[0].address);
      }
    }
  }, [myWallets, subsLoading]);

  if (getWalletsLoading) {
    return (
      <Box>
        <EulerLoading />
      </Box>
    );
  }

  if (myWallets.length < 1 && !errorMyWallets) {
    return <WalletCreate />; // TODO: I think here should be the assets of the user, meanwhile shows the landing assets.
  }

  if (errorMyWallets) return <EulerError error={errorMyWallets} minHeight="400px" />;

  if (selectedWallet) {
    return <WalletDetails address={selectedWallet} />; // Don't know if this should be displayed.
  }

  return null;
};
