import { Formik } from 'formik';
import * as Yup from 'yup';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import { loggerError } from 'src/utils/logger';

interface PasswordRecoveryAmplifyProps {
  onRecoverClick?: (email: string) => void;
}

const PasswordRecoveryAmplify: FC<PasswordRecoveryAmplifyProps> = ({ onRecoverClick }) => {
  const isMountedRef = useIsMountedRef();
  const { passwordRecovery } = useAuth();
  const {
    settings: { language },
  } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    email: '',
    submit: null,
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().email(t('EMAIL_FORMAT_INVALID')).required(t('Email is required.')),
      }),
    [language],
  );

  const onSubmit = useCallback(async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
    try {
      await passwordRecovery(values.email);

      if (location.pathname === '/authentication/password-recovery') {
        navigate('/authentication/password-reset', {
          state: {
            email: values.email,
          },
        });
      } else {
        onRecoverClick(values.email);
      }
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
    gtm.push({
      event: 'user_view_forgot_password',
      category: 'Login/Signup',
      action: 'User viewed forgot password screen',
    });
  }, []);

  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label={t('Email')}
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            variant="outlined"
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={3}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              {t('RECOVER PASSWORD')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordRecoveryAmplify;
