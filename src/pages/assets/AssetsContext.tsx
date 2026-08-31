import { useWeb3React } from '@web3-react/core';
import _noop from 'lodash/noop';
import { createContext, Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import useWalletConnected from 'src/hooks/useWalletConnected';
import gtm from 'src/lib/gtm';
import { selectMyWallets, selectWalletsLoading } from 'src/selectors/wallets';
import { useSelector } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';

export const assetsFlags = {
  chart: false,
  priceHistory: false,
  showTrackedTokens: true,
  showNFTAssets: true,
};

export interface TrackedAddress {
  address: string;
  name: string;
  identifier: string;
  type: string;
  network: ESupportedNetworks;
  balance?: number;
  tokens?: any[];
  total?: number;
}

interface IAssetsContext {
  timePeriod: string;
  updateTimePeriod: Dispatch<SetStateAction<string>>;
  selectedAddress: TrackedAddress;
  updateSelectedAddress: Dispatch<SetStateAction<TrackedAddress>>;
  addresses: TrackedAddress[];
  updateAddresses: Dispatch<SetStateAction<TrackedAddress[]>>;
  isDemo: boolean;
  updateDemo: Dispatch<SetStateAction<boolean>>;
  onImportAddress: (address: TrackedAddress) => void;
}

export const initialDemoAddresses = [
  {
    address: '0x4c21080cDffc33e54B98eA782C4437f8C50d299C',
    name: '0x4c21080cDffc33e54B98eA782C4437f8C50d299C',
    identifier: 'id~0x4c21080cDffc33e54B98eA782C4437f8C50d299C',
    type: 'address',
    network: ESupportedNetworks.BNB,
  },
];

export const initialSelectedAddress = {
  address: '',
  name: '',
  identifier: '',
  type: 'address',
  network: ESupportedNetworks.BNB,
};

export const AssetsContext = createContext<IAssetsContext>({
  timePeriod: '24H',
  updateTimePeriod: () => {},
  selectedAddress: initialSelectedAddress,
  updateSelectedAddress: () => {},
  addresses: [],
  updateAddresses: () => {},
  isDemo: false,
  updateDemo: _noop,
  onImportAddress: _noop,
});

export const AssetsContextProvider: FC = ({ children }) => {
  const { account } = useWeb3React();
  const { isAuthenticated } = useAuth();
  const isConnected = useWalletConnected();
  const favoriteAddresses = useSelector(selectMyWallets);
  const favoriteAddressesLoading = useSelector(selectWalletsLoading);

  const [timePeriod, updateTimePeriod] = useState('24H');
  const [isDemo, updateDemo] = useState(false);

  const [selectedAddress, updateSelectedAddress] = useState<TrackedAddress>(initialSelectedAddress);
  const [addresses, updateAddresses] = useState<TrackedAddress[]>([]);

  useEffect(() => {
    updateAddresses((oldAddresses) => {
      // Avoid showing old data during loading
      if (!favoriteAddressesLoading) {
        if (isDemo && isConnected !== 1) {
          return [...initialDemoAddresses];
        }
        if (isAuthenticated && favoriteAddresses.length > 0 && !(oldAddresses[0]?.total >= 0)) {
          return [...(favoriteAddresses as TrackedAddress[])];
        }
        if (isConnected === 1 && isAuthenticated && favoriteAddresses.length > 0 && !(oldAddresses[0]?.total >= 0)) {
          return [...(favoriteAddresses as TrackedAddress[])];
        }
        if (isConnected === 1 && !isAuthenticated) {
          return [{ ...initialSelectedAddress, address: account, name: account, identifier: `id~${account}` }];
        }
        if (isConnected === 1 && isAuthenticated && oldAddresses[0]?.total >= 0) {
          return oldAddresses;
        }
        if (isConnected === 1 && oldAddresses[0]?.total >= 0) {
          return [{ ...initialSelectedAddress, address: account, name: account, identifier: `id~${account}` }];
        }
        if (isConnected !== 1 && oldAddresses[0]?.total >= 0) {
          return oldAddresses;
        }
      }
      return [];
    });

    updateSelectedAddress((old) => {
      // Avoid showing old data during loading
      if (!favoriteAddressesLoading) {
        if (isDemo && isConnected !== 1) {
          return initialDemoAddresses[0];
        }
        if (isAuthenticated && favoriteAddresses.length > 0 && !(old?.total >= 0)) {
          return {
            ...initialSelectedAddress,
            address: favoriteAddresses[0].address,
            name: favoriteAddresses[0].name,
            identifier: favoriteAddresses[0].identifier,
          };
        }
        if (isConnected === 1 && isAuthenticated && favoriteAddresses.length === 0 && !(old?.total >= 0)) {
          return { ...initialSelectedAddress, address: account, name: account, identifier: `id~${account}` };
        }
        if (isConnected === 1 && !isAuthenticated) {
          return { ...initialSelectedAddress, address: account, name: account, identifier: `id~${account}` };
        }
        if (isConnected === 1 && isAuthenticated && !(old?.total >= 0)) {
          return { ...initialSelectedAddress, address: account, name: account, identifier: `id~${account}` };
        }
        if (isConnected === 1 && isAuthenticated && old?.total >= 0) {
          return old;
        }
        if (isConnected !== 1 && isAuthenticated && old?.total >= 0) {
          return old;
        }
        if (isConnected !== 1 && !isAuthenticated && old?.total >= 0) {
          return old;
        }
        return initialSelectedAddress;
      }
      return initialSelectedAddress;
    });
  }, [account, isDemo, isConnected, isAuthenticated, favoriteAddresses.length, favoriteAddressesLoading]);

  const onImportAddress = useCallback((address: TrackedAddress) => {
    updateDemo(false);
    updateSelectedAddress(address);
    updateAddresses([address]);
    gtm.push({
      event: 'succeeded_assets_import_wallet',
      category: 'Assets',
      action: 'succeeded assets import wallet',
    });
  }, []);

  return (
    <AssetsContext.Provider
      value={{
        timePeriod,
        updateTimePeriod,
        selectedAddress,
        updateSelectedAddress,
        addresses,
        updateAddresses,
        isDemo,
        updateDemo,
        onImportAddress,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
