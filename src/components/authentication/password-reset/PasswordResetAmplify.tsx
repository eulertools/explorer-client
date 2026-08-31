import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useMemo } from 'react';
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

interface PasswordResetAmplifyProps {
  onResetClick?: () => void;
  email?: string;
}

type TLocationState = {
  email?: string;
};

const PasswordResetAmplify: FC<PasswordResetAmplifyProps> = ({ onResetClick, email }) => {
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();
  const {
    settings: { language },
  } = useSettings();
  const { passwordReset } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = useMemo(
    () => ({
      code: ['', '', '', '', '', ''],
      email: (location.state as TLocationState)?.email || email,
      password: '',
      passwordConfirm: '',
      submit: null,
    }),
    [location.state, email],
  );

  const validationSchema = useMemo(() => {
    Yup.object().shape({
      code: Yup.array().of(Yup.string().required('Verification code is required.')),
      email: Yup.string().email(t('EMAIL_FORMAT_INVALID')).required(t('Email is required.')),
      password: Yup.string().min(7, 'Must be at least 7 characters.').max(255).required('Password is required.'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
        .required('Password confirmation is required.'),
    });
  }, [language]);

  const eventPush = () => {
    gtm.push({ event: 'user_clicked_reset_password', category: 'Login/Signup', action: 'User reset password click' });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          await passwordReset(values.email, values.code.join(''), values.password);

          enqueueSnackbar('Password reset was successful', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top',
            },
            autoHideDuration: 4000,
            variant: 'success',
          });
          gtm.push({
            event: 'user_reset_password_success',
            category: 'Login/Signup',
            action: 'User successfully reset password',
          });
          if (location.pathname === '/authentication/password-reset') {
            navigate('/authentication/login');
          } else {
            onResetClick();
          }
        } catch (err) {
          loggerError(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          {!(location.state as TLocationState)?.email && !email ? (
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
          ) : (
            <TextField
              disabled
              fullWidth
              margin="normal"
              value={(location.state as TLocationState)?.email || email}
              variant="outlined"
            />
          )}
          <Typography color="textSecondary" mb={2} mt={3} variant="subtitle2">
            {t('AUTHENTICATION.VERIFICATION_CODE')}
          </Typography>
          <FormikVerifyCodeInput fullWidth />
          {Boolean(Array.isArray(touched.code) && touched.code.length === 6 && errors.code) && (
            <FormHelperText error sx={{ mx: '14px' }}>
              {Array.isArray(errors.code) && errors.code.find((x) => x !== undefined)}
            </FormHelperText>
          )}
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label={t('Password')}
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
            fullWidth
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            label={t('Password Confirmation')}
            margin="normal"
            name="passwordConfirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.passwordConfirm}
            variant="outlined"
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={3}>
            <Button
              color="primary"
              disabled={isSubmitting}
              onClick={eventPush}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {t('RESET PASSWORD')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordResetAmplify;
