/* eslint-disable @typescript-eslint/no-unused-vars */
import { EulerIconArrowSwapHorizontal } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import _isEqual from 'lodash/isEqual';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import useModal from 'src/components/modal/useModal';
import useSettings from 'src/hooks/useSettings';
import Migration from 'src/pages/migration/Migration';
import { hexToRGB } from 'src/utils/stringUtils';

interface ButtonMigrationProps {
  size?: 'small' | 'medium' | 'large';
  iconButton?: boolean;
}

export const ButtonMigration: FC<ButtonMigrationProps> = ({ size = 'large', iconButton = false }) => {
  const { active, account } = useWeb3React();
  const { showModal } = useModal();
  const { settings } = useSettings();
  const { t } = useTranslation();

  const openMigrationDialog = () => {
    const migrationModal = showModal(Migration, {
      type: 'dialog',
      onCloseDialog: () => {
        migrationModal.hide();
      },
    });
  };

  const handleClick = (event) => {
    event.stopPropagation();

    if (!active || !account) {
      const connectWalletModal = showModal(ConnectYourWallet, {
        onWalletConnected: () => {
          connectWalletModal.hide();
          openMigrationDialog();
        },
        onCancel: () => {
          connectWalletModal.hide();
        },
      });
      return;
    }

    openMigrationDialog();
  };

  if (iconButton) {
    return (
      <Tooltip title={t('Migration')}>
        <IconButton
          aria-label={t('Migrate your EULER')}
          onClick={handleClick}
          sx={{
            padding: 0,
            '&:hover': {
              opacity: 0.5,
            },
          }}
        >
          <EulerIconArrowSwapHorizontal size="l" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      variant="contained"
      onClick={handleClick}
      sx={{
        marginRight: `10px`,
        marginLeft: `10px`,
        padding: (theme) => (size === 'small' ? `${theme.spacing(1)} 12px` : `10px ${theme.spacing(3)}`),
        color: (theme) => theme.palette.primary.main,
        fontSize: (theme) => (size === 'small' ? '13px' : theme.spacing(2)),
        fontWeight: 600,
        borderRadius: '10px',
        boxShadow: 'none',
        background: (theme) => (settings.theme === 'DARK' ? theme.palette.background.paper : 'rgba(232, 234, 254, 1)'),
        '&:hover': {
          background: (theme) =>
            settings.theme === 'DARK' ? hexToRGB(theme.palette.background.paper, 0.5) : 'rgba(232, 234, 254, 0.75)',
          boxShadow: 'none',
        },
      }}
    >
      {t('Migrate')}
    </Button>
  );
};
