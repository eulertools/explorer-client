import { supportedChains } from 'src/types/blockchain';

const newNetwork = async (provider: any, network: any) => {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.chainName,
        rpcUrls: [network.rpcUrl],
        nativeCurrency: {
          symbol: network.symbol,
          decimals: network.decimals,
        },
      },
    ],
  });
};

/**
 * Changes the actual network of the wallet.
 * @param blockchain Network to change.
 */
export const setNetwork = async (blockchain) => {
  const provider = window.ethereum;
  const network = supportedChains.find((item) => item.value === blockchain);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await newNetwork(provider, network);
    } else {
      throw switchError;
    }
  }
};
