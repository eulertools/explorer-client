import clsx from 'clsx';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import { useModal } from 'src/components/modal';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import { hexToRGB } from 'src/utils/stringUtils';
import { TransakDialog } from '../components/modal/dialogs/TransakDialog';

const useStyles = makeStyles((theme) => ({
  transakButton: {
    marginRight: `20px`,
    marginLeft: `20px`,
    padding: `10px ${theme.spacing(3)}`,
    color: theme.palette.primary.main,
    fontSize: theme.spacing(2),
    fontWeight: 600,
    borderRadius: '10px',
    boxShadow: 'none',
  },
  transakButtonSmall: {
    padding: `${theme.spacing(1)} 12px`,
    color: theme.palette.primary.main,
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '10px',
    boxShadow: 'none',
  },
  transakButtonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.75)',
      boxShadow: 'none',
    },
  },
  transakButtonDark: {
    background: theme.palette.background.paper,
    '&:hover': {
      background: hexToRGB(theme.palette.background.paper, 0.5),
      boxShadow: 'none',
    },
  },
  iconButton: {
    '&:hover': {
      opacity: 0.5,
    },
  },
}));

interface EulerTransakButtonProps {
  size?: 'small' | 'medium' | 'large';
  iconButton?: boolean;
}

export const EulerTransakButton: FC<EulerTransakButtonProps> = ({ size = 'large', iconButton = false }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { settings } = useSettings();
  const { showModal } = useModal();
  const anchorRef = useRef(null);

  const onTransakButtonClick = () => {
    gtm.push({
      event: 'clicked_transak_buy_button',
      category: 'Transak',
      action: 'clicked transak dialog button',
    });
    const transakperDialog = showModal(TransakDialog, {
      onClose: () => {
        transakperDialog.hide();
      },
    });
  };

  if (iconButton) {
    return (
      <Tooltip title="Transak" placement="bottom">
        <IconButton className={classes.iconButton} ref={anchorRef} onClick={onTransakButtonClick}>
          <SwapVertOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      className={clsx(
        size === 'small' ? classes.transakButtonSmall : classes.transakButton,
        settings.theme === 'DARK' ? classes.transakButtonDark : classes.transakButtonLight,
      )}
      variant="contained"
      onClick={onTransakButtonClick}
    >
      {t('Buy crypto')}
    </Button>
  );
};
