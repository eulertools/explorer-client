import { Formik } from 'formik';
import * as Yup from 'yup';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import FormikPasswordInput from 'src/ui/FormikPasswordInput';
import { loggerError } from 'src/utils/logger';
import FormikEmailInput from '../FormikEmailInput';

const useStyles = makeStyles((theme) =>
  createStyles({
    formErrorText: {
      fontWeight: 700,
    },
    unList: {
      paddingLeft: theme.spacing(2),

      '& > li': {
        padding: theme.spacing(0.5, 0),
      },
    },
  }),
);

interface RegisterAmplifyProps {
  onSignupSuccess?: () => void;
  onRegisterVerifyEmail?: (email: string) => void;
  onWalletConnect: () => void;
}

const RegisterAmplify: FC<RegisterAmplifyProps> = ({ onRegisterVerifyEmail, onWalletConnect, onSignupSuccess }) => {
  const isMountedRef = useIsMountedRef();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    settings: { language },
  } = useSettings();
  const { register } = useAuth();
  const { t } = useTranslation();
  const classes = useStyles();

  const initialValues = {
    email: '',
    password: '',
    passwordConfirm: '',
    policy: false,
    submit: null,
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().email(t('EMAIL_FORMAT_INVALID')).required(t('Email is required.')),
        password: Yup.string()
          .min(7, t('The password must contain at least 8 characters'))
          .max(255, t('The password must have a maximum of 255 characters'))
          .matches(/^(?=.*[A-Z])/, t('The password must have at least one uppercase'))
          .matches(/^(?=.*[0-9])/, t('The password must have at least one number'))
          .required(t('Password is required')),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required(t('You have to confirm your password')),
        policy: Yup.boolean().oneOf([true], t('ACCEPT_TOSUA')),
      }),
    [language],
  );

  const onSubmit = useCallback(async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
    try {
      await register(values.email, values.password, values.email);

      if (onSignupSuccess) {
        onSignupSuccess();
      }

      gtm.push({ event: 'user_register_finish', category: 'Login/Signup', action: 'User Signup Success' });

      if (values.email) {
        if (location.pathname === '/authentication/register') {
          navigate('/authentication/verify-code', {
            state: {
              email: values.email,
            },
          });
          return;
        }
        onRegisterVerifyEmail(values.email);
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

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <FormikEmailInput required autoFocus onWalletConnect={onWalletConnect} />
          <ul className={classes.unList}>
            <li>
              <Typography color="textPrimary" variant="body2">
                Must contain at least 8 characters
              </Typography>
            </li>
            <li>
              <Typography color="textPrimary" variant="body2">
                At least 1 upper case letter (A-Z)
              </Typography>
            </li>
            <li>
              <Typography color="textPrimary" variant="body2">
                At least 1 number (0-9)
              </Typography>
            </li>
          </ul>
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
          <Box marginTop={3}>
            <TextField
              fullWidth
              required
              error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
              helperText={touched.passwordConfirm && errors.passwordConfirm}
              label={t('Password Confirmation')}
              name="passwordConfirm"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.passwordConfirm}
              variant="outlined"
            />
          </Box>

          <Box display="flex" alignItems="center" ml={-1} mt={2}>
            <Checkbox checked={values.policy} color="primary" name="policy" onChange={handleChange} />
            <Typography color="textSecondary" variant="body2">
              {t('ACCEPT_TC_TEXT')}{' '}
              <Link
                color="primary"
                component="a"
                href="/legal/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('Terms and Conditions')}
              </Link>
            </Typography>
          </Box>
          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error className={classes.formErrorText}>
              {errors.policy}
            </FormHelperText>
          )}
          {errors.submit && (
            <Box marginTop={3}>
              <FormHelperText error className={classes.formErrorText}>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box marginTop={2}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              {t('REGISTER')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default RegisterAmplify;
