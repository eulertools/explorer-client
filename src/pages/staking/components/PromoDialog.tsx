import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { EulerCheckbox } from 'src/ui/EulerCheckbox';

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pointer: {
    cursor: 'pointer',
  },
  closeButton: {
    minWidth: 160,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: theme.typography.h2.fontSize,
  },
  dialogDescriptionHeader: {
    fontSize: theme.typography.h5.fontSize,
  },
}));

export const DISMISS_LOCALSTORAGE_KEY = 'staking-dismiss';

interface IProps extends DialogProps {
  onClose: () => void;
  airdropEligible: boolean;
}

const PromoDialog: React.FC<IProps> = ({ onClose, airdropEligible, ...rest }) => {
  const classes = useStyles();

  const [dismissDialog, setDismissDialog] = React.useState<boolean>(false);

  function onCloseDialog() {
    onClose();
  }

  function toggleCheckbox() {
    setDismissDialog((cur) => !cur);
  }

  function handleDismissDialog() {
    if (dismissDialog) {
      localStorage.setItem(DISMISS_LOCALSTORAGE_KEY, 'true');
    }

    onCloseDialog();
  }

  return (
    <Dialog
      {...rest}
      onClose={onCloseDialog}
      maxWidth="sm"
      aria-labelledby="promo-dialog-title"
      aria-describedby="promo-dialog-description"
      fullWidth
    >
      <DialogTitle color="textPrimary" id="promo-dialog-title">
        <Typography className={classes.dialogTitle} fontWeight={700}>
          Stake & Earn
        </Typography>
      </DialogTitle>
      <DialogContent id="promo-dialog-description">
        <DialogContentText>
          <Typography color="textPrimary" component="span" fontWeight={700} className={classes.dialogDescriptionHeader}>
            Put your $EULER to work and earn rewards
          </Typography>
        </DialogContentText>
        <DialogContentText color="textPrimary">
          Every 16th of the month, 150k $EULER airdrop will be shared amongst the wallets that stake 40k+ tokens. All
          you need to do is to stake before the 15th of the month at 23:59:59 UTC.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button className={classes.closeButton} variant="contained" onClick={handleDismissDialog} color="primary">
          {airdropEligible ? 'Close' : 'Start Staking'}
        </Button>
        <Box display="flex" alignItems="center" onClick={toggleCheckbox}>
          <EulerCheckbox checked={dismissDialog} />
          <Typography color="textSecondary" variant="caption" className={classes.pointer}>
            Never show this dialog again
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PromoDialog;
