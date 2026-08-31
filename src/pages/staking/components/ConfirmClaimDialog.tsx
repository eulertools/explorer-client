import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import SnackbarService from 'src/utils/snackbar';
import { EMetamaskErrors, IWeb3ContractsGrouped } from './shared';

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
  contractsInformation: IWeb3ContractsGrouped;
}

const ConfirmClaimDialog: React.FC<IProps> = ({ onCancel, contractsInformation, ...dialogProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { account } = useWeb3React();

  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const onClaimRewards = React.useCallback(async () => {
    try {
      setIsClaiming(true);

      await contractsInformation.staking.methods.claim().send({ from: account });

      onCancel();
    } catch (error) {
      let errorMessage = 'Unknown error, please try again.';

      if (error.code === EMetamaskErrors.USER_DENIED_TRANSACTION) {
        errorMessage = 'You cancelled the token claim';
      }

      SnackbarService.error(errorMessage, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 3500,
      });
    } finally {
      setIsClaiming(false);
    }
  }, [contractsInformation]);

  return (
    <Dialog {...dialogProps} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        <Typography color="textPrimary" component="span" fontSize={18} fontWeight={700}>
          Claim EULER Rewards
        </Typography>
        <Box className={classes.dialogCloseIcon}>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography color="textPrimary" variant="body2">
          Remember that claiming your rewards will RESET the clock, locking your staked amount for another month.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={isClaiming} onClick={onCancel} color="primary" autoFocus>
          {t('Cancel')}
        </Button>
        <Button disabled={isClaiming} onClick={onClaimRewards} color="primary">
          {t('CLAIM')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmClaimDialog;
