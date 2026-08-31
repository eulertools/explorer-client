import { ExtendedTheme } from '@eulertools/ui';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
import useAuth from 'src/hooks/useAuth';
import FormikPasswordInput from 'src/ui/FormikPasswordInput';
import { loggerError } from 'src/utils/logger';

const AccountSecuritySettings: FC = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { changePassword } = useAuth();

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={t('Password')} />
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          oldPassword: '',
          password: '',
          passwordConfirm: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required(t('Required')),
          password: Yup.string().min(8, t('PASSWORD_MIN')).max(255).required(t('Required')),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password'), null], t('PASSWORD_MATCH'))
            .required(t('Required')),
        })}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
          try {
            await changePassword(values.oldPassword, values.password);

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);

            enqueueSnackbar('Password updated', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top',
              },
              variant: 'success',
            });
          } catch (err) {
            loggerError(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, dirty }): JSX.Element => (
          <form onSubmit={handleSubmit} {...props}>
            <Grid container px={2} mt={1} spacing={2}>
              <Grid item xs={12} pt={2}>
                <FormikPasswordInput
                  required
                  margin="none"
                  label={t('Current Password')}
                  name="oldPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.oldPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <FormikPasswordInput
                  required
                  margin="none"
                  label={t('New Password')}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  margin="none"
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
              </Grid>
            </Grid>
            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                color="primary"
                disabled={isSubmitting || !dirty}
                type="submit"
                variant="text"
                sx={{
                  boxShadow: 'none',
                  borderRadius: theme.spacing(1),
                  background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
                }}
              >
                {t('Change password')}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default AccountSecuritySettings;
