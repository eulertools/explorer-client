import { FC } from 'react';
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SwapperWrapper from 'src/pages/swapper';

const useStyles = makeStyles((theme) => ({
  dialog: {
    width: '100%',
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

interface SwapperDialogProps extends DialogProps {
  onClose: () => void;
  showPageTitle?: boolean;
}

export const SwapperDialog: FC<SwapperDialogProps> = ({ onClose, showPageTitle, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog {...rest} classes={{ paper: classes.dialog }} onClose={onCloseDialog} maxWidth="sm" fullWidth={!isMobile}>
      <DialogContent className={classes.dialogContent}>
        <SwapperWrapper showPageTitle={showPageTitle} />
      </DialogContent>
    </Dialog>
  );
};
