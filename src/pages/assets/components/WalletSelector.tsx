import clsx from 'clsx';
import { FC, useState, useContext, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { AssetsContext, TrackedAddress } from 'src/pages/assets/AssetsContext';
import { TrackedAddressesTable } from 'src/pages/assets/components/TrackedAddressesTable';
import { WalletManagement } from 'src/pages/assets/components/WalletManagement';
import { hexToRGB, isAddress, shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiPaper-root': {
      borderRadius: '20px 20px 0 0',
    },
  },
  buttons: {
    width: 'auto',
    borderRadius: '10px',
    padding: `8px ${theme.spacing(3)}`,
    color: theme.palette.primary.main,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
  buttonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.5)',
    },
  },
  buttonDark: {
    background: theme.palette.background.default,
    '&:hover': {
      background: hexToRGB(theme.palette.background.default, 0.5),
    },
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const WalletSelector: FC = () => {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const classes = useStyles();
  const { selectedAddress, isDemo } = useContext(AssetsContext);

  const [openManageDialog, setOpenManageDialog] = useState(false);

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const addressText = useMemo(
    () => (address: TrackedAddress, size?: number) => {
      if (!isAuthenticated && selectedAddress) return shortAddress(address?.address);
      if (isDemo) return shortAddress(address?.address);
      if (isAddress(address?.name)) return shortAddress(address?.address);
      if (address?.name.length > (size + 1 || 15)) return `${address?.name.slice(0, size || 14)}...`;
      return address?.name;
    },
    [selectedAddress.address],
  );

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onManageWalletsClick = () => {
    setOpenManageDialog((prev) => !prev);
    setOpen(false);
  };

  return (
    <>
      <Button
        className={clsx(classes.buttons, settings.theme === 'DARK' ? classes.buttonDark : classes.buttonLight)}
        fullWidth
        size="large"
        variant="contained"
        onClick={handleToggle}
      >
        {selectedAddress?.address ? addressText(selectedAddress, 14) : '--'}
      </Button>
      <SwipeableDrawer
        className={clsx(classes.drawer, { [classes.hidden]: hidden })}
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={handleToggle}
      >
        <TrackedAddressesTable isMobile setHidden={setHidden} />
      </SwipeableDrawer>
      {/* Needed to allow WalletManagement to consume AssetsContext properly */}
      {openManageDialog ? <WalletManagement open onClose={onManageWalletsClick} /> : null}
    </>
  );
};

export default WalletSelector;
