import orderBy from 'lodash/orderBy';
import unionBy from 'lodash/unionBy';
import { FC, useEffect, useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import WebsocketsContextProvider, { ChannelMessage } from 'src/contexts/WebsocketsContext';
import useAuth from 'src/hooks/useAuth';
import slice, { getNotifications, updateNotifications } from 'src/slices/user/notifications';
import { useDispatch, useSelector } from 'src/store';
import { Notification } from 'src/types/notification';
import NotificationItem from './NotificationItem';

const useStyles = makeStyles(() =>
  createStyles({
    iconButton: {
      padding: '8.14px 6px',
    },
    menuIcon: {
      color: '#ffffff',
    },
    menu: {
      minWidth: '360px',
    },
  }),
);

const NotificationsMenu: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const { notifications: initialNotifications = [], error = null } = useSelector((state) => state.notifications);
  const { notifications: notificationsChannel = [] } = useSelector((state) => state.channels);
  const { t } = useTranslation();

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const isMenuVisible = useMemo(() => Boolean(notifAnchorEl), [notifAnchorEl]);
  const notifications = useMemo(
    () =>
      orderBy(
        unionBy(
          notificationsChannel.map((msg: ChannelMessage) => msg.payload),
          initialNotifications,
          'identifier',
        ),
        ['created_at'],
        ['desc'],
      ),
    [initialNotifications, notificationsChannel],
  );
  const hasUnread = useMemo(() => notifications.find((notif: Notification) => !notif.item_read), [notifications]);

  // update read state
  useEffect(() => {
    let readInterval;

    if (isMenuVisible && hasUnread && !readInterval) {
      readInterval = setTimeout(() => {
        dispatch(updateNotifications(notifications));
      }, 3000);
    }

    return () => {
      if (readInterval) {
        clearTimeout(readInterval);
      }
    };
  }, [isMenuVisible, hasUnread]);

  return (
    <>
      <IconButton onClick={handleNotifClick} className={classes.iconButton}>
        <NotificationsOutlinedIcon fontSize="small" color={(hasUnread && 'primary') || 'disabled'} />
      </IconButton>
      <Menu
        className={classes.menu}
        anchorEl={notifAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        open={isMenuVisible}
        onClose={handleNotifClose}
      >
        <Typography variant="h6" ml={2}>
          {t('Notifications.title')}
        </Typography>
        <Divider />
        {notifications &&
          notifications.map((notification: Notification) => (
            <div key={notification.identifier}>
              <MenuItem className={classes.menu} disabled={notification.item_read}>
                <NotificationItem notification={notification} />
              </MenuItem>
              <Divider />
            </div>
          ))}
        {!error && notifications.length === 0 && <MenuItem>{t('Notifications.empty')}</MenuItem>}
        {error && (
          <MenuItem>
            <Typography>{t('Wrong')}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const NotificationsWrapper = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { urls } = useContext(ConfigurationContext);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotifications());
    }

    return () => {
      dispatch(slice.actions.setNotifications([]));
    };
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <WebsocketsContextProvider uri={urls.ws}>
      <NotificationsMenu />
    </WebsocketsContextProvider>
  ) : (
    <></>
  );
};

export default NotificationsWrapper;
