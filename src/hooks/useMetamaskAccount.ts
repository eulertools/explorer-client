import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import noop from 'lodash/noop';
import { useState, useEffect } from 'react';
import { logger } from 'src/utils/logger';

// Metamask, TrustWallet in Android, etc
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 42, 56, 97, 137] });

export enum EChainIds {
  ETH_MAINNET = 1,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
}

export const networkIDToChainID = {
  eth: EChainIds.ETH_MAINNET,
  bsc: EChainIds.BSC_MAINNET,
  polygon: EChainIds.POLYGON,
};

// WalletConnect via QRCode
export const baseWalletConnectOptions = {
  rpc: {
    1: 'https://main-light.eth.linkpool.io/',
    56: 'https://bsc-dataseed.binance.org/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    137: 'https://polygon-rpc.com',
  },
  qrcode: true,
};

// TODO all this is duplicated...
export const SCAN_URLS = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  42: 'https://kovan.etherscan.io',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
  137: 'https://polygonscan.com/',
};

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

interface useInactiveListenerConfig {
  suppress: boolean;
  onConnect?: () => void;
  onChainChanged?: (chainId: string | number) => void;
  onNetworkChanged?: (chainId: string | number) => void;
  onAccountsChanged?: (accounts: string[]) => void;
}

export function useInactiveListener(config: useInactiveListenerConfig) {
  const {
    suppress = false,
    onConnect = noop,
    onChainChanged = noop,
    onAccountsChanged = noop,
    onNetworkChanged = noop,
  } = config;

  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window as any;

    const handleConnect = () => {
      logger("Handling 'connect' event");
      activate(injected);
      onConnect();
    };
    const handleChainChanged = (chainId: string | number) => {
      logger("Handling 'chainChanged' event with payload", chainId);
      activate(injected);
      onChainChanged(chainId);
    };
    const handleAccountsChanged = (accounts: string[]) => {
      logger("Handling 'accountsChanged' event with payload", accounts);
      if (accounts.length > 0) {
        activate(injected);
      }
      onAccountsChanged(accounts);
    };
    const handleNetworkChanged = (networkId: string | number) => {
      logger("Handling 'networkChanged' event with payload", networkId);
      activate(injected);
      onNetworkChanged(networkId);
    };

    if (ethereum?.on && !active && !error && !suppress) {
      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);
    }

    return () => {
      if (ethereum?.removeListener) {
        ethereum.removeListener('connect', handleConnect);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('networkChanged', handleNetworkChanged);
      }
    };
  }, [active, error, suppress, activate]);
}
