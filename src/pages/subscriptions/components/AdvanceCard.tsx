import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import UndoIcon from '@material-ui/icons/Undo';
import { selectAccountSubscription } from 'src/selectors/account';
import { selectSubscriptionModalSettings } from 'src/selectors/subscriptionModal';
import { openModal, UIModal } from 'src/slices/ui/globalModal';
import { UserSubscriptionType } from 'src/slices/user/account';
import { setSelectedPlan } from 'src/slices/user/subscriptionModal';
import { useSelector } from 'src/store';
import { subscriptionConfig } from '../config';
import { useStyles } from '../styles';
import { CardRow } from './CardRow';
import { advanceConfig } from './advanceConfig';

export const AdvanceCard: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleClick = React.useCallback(() => {
    dispatch(setSelectedPlan(UserSubscriptionType.advanced));
    dispatch(
      openModal({
        type: UIModal.subscription,
        identifier: 'modal-subscription-basic',
      }),
    );
  }, []);
  const currentPlan = useSelector(selectAccountSubscription);
  const planDetails = useSelector(selectSubscriptionModalSettings).find(
    (d) => d.name === UserSubscriptionType.advanced,
  );
  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Box
            style={{
              background: 'linear-gradient(90deg, #77DBF3 0%, #AEEFFE 100%)',
            }}
            className={classes.topBG}
          />
          <Box className={classes.header}>
            <Box className={classes.title} style={{ color: '#77DBF3' }}>
              {t('SUBSCRIPTIONS.ADVANCED.TITLE')}
            </Box>
            <Box className={classes.price}>${subscriptionConfig.advanced.price.holder} USD/MO*</Box>
            <Box className={classes.info}>
              *
              {t('SUBSCRIPTIONS.ADVANCED.1_FOR_USERS_EULER', {
                hold_limit: subscriptionConfig.advanced.eulerLimit,
              })}
            </Box>
            <Box className={classes.sale}>else ${subscriptionConfig.advanced.price.notHolder} USD/MO</Box>
            <Box className={classes.desc}>{t('SUBSCRIPTIONS.ADVANCED.DESCRIPTION')}</Box>
          </Box>
          <Box className={classes.details}>
            <Box display="flex" alignItems="center">
              <UndoIcon className={classes.undoIcon} />
              {t('SUBSCRIPTIONS.ALL_PREVIOUS_FEATURES')}
            </Box>
            <CardRow config={advanceConfig} subscriptionValues={planDetails} />
          </Box>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {currentPlan.subscription === planDetails.identifier ? (
            <Typography>Current Plan</Typography>
          ) : (
            <Button
              variant="contained"
              className={`${classes.selectButton}`}
              style={{ backgroundColor: '#77dbf3' }}
              onClick={handleClick}
            >
              {t('SUBSCRIPTIONS.SUBSCRIBE_BTN')}
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};
