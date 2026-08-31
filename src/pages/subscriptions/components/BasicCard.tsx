import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { selectAccountSubscription } from 'src/selectors/account';
import { selectSubscriptionModalSettings } from 'src/selectors/subscriptionModal';
import { openModal, UIModal } from 'src/slices/ui/globalModal';
import { UserSubscriptionType } from 'src/slices/user/account';
import { setSelectedPlan } from 'src/slices/user/subscriptionModal';
import { useSelector } from 'src/store';
import { useStyles } from '../styles';
import { CardRow } from './CardRow';
import { basicConfig } from './basicConfig';

export const BasicCard: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClick = React.useCallback(() => {
    dispatch(setSelectedPlan(UserSubscriptionType.free));
    dispatch(
      openModal({
        type: UIModal.subscription,
        identifier: 'modal-subscription-advance',
      }),
    );
  }, []);
  const currentPlan = useSelector(selectAccountSubscription);
  const planDetails = useSelector(selectSubscriptionModalSettings).find((d) => d.name === UserSubscriptionType.free);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box
          style={{
            background: 'linear-gradient(46.19deg, #EA52F8 5.66%, #0066FF 94.35%)',
          }}
          className={classes.topBG}
        />
        <Box className={classes.header}>
          <Box className={classes.title} style={{ color: '#A1A6A7' }}>
            {t('SUBSCRIPTIONS.BASIC.TITLE')}
          </Box>
          <Box className={classes.price}>{t('SUBSCRIPTIONS.FREE')}</Box>
          <Box className={classes.desc}>{t('SUBSCRIPTIONS.BASIC.DESCRIPTION')}</Box>
        </Box>
        <Box className={classes.details}>
          <CardRow config={basicConfig} subscriptionValues={planDetails} />
        </Box>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {currentPlan.subscription === planDetails.identifier ? (
          <Typography>Current Plan</Typography>
        ) : (
          <Button
            variant="contained"
            className={`${classes.selectButton}`}
            style={{
              background: 'linear-gradient(46.19deg, #EA52F8 5.66%, #0066FF 94.35%)',
            }}
            onClick={handleClick}
          >
            {t('SUBSCRIPTIONS.SUBSCRIBE_BTN')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
