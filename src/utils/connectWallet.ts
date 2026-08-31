import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { baseWalletConnectOptions, EChainIds, injected } from 'src/hooks/useMetamaskAccount';
import gtm from 'src/lib/gtm';

export async function walletConnect(activate: Function, onWalletConnected: Function, networkChainId: EChainIds) {
  const isBSCNetwork = networkChainId === EChainIds.BSC_MAINNET;
  // eslint-disable-next-line no-nested-ternary
  const options = isBSCNetwork
    ? { ...baseWalletConnectOptions, network: 'binance', chainId: EChainIds.BSC_MAINNET }
    : networkChainId === EChainIds.POLYGON
    ? { ...baseWalletConnectOptions, network: 'polygon', chainId: EChainIds.POLYGON }
    : { ...baseWalletConnectOptions };

  const walletConnectProvider = new WalletConnectConnector(options);

  await activate(walletConnectProvider);

  gtm.push({
    event: 'connect_wallet_provider',
    category: 'Wallet',
    action: 'User click on WalletConnect',
    provider: 'WalletConnect',
  });

  onWalletConnected?.();
}

export async function metamaskWallet(activate: Function, onWalletConnected: Function, onError?: Function) {
  // @web3-react/injected-connector
  await activate(injected, onError);

  gtm.push({
    event: 'connect_wallet_provider',
    category: 'Wallet',
    action: 'User click on Metamask',
    provider: 'Metamask',
  });

  onWalletConnected?.();
}
