import { useWeb3React } from '@web3-react/core';
import { FC, useEffect, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { EChainIds } from 'src/hooks/useMetamaskAccount';
import useWalletConnected from 'src/hooks/useWalletConnected';
import { PortfolioCreateIcon } from 'src/icons/PortfolioCreate';
import { supportedChains } from 'src/types/blockchain';
import { useModal } from './modal';
import ConnectYourWallet from './modal/dialogs/ConnectYourWallet';

const useStyles = makeStyles((theme) => ({
  spanWallet: {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
}));

interface WalletRequiredGuardProps {
  chain?: EChainIds;
  onCancel?: () => void;
  onWalletConnected?: () => void;
}

export const WalletRequiredGuard: FC<WalletRequiredGuardProps> = ({
  chain = EChainIds.BSC_MAINNET,
  children,
  onCancel,
  onWalletConnected,
}) => {
  const classes = useStyles();
  const { active, chainId } = useWeb3React();
  const walletConnected = useWalletConnected(chain);

  const { showModal } = useModal();
  const chainData = useMemo(() => supportedChains.find((n) => n.chainId === chain), [chainId, chain]);

  // Eagerly try to switch to correct network
  useEffect(() => {
    if (active && walletConnected === 0) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        // chainId must be in hexadecimal numbers
        // 0x38 | 56 = BNB
        // 0x61 | 97 = BNB Testnet
        params: [{ chainId: chainData?.chainHex }],
      });
    }
  }, [walletConnected]);

  useEffect(() => {
    if (!active || walletConnected === -1) {
      const connectWalletModal = showModal(ConnectYourWallet, {
        onWalletConnected: () => {
          if (onWalletConnected) {
            onWalletConnected();
          }
          connectWalletModal.hide();
        },
        onCancel: () => {
          if (onCancel) {
            onCancel();
          }
          connectWalletModal.hide();
        },
      });
    }
  }, [active, walletConnected]);

  if (walletConnected === -1) {
    return null;
  }

  if (active && walletConnected === 0) {
    return (
      <Box display="grid" justifyContent="center" alignItems="center" height="100%" paddingRight={4}>
        <Box display="flex" alignItems="center" flexDirection="row">
          <PortfolioCreateIcon />
          <Box display="grid" justifyContent="center">
            <Typography color="textPrimary" fontWeight={600} fontSize="1.5rem">
              Please switch to the <br /> correct network in <br />{' '}
              <span className={classes.spanWallet}>your wallet</span>.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};
