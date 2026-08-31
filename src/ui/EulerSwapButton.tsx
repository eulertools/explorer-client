import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import { useModal } from 'src/components/modal';
import { SwapperDialog } from 'src/components/modal/dialogs/SwapperDialog';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import { hexToRGB } from 'src/utils/stringUtils';

interface EulerSwapButtonProps {
  size?: 'small' | 'medium' | 'large';
  iconButton?: boolean;
  swapTokenFrom?: string;
  swapTokenTo?: string;
}

export const EulerSwapButton: FC<EulerSwapButtonProps> = ({
  size = 'large',
  iconButton = false,
  swapTokenFrom,
  swapTokenTo,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { showModal } = useModal();
  const anchorRef = useRef(null);

  const onSwapButtonClick = () => {
    gtm.push({
      event: 'clicked_assets_swap_token',
      category: 'Assets',
      action: 'clicked assets swap token',
    });
    const swapperDialog = showModal(SwapperDialog, {
      onClose: () => {
        swapperDialog.hide();
        navigate({
          pathname: location.pathname,
        });
      },
      showPageTitle: false,
    });
    if (swapTokenFrom || swapTokenTo) {
      navigate({
        pathname: location.pathname,
        search: `?${new URLSearchParams({
          from: swapTokenFrom || '',
          to: swapTokenTo || '',
        }).toString()}`,
      });
    }
  };

  if (iconButton) {
    return (
      <Tooltip title="Swap" placement="bottom">
        <IconButton
          ref={anchorRef}
          onClick={onSwapButtonClick}
          sx={{
            '&:hover': {
              opacity: 0.5,
            },
          }}
        >
          <SwapVertOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      variant="contained"
      onClick={onSwapButtonClick}
      sx={{
        marginRight: `10px`,
        marginLeft: `10px`,
        padding: size === 'small' ? `${theme.spacing(1)} 12px` : `10px ${theme.spacing(3)}`,
        color: theme.palette.primary.main,
        fontSize: size === 'small' ? '13px' : theme.spacing(2),
        fontWeight: 600,
        borderRadius: '10px',
        boxShadow: 'none',
        background: settings.theme === 'DARK' ? theme.palette.background.paper : 'rgba(232, 234, 254, 1)',
        '&:hover': {
          background:
            settings.theme === 'DARK' ? hexToRGB(theme.palette.background.paper, 0.5) : 'rgba(232, 234, 254, 0.75)',
          boxShadow: 'none',
        },
      }}
    >
      {t('Swap')}
    </Button>
  );
};
