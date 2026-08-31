import md5 from 'md5';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import LogoutIcon from '@material-ui/icons/LogoutOutlined';
import PersonIcon from '@material-ui/icons/PersonOutline';
import useAuth from 'src/hooks/useAuth';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import gtm from 'src/lib/gtm';
import { CurrentPlanBadge } from 'src/pages/subscriptions/components/CurrentPlanBadge';
import { isAddress, shortAddress } from 'src/utils/stringUtils';

const GRAVATAR = '//www.gravatar.com/avatar/';

interface UserGravatarProps {
  size?: 'small' | 'medium' | 'large';
  withoutActions?: boolean;
  buttonAvatar?: boolean;
}

export const useStyles = makeStyles(() =>
  createStyles({
    menuitem: {
      padding: '0 4px',
      width: '100%',
    },
    text: {
      paddingLeft: '10px',
    },
    buttonAvatar: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }),
);

export const UserAvatar = (props: UserGravatarProps) => {
  const { size = 'small', withoutActions = false, buttonAvatar } = props;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const e = user?.email ? md5(user.email) : null;

  const s = React.useMemo(() => {
    if (size === 'small') return 30;
    if (size === 'medium') return 60;
    if (size === 'large') return 120;
    return 30;
  }, [size]);

  const username = isAddress(user?.email) ? shortAddress(user.email) : user?.email;

  const handleOpen = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleProfile = React.useCallback(() => {
    setAnchorEl(null);
    navigate('/user/account-settings');
  }, []);
  const handleLogout = React.useCallback(() => {
    setAnchorEl(null);
    navigate('/user/logout');
    gtm.push({ event: 'user_logout', category: 'Login/Signup', action: 'User logged out' });
  }, []);

  const content = React.useMemo(
    () =>
      !e ? (
        <Avatar
          style={{
            width: s,
            height: s,
            fontSize: 14,
            paddingBottom: 3,
            background: theme.palette.primary.dark,
          }}
        >
          {String(username).substr(0, 2)}
        </Avatar>
      ) : (
        <Avatar
          style={{
            width: s,
            height: s,
          }}
          src={`${GRAVATAR}${e}?d=retro&r=g&s=${s}`}
        />
      ),
    [username, e, s],
  );

  if (!isAuthenticated) return null;

  if (withoutActions) return content;

  return (
    <>
      {buttonAvatar ? (
        <Button
          className={classes.buttonAvatar}
          fullWidth
          variant="text"
          onClick={handleOpen}
          startIcon={
            <CurrentPlanBadge>
              <span>{content}</span>
            </CurrentPlanBadge>
          }
          endIcon={
            anchorEl ? (
              <ChevronUpIcon fontSize="large" color="inherit" />
            ) : (
              <ChevronDownIcon fontSize="large" color="inherit" />
            )
          }
        >
          {user?.email.length < 21 ? user?.email : `${user?.email.substr(0, 20)}...`}
        </Button>
      ) : (
        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpen}>
          <CurrentPlanBadge>
            <span>{content}</span>
          </CurrentPlanBadge>
        </IconButton>
      )}
      <Menu
        id="simple-menu"
        className={classes.menuitem}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon />
          <span className={classes.text}>{t('USER.MENU.PROFILE')}</span>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          <span className={classes.text}>{t('USER.MENU.LOGOUT')}</span>
        </MenuItem>
      </Menu>
    </>
  );
};
