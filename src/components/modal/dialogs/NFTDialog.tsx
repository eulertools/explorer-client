import { FC } from 'react';
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
  dialog: {
    width: 'auto',
    height: '100%',
    borderRadius: theme.spacing(2),
    overflow: 'inherit',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: 'auto',
    },
  },
  cardMedia: {
    width: 'auto',
    height: 'inherit',
    margin: 'auto',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: 'auto',
    },
  },
}));

interface NFTDialogProps extends DialogProps {
  onClose: () => void;
  imageURL: string;
}

export const NFTDialog: FC<NFTDialogProps> = ({ onClose, imageURL, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog
      {...rest}
      classes={{ paper: classes.dialog }}
      onClose={onCloseDialog}
      onClick={onCloseDialog}
      maxWidth="md"
      fullWidth={!isMobile}
    >
      <CardMedia className={classes.cardMedia} component="img" image={imageURL} />
    </Dialog>
  );
};
