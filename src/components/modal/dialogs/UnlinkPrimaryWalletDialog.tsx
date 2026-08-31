import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import useAuth from 'src/hooks/useAuth';
import { loggerError } from 'src/utils/logger';

const useStyles = makeStyles(() => ({
  dialogTitle: {
    position: 'relative',
    textAlign: 'center',
  },
  dialogCloseIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}));

interface IProps extends DialogProps {
  onCancel: () => void;
}

const UnlinkPrimaryWalletDialog: React.FC<IProps> = ({ onCancel, ...dialogProps }) => {
  const classes = useStyles();
  const { updateAccount } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [unlinking, setUnlinking] = useState<boolean>(false);

  async function onUnlinkWallet() {
    try {
      setUnlinking(true);

      await updateAccount({ 'custom:wallet_hash': '' });

      enqueueSnackbar('Primary wallet unlinked', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 1500,
        variant: 'success',
      });

      onCancel();
    } catch (error) {
      loggerError(error);
      enqueueSnackbar('Error unlinking your wallet', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 1500,
        variant: 'error',
      });
    } finally {
      setUnlinking(false);
    }
  }

  return (
    <Dialog {...dialogProps} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        <Typography color="textPrimary" component="span" fontSize={18} fontWeight={700}>
          Unlink Your Wallet
        </Typography>
        <Box className={classes.dialogCloseIcon}>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography color="textPrimary" variant="body2">
          Are you sure you want to unlink you primary wallet?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={unlinking} onClick={onCancel} color="primary" autoFocus>
          Cancel
        </Button>
        <Button disabled={unlinking} onClick={onUnlinkWallet} color="primary">
          Unlink
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnlinkPrimaryWalletDialog;
