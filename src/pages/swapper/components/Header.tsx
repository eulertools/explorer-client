import { EulerIconRefresh2, EulerIconSetting2 } from '@eulertools/ui';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import gtm from 'src/lib/gtm';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';
import SettingsDialog from './Settings';

const SwapperHeader: FC = () => {
  const { t } = useTranslation();
  const classes = swapperStyles();

  const { updateReloadCount } = useContext(SwapperContext);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [reloadDisabled, setReloadDisabled] = React.useState<boolean>(false);

  const [count, setCount] = useState(30);

  function onSettingsClick() {
    setShowModal(true);
    gtm.push({ event: 'user_click_settings', category: 'Swapper', action: 'User click settings' });
  }

  function onCloseSettingsModal() {
    gtm.push({ event: 'user_set_swap_settings', category: 'Swapper', action: 'User set swap settings' });
    setShowModal(false);
  }

  function onRefreshClick() {
    // Updates the price
    updateReloadCount();

    setReloadDisabled(true);

    // Disables the refresh button for 3 seconds
    setTimeout(() => {
      setReloadDisabled(false);
    }, 3000);

    // Sets count back to 30 seconds
    setCount(30);
  }

  useEffect(() => {
    // Sets an interval of 1 sec
    const timer = setInterval(() => {
      setCount(count - 1);
      // When count is 0 updates the price of the transaction and restarts the counter
      if (count === 0) {
        onRefreshClick();
      }
    }, 1000);

    return () => {
      // Clears the interval when unmounts
      clearInterval(timer);
    };
  });

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: '22px',
            color: (theme) => (theme as any).palette.neutral[700],
          }}
        >
          {t('Swap')}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              lineHeight: '15px',
              color: (theme) => (theme as any).palette.neutral[400],
            }}
          >
            {t(`Refresh in ${count}`)}
          </Typography>
          <IconButton
            disabled={reloadDisabled}
            className={classes.headerIconButton}
            aria-label="refresh-icon"
            onClickCapture={() => {
              onRefreshClick();
              gtm.push({ event: 'user_click_refresh', category: 'Swapper', action: 'User click refresh' });
            }}
            style={{ backgroundColor: 'transparent' }}
            title="Refresh"
            sx={{
              '& span > svg': {
                height: '20px',
                width: '20px',
              },
            }}
          >
            <EulerIconRefresh2 size="m" colorLight="terciary-700" colorDark="terciary-700" />
          </IconButton>
          <IconButton
            title="Advanced settings"
            className={classes.headerIconButton}
            aria-label="settings-icon"
            onClickCapture={onSettingsClick}
            sx={{
              '& span > svg': {
                height: '20px',
                width: '20px',
              },
            }}
          >
            <EulerIconSetting2 size="m" colorLight="terciary-700" colorDark="terciary-700" />
          </IconButton>
        </Box>
      </Box>
      {showModal ? <SettingsDialog open onClose={onCloseSettingsModal} /> : null}
    </>
  );
};

export default SwapperHeader;
