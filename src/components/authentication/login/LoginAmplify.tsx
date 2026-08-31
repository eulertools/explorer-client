import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import React, { FC, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import FormikEmailInput from 'src/components/authentication/FormikEmailInput';
import VerifyTotpCode from 'src/components/authentication/mfa/VerifyTotpCode';
import { EMFATypes } from 'src/contexts/AmplifyContext';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import FormikPasswordInput from 'src/ui/FormikPasswordInput';
import { loggerException } from 'src/utils/logger';
import { ELoginErrors } from 'src/utils/login';

enum ELoginSteps {
  LOGIN = 'LOGIN',
  TOTP = 'TOTP',
}

interface LoginAmplifyProps {
  onLoginSuccess: () => void;
  onRegisterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onForgotPasswordClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onWalletConnect: () => void;
  onLoginVerifyCode?: (email: string) => void;
}

const LoginAmplify: FC<LoginAmplifyProps> = ({
  onRegisterClick,
  onForgotPasswordClick,
  onLoginSuccess,
  onWalletConnect,
  onLoginVerifyCode,
}) => {
  const classes = useAuthenticationStyles();
  const isMountedRef = useIsMountedRef();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    settings: { language },
  } = useSettings();
  const { login, confirmLogin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<ELoginSteps>(ELoginSteps.LOGIN);

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  };

  const validationSchema = useMemo(() => {
    Yup.object().shape({
      email: Yup.string().email(t('EMAIL_FORMAT_INVALID')).required(t('Email is required.')),
      password: Yup.string().min(7).max(255).required(t('Password is required.')),
    });
  }, [language]);

  const onCancelCodeVerification = () => {
    setCurrentStep(ELoginSteps.LOGIN);
  };

  const onFinishLoginFlow = (email: string) => {
    enqueueSnackbar(`Welcome back ${email}`, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 2500,
      variant: 'success',
    });
    gtm.push({ event: 'user_login_success', category: 'Login/Signup', action: 'User login successfully' });
    onLoginSuccess();
  };

  const onVerifyCode = async (code: string) => {
    const user = await confirmLogin(code, EMFATypes.TOTP);

    onFinishLoginFlow(user.email);
  };

  const onSubmit = useCallback(
    async (values, { setErrors, setStatus, setSubmitting, setFieldValue }): Promise<void> => {
      try {
        await login(values.email, values.password);

        if (isMountedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }

        onFinishLoginFlow(values.email);
      } catch (err) {
        if (err.code === ELoginErrors.NEEDS_TOTP) {
          setFieldValue('password', '');
          setCurrentStep(ELoginSteps.TOTP);
          return;
        }

        if (err.code === 'UserNotConfirmedException') {
          if (location.pathname === '/authentication/login') {
            navigate('/authentication/verify-code', {
              state: {
                email: values.email,
              },
            });
            return;
          }
          onLoginVerifyCode(values.email);
        }

        loggerException(err);

        if (isMountedRef.current) {
          const message = err.message.replace('Username', 'Email').replace('username', 'email');
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
          gtm.push({ event: 'user_login_failure', category: 'Login/Signup', action: 'User login failed' });
        }
      }
    },
    [],
  );

  const eventPush = () => {
    gtm.push({ event: 'user_click_login_button', category: 'Login/Signup', action: 'User clicked login button' });
  };

  return (
    <>
      <Box display={currentStep === ELoginSteps.LOGIN ? 'initial' : 'none'}>
        <Formik
          validateOnBlur={false}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
            <form noValidate onSubmit={handleSubmit}>
              <FormikEmailInput required autoFocus onWalletConnect={onWalletConnect} />
              <FormikPasswordInput
                required
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                label={t('Password')}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
              />
              <Box textAlign="right" marginBottom={4}>
                <Typography color="textPrimary" fontSize="14px">
                  <Link href="#" onClick={onForgotPasswordClick} fontWeight="bold">
                    {t('Forgot Password')}
                  </Link>
                </Typography>
              </Box>

              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
              <Box mt={2} maxWidth={160} marginX="auto">
                <Button
                  fullWidth
                  color="primary"
                  disabled={isSubmitting}
                  onClick={eventPush}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {t('LOG IN')}
                </Button>
              </Box>
              <Box position="relative">
                <Divider className={classes.divider} />
                <Typography className={classes.dividerLabel} color="textPrimary" fontSize="14px" component="div">
                  OR
                </Typography>
              </Box>
              <Box mt={2} maxWidth={140} marginX="auto">
                <Button
                  fullWidth
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  variant="outlined"
                  onClick={onRegisterClick}
                >
                  {t('REGISTER')}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {currentStep === ELoginSteps.TOTP ? (
        <VerifyTotpCode
          onCancelFlow={onCancelCodeVerification}
          onVerifyCode={onVerifyCode}
          submitButtonLabelKey="Submit"
        />
      ) : null}
    </>
  );
};

export default LoginAmplify;
