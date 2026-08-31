import React from 'react';
import { DialogContentText, DialogTitle } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export const DISMISS_LOCALSTORAGE_KEY = 'promo-dismiss-delphi-2';

interface IProps extends DialogProps {
  onClose: () => void;
}

const DismissableDialog: React.FC<IProps> = ({ onClose, ...rest }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onMoreOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function onCloseDialog() {
    onClose();
  }

  function handleDismissDialog() {
    setAnchorEl(null);
    localStorage.setItem(DISMISS_LOCALSTORAGE_KEY, 'true');
    onCloseDialog();
  }

  const open = Boolean(anchorEl);

  return (
    <Dialog {...rest} onClose={onCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        Making a better User Experience in Euler Tools - Part II
        <Box position="absolute" right={8} top={8}>
          <IconButton
            aria-label="more"
            id="more-button"
            aria-controls="more-menu"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={onMoreOptionsClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="more-menu"
            MenuListProps={{
              'aria-labelledby': 'more-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem key="dismiss" onClick={handleDismissDialog}>
              Don&lsquo;t show again
            </MenuItem>
            <MenuItem key="close" onClick={onCloseDialog}>
              Close
            </MenuItem>
          </Menu>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="textPrimary" pb={1}>
          We want to hear some more from you! If you already participated in the first round of questions please refrain
          from answering this one (and thanks a lot for your support!).
        </DialogContentText>
        <DialogContentText fontWeight={700} pb={1}>
          <Link href="https://forms.gle/fNQaJgQyLUDntakWA" rel="noopener noreferrer" target="_blank">
            &gt; English Questionnaire
          </Link>
        </DialogContentText>
        {/* <DialogContentText fontWeight={500}>
          <Link href="https://forms.gle/viyd7KLj8Sgp262h8" rel="noopener noreferrer" target="_blank">
            Spanish
          </Link>
        </DialogContentText> */}
      </DialogContent>
    </Dialog>
  );
};

export default DismissableDialog;
