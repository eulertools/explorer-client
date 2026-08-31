import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import { selectSubscriptionModalIsHolder, selectSubscriptionModalSelectedPlan } from 'src/selectors/subscriptionModal';
import { UserSubscriptionType } from 'src/slices/user/account';
import { setEulerHolder } from 'src/slices/user/subscriptionModal';
import { useDispatch } from 'src/store';
import { Separator } from 'src/ui/Separator';
import { subscriptionConfig } from '../config';
import { SubscribeBillingBox } from './SubscribeBillingBox';
import { useStyles } from './style';

export function SubscriptionModalSubscription() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isHolder = useSelector(selectSubscriptionModalIsHolder);
  const selectedPlan = useSelector(selectSubscriptionModalSelectedPlan);
  const handleSelection = React.useCallback((id) => {
    dispatch(setEulerHolder(id === 'holder'));
  }, []);
  return (
    <Box className={classes.stepBox}>
      <Typography>{t('SUBSCRIPTIONS.CHOOSE_BILLING_METHOD')}</Typography>
      <Separator />
      <Box display="grid" gridTemplateColumns="auto auto" columnGap={2} pt={4} pb={2}>
        <SubscribeBillingBox
          amount={`${subscriptionConfig[selectedPlan || UserSubscriptionType.free].price.notHolder}/MO`}
          checked={isHolder === false}
          id="non_holder"
          onClick={handleSelection}
        >
          <Typography variant="caption" pt={1}>
            with less than {subscriptionConfig[selectedPlan || UserSubscriptionType.free].eulerLimit} Euler
          </Typography>
        </SubscribeBillingBox>
        <SubscribeBillingBox
          amount={`${subscriptionConfig[selectedPlan || UserSubscriptionType.free].price.holder}/MO`}
          checked={isHolder}
          id="holder"
          onClick={handleSelection}
        >
          <Typography variant="caption" pt={1}>
            with more than +{subscriptionConfig[selectedPlan || UserSubscriptionType.free].eulerLimit} Euler
          </Typography>
        </SubscribeBillingBox>
      </Box>
      <Box display="grid" pt={3} justifyContent="center">
        <Typography variant="h4" fontStyle="italic" textAlign="center">
          OFF IF YOU STACK <br />+{subscriptionConfig[selectedPlan || UserSubscriptionType.free].eulerLimit} EULER
        </Typography>
      </Box>
    </Box>
  );
}
