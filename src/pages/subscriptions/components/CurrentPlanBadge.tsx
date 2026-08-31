import clsx from 'clsx';
import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { selectAccountSubscription } from 'src/selectors/account';
import { selectSubscriptionModalSettings } from 'src/selectors/subscriptionModal';
import { useSelector } from 'src/store';
import { getPlanColor } from 'src/utils/getPlanColor';

export const useStyles = makeStyles((theme) =>
  createStyles({
    free: {
      background: getPlanColor('free'),
    },
    advanced: {
      background: getPlanColor('advanced'),
    },
    enterprise: {
      background: getPlanColor('enterprise'),
    },
    badge: {
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      fontSize: 9,
      marginRight: -6,
      textTransform: 'capitalize',
    },
  }),
);

export const CurrentPlanBadge: FC = (props) => {
  const classes = useStyles();
  const currentPlan = useSelector(selectAccountSubscription);
  const planDetails = useSelector(selectSubscriptionModalSettings)?.find(
    (d) => d.identifier === currentPlan.subscription,
  );
  if (!planDetails) return <>{props.children}</>;
  return (
    <Badge
      classes={{
        badge: clsx({
          [classes.badge]: true,
          [classes[planDetails.name]]: true,
        }),
      }}
      badgeContent={String(planDetails.name).substr(0, 5)}
      color="secondary"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {props.children}
    </Badge>
  );
};
