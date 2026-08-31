import { Formik } from 'formik';
import * as Yup from 'yup';
import { FC, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import FormikVerifyCodeInput from 'src/ui/FormikVerifyCodeInput';
import { loggerError } from 'src/utils/logger';

interface VerifyCodeAmplifyProps {
  onCodeVerified?: () => void;
  email?: string;
}

type TLocationState = {
  email?: string;
};

const VerifyCodeAmplify: FC<VerifyCodeAmplifyProps> = ({ onCodeVerified, email }) => {
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { verifyCode } = useAuth();
  const {
    settings: { language },
  } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      email: (location.state as TLocationState)?.email || email,
      code: ['', '', '', '', '', ''],
      submit: null,
    }),
    [location.state, email],
  );

  const validationSchema = useMemo(() => {
    Yup.object().shape({
      email: Yup.string().email(t('EMAIL_FORMAT_INVALID')).required(t('Email is required.')),
      code: Yup.array().of(Yup.string().required('Verification code is required.')),
    });
  }, [language]);

  const onSubmit = useCallback(async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
    try {
      await verifyCode(values.email, values.code.join(''));

      if (location.pathname === '/authentication/verify-code') {
        navigate('/authentication/login');
        return;
      }
      onCodeVerified();
    } catch (err) {
      loggerError(err);
      if (isMountedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  }, []);

  useEffect(() => {
    gtm.push({ event: 'user_viewed_otp', category: 'Login/Signup', action: 'User viewed otp screen' });
  }, []);

  const eventPush = () => {
    gtm.push({ event: 'user_verified_otp', category: 'Login/Signup', action: 'User verify email success' });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          {!(location.state as TLocationState)?.email && !email ? (
            <TextField
              autoFocus
              fullWidth
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              label={t('Email')}
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              variant="outlined"
            />
          ) : (
            <TextField
              disabled
              fullWidth
              margin="normal"
              value={(location.state as TLocationState)?.email || email}
              variant="outlined"
            />
          )}
          <Typography color="textSecondary" variant="subtitle2" mb={2} mt={3}>
            {t('AUTHENTICATION.VERIFICATION_CODE')}
          </Typography>
          <FormikVerifyCodeInput />
          {Boolean(Array.isArray(touched.code) && touched.code.length === 6 && errors.code) && (
            <FormHelperText error sx={{ mx: '14px' }}>
              {Array.isArray(errors.code) && (errors.code as string[]).find((x) => x !== undefined)}
            </FormHelperText>
          )}
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={3}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={eventPush}
            >
              {t('VERIFY')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default VerifyCodeAmplify;
