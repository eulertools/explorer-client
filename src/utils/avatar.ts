import Web3 from 'web3';
import { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';

export function getAvatarSrc(address: string, eulerView: boolean = false, isTestnet: boolean = false) {
  if (typeof address !== 'string') return '';

  try {
    const network = getSelectedNetworkFromLocalstorage();
    const csAddress = Web3.utils.toChecksumAddress(address);

    if (eulerView) {
      return `${process.env.REACT_APP_ASSETS_URL}/tokens/bsc/${csAddress}/logo.png`;
    }

    if (isTestnet) {
      return `${process.env.REACT_APP_ASSETS_URL}/tokens/bsctest/${csAddress}/logo.png`;
    }

    return `${process.env.REACT_APP_ASSETS_URL}/tokens/${network}/${csAddress}/logo.png`;
  } catch {
    return '';
  }
}

export function getPlatformSrc(platform: string) {
  if (platform) {
    const lcPlatform = platform.toLowerCase();

    return `${process.env.REACT_APP_ASSETS_URL}/platforms/${lcPlatform}.png`;
  }

  return '';
}

/**
 * Given a token symbol get the token assets
 * @param token it's actually the symbol
 * @returns uri to our assets repo
 */
export function getTokenSrc(token: string) {
  if (token) {
    const lcToken = token.toLowerCase();

    return `${process.env.REACT_APP_ASSETS_URL}/tokens/${lcToken}.png`;
  }

  return '';
}

export function getConnectorSrc(connector: string) {
  if (connector) {
    return `${process.env.REACT_APP_ASSETS_URL}/connectors/${connector}.svg`;
  }

  return '';
}
