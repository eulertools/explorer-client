import { useWeb3React } from '@web3-react/core';

/**
 * Check if user has their wallet connected and if they are in the
 * expected network
 *
 * @param expectedChainId
 * @returns -1 = "Not Connected" 0 = "On Different Network" 1 = "Connected"
 */
const useWalletConnected = (expectedChainId = 56): number => {
  const { account, chainId } = useWeb3React();

  const userOnCorrectNetwork = chainId === expectedChainId;

  if (!account) {
    return -1;
  }
  if (account && userOnCorrectNetwork) {
    return 1;
  }
  return 0;
};

export default useWalletConnected;
