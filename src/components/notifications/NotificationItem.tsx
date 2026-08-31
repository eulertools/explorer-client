import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import WidgetsIcon from '@material-ui/icons/Widgets';
import { Notification, NotificationType } from 'src/types/notification';

const useStyles = makeStyles((theme) =>
  createStyles({
    menuIcon: {
      color: '#ffffff',
    },
    itemTitle: {
      fontWeight: 600,
      color: theme.palette.text.secondary,
    },
  }),
);

const typeTitleMap = (t) => ({
  [NotificationType.ALERT]: t('Notifications.ALERT'),
  [NotificationType.SUBSCRIPTION]: t('Notifications.SUBSCRIPTION'),
  [NotificationType.BUG]: t('Notifications.BUG'),
  [NotificationType.WALLET]: t('Notifications.WALLET'),
  [NotificationType.ADDRESS]: t('Notifications.ADDRESS'),
  [NotificationType.TOKEN]: t('Notifications.TOKEN'),
});

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: FC<NotificationItemProps> = (props: NotificationItemProps) => {
  const classes = useStyles();
  const { notification } = props;
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} md={3}>
        {notification.item_type === NotificationType.ALERT && (
          <Fab color="primary" size="small">
            <TrendingUpRoundedIcon className={classes.menuIcon} />
          </Fab>
        )}
        {notification.item_type === NotificationType.SUBSCRIPTION && (
          <Fab color="primary" size="small">
            <AttachMoneyRoundedIcon className={classes.menuIcon} />
          </Fab>
        )}
        {notification.item_type === NotificationType.BUG && (
          <Fab color="primary" size="small">
            <BugReportRoundedIcon className={classes.menuIcon} />
          </Fab>
        )}
        {notification.item_type === NotificationType.WALLET && (
          <Fab color="primary" size="small">
            <AccountBalanceWalletIcon className={classes.menuIcon} />
          </Fab>
        )}
        {notification.item_type === NotificationType.ADDRESS && (
          <Fab color="primary" size="small">
            <WidgetsIcon className={classes.menuIcon} />
          </Fab>
        )}
      </Grid>
      <Grid item xs={9} md={9}>
        <span className={classes.itemTitle}>{typeTitleMap(t)[notification.item_type]}</span>
        <br />
        {t(`Notifications.${notification.item_msg?.text}`)}
      </Grid>
    </Grid>
  );
};

export default NotificationItem;
