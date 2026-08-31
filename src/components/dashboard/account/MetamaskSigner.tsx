import { useWeb3React } from '@web3-react/core';
import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import HelpOutline from '@material-ui/icons/HelpOutline';
import MetamaskLogo from 'src/assets/MetaMask.png';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import { injected } from 'src/hooks/useMetamaskAccount';
import { EulerError } from 'src/ui/EulerError';
import { loggerError } from 'src/utils/logger';

const SIGNATURE_CANCEL_CODE = 4001;

interface IProps {
  onSignSuccess?: () => void;
}

export default function Metamasksigner({ onSignSuccess }: IProps) {
  const { t } = useTranslation();
  const { account, activate, library, chainId } = useWeb3React();
  const { user, updateAccount } = useAuth();
  const [flowStarted, setFlowStarted] = useState<boolean>(false);
  const { chain } = useContext(ConfigurationContext);

  const signAsPrimaryWallet = async () => {
    if (!flowStarted) {
      setFlowStarted(true);
    }

    // If we already enabled the app then just sign (domain enabled)
    if (account) {
      const signer = library.getSigner(account);

      // 1) Inside it will call Web3.utils.fromUtf8 so don't need to encode it
      // 2) It's promisified
      try {
        const signResponse = await signer.signMessage(
          'Please sign this message to confirm this is your primary wallet for Euler.tools',
        );

        // Once we have the signature, then store the user wallet address
        if (signResponse) {
          // Amplify will save the user custom attribute to Cognito
          await updateAccount({ 'custom:wallet_hash': account });

          onSignSuccess?.();
        } else {
          // If for some reason we don't get the signature hash fail
          throw new Error('Failed to sign the message');
        }
      } catch (error) {
        // Don't log if it was just a cancel action
        if (error.code === SIGNATURE_CANCEL_CODE) {
          return;
        }

        loggerError(error);
      } finally {
        setFlowStarted(false);
      }
    }

    // If not, first enable our domain
    activate(injected);
  };

  useEffect(() => {
    if (account && flowStarted) {
      signAsPrimaryWallet();
    }

    return () => setFlowStarted(false);
  }, [account]);

  return chainId !== chain.bsc.chain_id ? (
    <Box textAlign="center" display="grid" alignItems="center" gridTemplateColumns="1fr auto" columnGap={1}>
      <Box pt={1}>
        <EulerError error="You need switch to Build and Build (BNB) network" />
      </Box>
      <IconButton
        href="https://docs.binance.org/smart-chain/wallet/metamask.html#connect-your-metamask-with-binance-smart-chain"
        target="_blank"
      >
        <HelpOutline />
      </IconButton>
    </Box>
  ) : (
    <Box>
      {account && user && user.wallet_hash ? (
        user.wallet_hash
      ) : (
        <Box maxWidth={150} margin="auto">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<img src={MetamaskLogo} alt="metamask" />}
            onClick={signAsPrimaryWallet}
          >
            {t('CONNECT')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
