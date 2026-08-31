import { FC } from 'react';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { TransakWidget } from '../../transak';

const useStyles = makeStyles((theme) => ({
  dialog: {
    width: '100%',
    padding: 0,
  },
  dialogContent: {
    padding: 0,
    background: theme.palette.background.paper,
    '& > div > div > div': {
      borderRadius: '0px !important',
      margin: 0,
    },
  },
}));

interface TransakDialogProps extends DialogProps {
  onClose: () => void;
}

export const TransakDialog: FC<TransakDialogProps> = ({ onClose, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog {...rest} classes={{ paper: classes.dialog }} onClose={onCloseDialog} maxWidth="sm" fullWidth={!isMobile}>
      <DialogContent className={classes.dialogContent}>
        <TransakWidget />
      </DialogContent>
    </Dialog>
  );
};
