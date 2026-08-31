import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import AuthButton from 'src/components/authentication/AuthButton';
import Metamasksigner from 'src/components/dashboard/account/MetamaskSigner';
import useAuth from 'src/hooks/useAuth';
import { SubscriptionModalConfirmation } from 'src/pages/subscriptions/modal/SubscriptionModalConfirmation';
import { SubscriptionModalPayment } from 'src/pages/subscriptions/modal/SubscriptionModalPayment';
import { SubscriptionModalSubscription } from 'src/pages/subscriptions/modal/SubscriptionModalSubscription';
import { selectSubscriptionModal } from 'src/selectors/subscriptionModal';
import { GlobalModalItem } from 'src/slices/ui/globalModal';
import { nextStepSubscriptionModal, prevStepSubscriptionModal } from 'src/slices/user/subscriptionModal';
import { EulerModalContent } from '../components/EulerModalContent';
import { EulerModalFooter } from '../components/EulerModalFooter';
import { EulerModalTitle } from '../components/EulerModalTitle';

export const EulerModalSubscription = (props: GlobalModalItem) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const modal = useSelector(selectSubscriptionModal);
  const handleNext = React.useCallback(() => {
    dispatch(nextStepSubscriptionModal());
  }, []);

  const handleBack = React.useCallback(() => {
    dispatch(prevStepSubscriptionModal());
  }, []);
  const { user } = useAuth();
  const { account } = useWeb3React();
  const requireLogin = !user || !user.wallet_hash;

  return (
    <Box>
      <EulerModalTitle
        layout="center"
        modal={props}
        title={modal.selectedPlan ? modal.selectedPlan : 'Select a plan'}
        showAddress={false}
      />
      <EulerModalContent>
        <Box minWidth="690px">
          {!requireLogin ? (
            <>
              <Stepper activeStep={modal.step} alternativeLabel>
                {modal.steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {modal.step === 0 ? <SubscriptionModalSubscription /> : null}
              {modal.step === 1 ? <SubscriptionModalPayment /> : null}
              {modal.step === 2 ? <SubscriptionModalConfirmation /> : null}
            </>
          ) : (
            <Box display="grid" gridTemplateRows="80px auto" alignItems="center" justifyContent="center">
              {user && !account ? (
                <>
                  <Typography variant="subtitle2">{t('SUBSCRIPTIONS.CONNECT_YOUR_WALLET_TO_CONTINUE')}</Typography>
                  <Metamasksigner />
                </>
              ) : (
                <>
                  <Typography variant="subtitle2">Login or Register to continue</Typography>
                  <AuthButton variant="contained" />
                </>
              )}
            </Box>
          )}
        </Box>
      </EulerModalContent>
      <EulerModalFooter
        showClose={false}
        modal={props}
        leftAction={
          modal.step === 1 ? (
            <Button variant="outlined" color="primary" onClick={handleBack}>
              {t('SUBSCRIPTIONS.MODAL.BACK_BTN')}
            </Button>
          ) : null
        }
      >
        {!requireLogin && modal.step !== 2 ? (
          <Box display="grid" justifyContent="center">
            <Button
              disabled={
                typeof modal.eulerHolder !== 'boolean' || !modal.selectedPlan || (modal.step === 1 && !modal.tx)
              }
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              {t('SUBSCRIPTIONS.MODAL.CONTINUE_BTN')}
            </Button>
          </Box>
        ) : null}
      </EulerModalFooter>
    </Box>
  );
};
