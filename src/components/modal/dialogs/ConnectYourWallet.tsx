import { useWeb3React } from '@web3-react/core';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { supportedChains } from 'src/types/blockchain';
import { getConnectorSrc } from 'src/utils/avatar';
import { metamaskWallet, walletConnect } from 'src/utils/connectWallet';
import { setNetwork } from 'src/utils/network';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...(props as any)} />);

const useStyles = makeStyles((theme) => ({
  content: {
    minWidth: 350,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
  },
  dialogTitle: {
    position: 'relative',
    textAlign: 'center',
  },
  dialogCloseIcon: {
    position: 'absolute',
    top: 4,
    right: 6,
  },
  metamaskLogo: {
    height: 48,
    width: 'auto',
    marginBottom: theme.spacing(2),
  },
  paperContainer: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    transition: 'transform 0.15s ease-in-out',

    '&:hover': {
      transform: 'scale3d(1.05, 1.05, 1)',
    },
  },
}));

interface IProps extends DialogProps {
  onCancel: () => void;
  onWalletConnected?: () => void;
  propsNetwork?: string;
}

const ConnectYourWallet: React.FC<IProps> = ({ onCancel, onWalletConnected, propsNetwork, ...dialogProps }) => {
  const classes = useStyles();
  const { activate } = useWeb3React();
  let { network: paramNetwork } = useParams();
  if (!paramNetwork) {
    if (propsNetwork) {
      paramNetwork = propsNetwork;
    } else {
      // If param network not present, get it from settings (localstorage)
      paramNetwork = getSelectedNetworkFromLocalstorage();
    }
  }

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const dialogOptions: Partial<DialogProps> = React.useMemo(
    () =>
      isSmallScreen
        ? { fullScreen: true, TransitionComponent: Transition as any }
        : { maxWidth: 'xs', fullWidth: true },
    [isSmallScreen],
  );

  const network = supportedChains.find((n) => n.value === paramNetwork);

  const onWalletConnect = useCallback(async () => {
    await walletConnect(activate, onWalletConnected, network.chainId);
  }, [onWalletConnected, network]);

  const onMetamaskConnect = useCallback(async () => {
    await metamaskWallet(activate, onWalletConnected);
    const provider = window.ethereum;
    if (provider) {
      await setNetwork(paramNetwork);
    }
  }, [onWalletConnected]);

  return (
    <Dialog {...dialogProps} {...dialogOptions} onClose={onCancel}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography color="textPrimary" component="span" fontSize={18} fontWeight={700}>
          Connect Your Wallet
        </Typography>
        <Box className={classes.dialogCloseIcon}>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="elevation"
              elevation={4}
              onClick={onMetamaskConnect}
              classes={{ root: classes.paperContainer }}
            >
              <img src={getConnectorSrc('metamask')} className={classes.metamaskLogo} alt="metamask" />
              <Typography color="textPrimary" component="span" fontSize={18} fontWeight={700}>
                Metamask
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="elevation"
              elevation={4}
              onClick={onWalletConnect}
              classes={{ root: classes.paperContainer }}
            >
              <img src={getConnectorSrc('walletconnect')} className={classes.metamaskLogo} alt="wallet-connect" />
              <Typography color="textPrimary" component="span" fontSize={18} fontWeight={700}>
                WalletConnect
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectYourWallet;
