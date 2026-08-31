import { useWeb3React } from '@web3-react/core';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowLeft from '@material-ui/icons/KeyboardBackspace';
import { LoginAmplify } from 'src/components/authentication/login';
import { PasswordRecoveryAmplify } from 'src/components/authentication/password-recovery';
import { PasswordResetAmplify } from 'src/components/authentication/password-reset';
import { RegisterAmplify } from 'src/components/authentication/register';
import { VerifyEmailAmplify, VerifyCodeAmplify } from 'src/components/authentication/verify';
import gtm from 'src/lib/gtm';
import ConnectYourWallet from './ConnectYourWallet';

enum EAuthSteps {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  VERIFY_CODE = 'VERIFY_CODE',
}

export interface IFormFields {
  name: string;
  email: string;
  message: string;
}

interface AuthDialogProps extends DialogProps {
  onClose: () => void;
}

const AuthDialog: FC<AuthDialogProps> = ({ onClose, ...rest }) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const theme = useTheme();
  const [flowStep, setFlowStep] = useState<EAuthSteps>(EAuthSteps.LOGIN);
  const [showWalletConnect, setShowWalletConnect] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [verifyEmail] = useState<string>('');
  const [verifyCodeEmail, setVerifyCodeEmail] = useState<string>('');
  const isMobile = useMediaQuery(theme.breakpoints.down(450));

  useEffect(() => {
    if (account) {
      setShowWalletConnect(false);
    }
  }, [account]);

  const onCloseDialog = () => {
    onClose();
  };

  const onBackButtonClick = () => {
    if (flowStep === EAuthSteps.PASSWORD_RESET) {
      setFlowStep(EAuthSteps.PASSWORD_RECOVERY);
    } else {
      setFlowStep(EAuthSteps.LOGIN);
    }
  };

  const onRegisterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    gtm.push({ event: 'user_click_register_button', category: 'Login/Signup', action: 'User Register button click' });
    event.stopPropagation();
    event.preventDefault();
    setFlowStep(EAuthSteps.REGISTER);
  };

  const onWalletConnect = () => {
    setShowWalletConnect(true);
  };

  const onHideWalletConnect = () => {
    setShowWalletConnect(false);
  };

  const onForgotPasswordClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    gtm.push({ event: 'user_forgot_password', category: 'Login/Signup', action: 'User forgot password click' });
    event.stopPropagation();
    event.preventDefault();
    setFlowStep(EAuthSteps.PASSWORD_RECOVERY);
  };

  const onRecoverClick = (email: string) => {
    setResetEmail(email);
    setFlowStep(EAuthSteps.PASSWORD_RESET);
  };

  const onResetClick = () => {
    setFlowStep(EAuthSteps.LOGIN);
  };

  const onRegisterVerifyEmail = (email: string) => {
    setVerifyCodeEmail(email);
    setFlowStep(EAuthSteps.VERIFY_CODE);
  };

  const onEmailVerified = () => {
    setFlowStep(EAuthSteps.LOGIN);
  };

  const onCodeVerified = () => {
    setFlowStep(EAuthSteps.LOGIN);
  };

  const onLoginVerifyCode = (email: string) => {
    setVerifyCodeEmail(email);
    setFlowStep(EAuthSteps.VERIFY_CODE);
  };

  return (
    <>
      <Dialog {...rest} onClose={onCloseDialog} maxWidth="sm" fullWidth fullScreen={!!isMobile}>
        <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
          <Box display="flex" alignItems="center">
            {flowStep !== EAuthSteps.LOGIN ? (
              <Box>
                <IconButton onClick={onBackButtonClick}>
                  <ArrowLeft />
                </IconButton>
              </Box>
            ) : null}
            <Box flexGrow={1} textAlign="center" paddingLeft={flowStep !== EAuthSteps.LOGIN ? 0 : 3}>
              {flowStep === EAuthSteps.LOGIN ? t('LOGIN') : null}
              {flowStep === EAuthSteps.REGISTER ? t('REGISTER') : null}
              {flowStep === EAuthSteps.PASSWORD_RECOVERY ? t('PASSWORD RECOVERY') : null}
              {flowStep === EAuthSteps.PASSWORD_RESET ? t('PASSWORD RESET') : null}
              {flowStep === EAuthSteps.VERIFY_EMAIL ? t('VERIFY YOUR EMAIL') : null}
              {flowStep === EAuthSteps.VERIFY_CODE ? t('VERIFY CODE') : null}
            </Box>
            <Box>
              <IconButton onClick={onCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 24 }}>
          {flowStep === EAuthSteps.REGISTER ? (
            <RegisterAmplify onRegisterVerifyEmail={onRegisterVerifyEmail} onWalletConnect={onWalletConnect} />
          ) : null}
          {flowStep === EAuthSteps.LOGIN ? (
            <LoginAmplify
              onLoginSuccess={onCloseDialog}
              onRegisterClick={onRegisterClick}
              onForgotPasswordClick={onForgotPasswordClick}
              onWalletConnect={onWalletConnect}
              onLoginVerifyCode={onLoginVerifyCode}
            />
          ) : null}
          {flowStep === EAuthSteps.PASSWORD_RECOVERY ? (
            <PasswordRecoveryAmplify onRecoverClick={onRecoverClick} />
          ) : null}
          {flowStep === EAuthSteps.PASSWORD_RESET ? (
            <PasswordResetAmplify email={resetEmail} onResetClick={onResetClick} />
          ) : null}
          {flowStep === EAuthSteps.VERIFY_EMAIL ? (
            <VerifyEmailAmplify onEmailVerified={onEmailVerified} email={verifyEmail} />
          ) : null}
          {flowStep === EAuthSteps.VERIFY_CODE ? (
            <VerifyCodeAmplify onCodeVerified={onCodeVerified} email={verifyCodeEmail} />
          ) : null}
        </DialogContent>
      </Dialog>
      {showWalletConnect ? <ConnectYourWallet onCancel={onHideWalletConnect} {...rest} /> : null}
    </>
  );
};

export default AuthDialog;
