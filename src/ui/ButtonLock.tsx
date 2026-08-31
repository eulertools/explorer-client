import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';
import _isEqual from 'lodash/isEqual';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import LockingDialog from 'src/components/modal/dialogs/LockingDialog';
import useModal from 'src/components/modal/useModal';
import useSettings from 'src/hooks/useSettings';
import { LockToken } from 'src/types/locker';
import { hexToRGB } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  lockButton: {
    marginRight: `10px`,
    marginLeft: `10px`,
    padding: `10px ${theme.spacing(3)}`,
    color: theme.palette.primary.main,
    fontSize: theme.spacing(2),
    fontWeight: 600,
    borderRadius: '10px',
    boxShadow: 'none',
  },
  lockButtonSmall: {
    padding: `${theme.spacing(1)} 12px`,
    color: theme.palette.primary.main,
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '10px',
    boxShadow: 'none',
  },
  lockButtonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.75)',
      boxShadow: 'none',
    },
  },
  lockButtonDark: {
    background: theme.palette.background.paper,
    '&:hover': {
      background: hexToRGB(theme.palette.background.paper, 0.5),
      boxShadow: 'none',
    },
  },
  iconButton: {
    padding: 0,
    '&:hover': {
      opacity: 0.5,
    },
  },
  opened: {
    color: 'rgba(51, 103, 249, 95)',
  },
}));

export interface ButtonLockProps {
  token: LockToken;
  size?: 'small' | 'medium' | 'large';
  iconButton?: boolean;
}

export const ButtonLock = memo(
  ({ token, size = 'large', iconButton = false }: ButtonLockProps) => {
    const classes = useStyles();
    const { active, account } = useWeb3React();
    const { showModal } = useModal();
    const { settings } = useSettings();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const openStakeModal = () => {
      const stakeModal = showModal(LockingDialog, {
        onClose: () => {
          stakeModal.hide();
          setOpen(false);
        },
        token,
      });
    };

    const handleClick = (event) => {
      event.stopPropagation();

      if (!active || !account) {
        const connectWalletModal = showModal(ConnectYourWallet, {
          onWalletConnected: () => {
            connectWalletModal.hide();
            openStakeModal();
          },
          onCancel: () => {
            connectWalletModal.hide();
            setOpen(false);
          },
        });
        setOpen(true);
        return;
      }

      openStakeModal();
      setOpen(true);
    };

    if (iconButton) {
      return (
        <Tooltip title={t('Lock')}>
          <IconButton aria-label={t('Lock your Token')} onClick={handleClick} className={classes.iconButton}>
            {!open ? <LockOutlinedIcon /> : <LockIcon className={classes.opened} />}
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Button
        size={size}
        className={clsx(
          size === 'small' ? classes.lockButtonSmall : classes.lockButton,
          settings.theme === 'DARK' ? classes.lockButtonDark : classes.lockButtonLight,
        )}
        variant="contained"
        onClick={handleClick}
      >
        {t('Lock')}
      </Button>
    );
  },
  (prevProps, nextProps) => _isEqual(prevProps, nextProps),
);
