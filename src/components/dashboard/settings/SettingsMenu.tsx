import { themeEulerOptions } from '@eulertools/ui';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import useSettings from 'src/hooks/useSettings';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: '8.14px 6px',
  },
  menuIcon: {
    color: '#ffffff',
  },
  menu: {
    minWidth: '100px',
  },
}));

const SettingsMenu: FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { settings, saveSettings } = useSettings();

  const handleToggle = () => setOpen((prev) => !prev);

  const handleThemeChange = (theme: string) => {
    if (theme !== settings.theme) {
      handleToggle();
      const newSettings = {
        ...settings,
        theme,
      };
      saveSettings(newSettings);
    }
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle}>
        <SettingsIcon fontSize="small" />
      </IconButton>
      <Menu
        className={classes.menu}
        anchorEl={anchorRef.current}
        variant="menu"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        open={open}
        onClose={handleToggle}
      >
        <Typography variant="h6" ml={2}>
          {t('Theme')}
        </Typography>
        <Divider />
        {themeEulerOptions.map((theme) => (
          <MenuItem
            key={theme.key}
            className={classes.menu}
            selected={settings.theme === theme.key}
            onClick={() => handleThemeChange(theme.key)}
          >
            <Typography>{theme.label.toUpperCase()}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SettingsMenu;
