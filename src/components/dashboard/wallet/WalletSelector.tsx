import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { useEffect, useCallback, FC, MutableRefObject, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Tooltip, useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useModal } from 'src/components/modal';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import WalletMenuDialog from 'src/components/modal/dialogs/WalletMenuDialog';
import { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import gtm from 'src/lib/gtm';
import { supportedChains } from 'src/types/blockchain';
import { setNetwork } from 'src/utils/network';
import { shortAddress, hexToRGB } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  walletDisconnectButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  buttons: {
    width: '180px',
    whiteSpace: 'nowrap',
    padding: '4px 16px',
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    '&:hover': {
      backgroundColor: hexToRGB(theme.palette.primary.main, 0.04),
    },
    '& .MuiButton-startIcon': {
      marginRight: '10px',
    },
  },
  mobileButtons: {
    width: '100%',
    whiteSpace: 'nowrap',
    borderRadius: theme.spacing(2),
    '& .MuiButton-endIcon': {
      marginLeft: '10px',
    },
  },
  startIcon: {
    marginRight: theme.spacing(2),
    '& > svg:nth-of-type(1)': {
      fontSize: '30px',
    },
  },
  endIcon: {
    cursor: 'pointer',
    borderRadius: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(104, 142, 255, 0.3)',
    },
  },
  mobileEndIcon: {
    cursor: 'pointer',
    marginLeft: 'auto',
    borderRadius: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(104, 142, 255, 0.3)',
    },
  },
  hoverToolTip: {
    borderRadius: '4px',
  },
}));

interface IWalletSelectorProps {
  mobileWallet?: MutableRefObject<boolean>;
}

const WalletSelector: FC<IWalletSelectorProps> = memo(({ mobileWallet }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showModal } = useModal();
  let { network: paramNetwork } = useParams();

  if (!paramNetwork) {
    // If param network not present, get it from settings (localstorage)
    paramNetwork = getSelectedNetworkFromLocalstorage();
  }

  const { enqueueSnackbar } = useSnackbar();
  const { active, account, chainId, deactivate } = useWeb3React();

  const onUnlinkAnonymousWallet = async () => {
    deactivate();
    window.localStorage.removeItem(`wc${account}`);
    if (isMobile && mobileWallet) mobileWallet.current = true;
    enqueueSnackbar('Wallet disconnected', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 1500,
      variant: 'info',
      style: { marginTop: '46px' },
    });
  };

  const network = supportedChains.find((n) => n.value === paramNetwork);

  const onWrongWalletNetwork = useCallback(async () => {
    const provider = window.ethereum;
    if (provider) {
      await setNetwork(paramNetwork);
    }
  }, [account, active, network]);

  const signAnonymousWallet = async () => {
    if (!active || !account) {
      gtm.push({
        event: 'connect_wallet',
        category: 'Wallet',
        action: 'User click to try connect their wallet',
      });

      const connectWalletModal = showModal(ConnectYourWallet, {
        onWalletConnected: async () => {
          connectWalletModal.hide();
          if (chainId !== network.chainId) {
            await onWrongWalletNetwork();
          }
        },
        onCancel: () => {
          connectWalletModal.hide();
        },
      });
    } else if (chainId !== network.chainId) {
      await onWrongWalletNetwork();
    }
  };

  const onWalletDetails = async () => {
    const walletDetailsModal = showModal(WalletMenuDialog, {
      onClose: () => {
        walletDetailsModal.hide();
      },
      onDisconnect: () => onUnlinkAnonymousWallet(),
    });
  };

  useEffect(() => {
    const checkMobileWallet = mobileWallet?.current === undefined ? true : mobileWallet.current;

    if (account && chainId === network.chainId && checkMobileWallet) {
      enqueueSnackbar(`Connected to ${shortAddress(account)}`, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 1500,
        variant: 'success',
        style: { marginTop: '46px' },
      });

      // eslint-disable-next-line no-inner-declarations
      function fireEventAndStoreInLocalStorage() {
        gtm.push({
          event: 'connect_wallet_success',
          category: 'Wallet',
          action: 'User connected wallet to site',
          wallet_address: account,
        });

        window.localStorage.setItem(`wc${account}`, JSON.stringify({ time: Date.now() }));
      }

      const walletConnectedEvent = window.localStorage.getItem(`wc${account}`);

      if (walletConnectedEvent) {
        try {
          const parsedValue = JSON.parse(walletConnectedEvent);
          const time = new Date(parsedValue.time);

          if (time.getTime() < Date.now() - 60 * 60 * 24 * 1000) {
            fireEventAndStoreInLocalStorage();
          }
        } catch {
          // Swallow
        }
      } else {
        fireEventAndStoreInLocalStorage();
      }

      if (isMobile && mobileWallet) {
        mobileWallet.current = false;
      }
    }
  }, [account, active, network]);

  // Streamlined a single Button view for both Mobile and Browser Views
  return account && active && chainId === network.chainId ? (
    <Button
      fullWidth={isMobile}
      disableRipple
      classes={{ startIcon: classes.startIcon, endIcon: isMobile ? classes.mobileEndIcon : classes.endIcon }}
      className={`${isMobile ? classes.mobileButtons : classes.buttons} ${classes.walletDisconnectButton}`}
      size="large"
      variant="outlined"
      startIcon={
        <Tooltip
          title={network.chainName}
          classes={{
            tooltip: classes.hoverToolTip,
          }}
        >
          <img alt="network-logo" width="20px" height="auto" src={network.iconSrc} />
        </Tooltip>
      }
      endIcon={<CloseIcon onClick={onUnlinkAnonymousWallet} />}
      onClick={onWalletDetails}
    >
      <b>{account.slice(0, account.length - 35)}...</b>
    </Button>
  ) : (
    <Button
      fullWidth={isMobile}
      classes={{ startIcon: classes.startIcon }}
      className={isMobile ? classes.mobileButtons : classes.buttons}
      size="large"
      variant="outlined"
      onClick={signAnonymousWallet}
      startIcon={
        <Tooltip
          title={network.chainName}
          classes={{
            tooltip: classes.hoverToolTip,
          }}
        >
          <img alt="Logo" width="20px" src={network.iconSrc} />
        </Tooltip>
      }
    >
      {t('Connect Wallet')}
    </Button>
  );
});

export default WalletSelector;
