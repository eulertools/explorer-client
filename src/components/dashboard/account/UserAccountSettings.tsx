import { ExtendedTheme } from '@eulertools/ui';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
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
import { loggerError } from 'src/utils/logger';

const UserAccountSettings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateAccount } = useAuth();

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={t('Account')} />
      <Formik
        enableReinitialize
        initialValues={{
          email: user.email || '',
          given_name: user.given_name || '',
          family_name: user.family_name || '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email(t('EMAIL_FORMAT')),
          given_name: Yup.string().max(255),
          family_name: Yup.string().max(255),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
          try {
            await updateAccount({
              email: values.email,
              given_name: values.given_name,
              family_name: values.family_name,
            });

            setStatus({ success: true });
            setSubmitting(false);

            enqueueSnackbar(t('Account updated'), {
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
          <form onSubmit={handleSubmit}>
            <Grid container px={2} mt={1} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email ? errors.email : ''}
                  label={t('Email Address')}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(touched.given_name && errors.given_name)}
                  fullWidth
                  helperText={touched.given_name && errors.given_name}
                  label={t('First Name')}
                  name="given_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.given_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(touched.family_name && errors.family_name)}
                  fullWidth
                  helperText={touched.family_name && errors.family_name}
                  label={t('Last Name')}
                  name="family_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.family_name}
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
                disabled={isSubmitting || !dirty}
                type="submit"
                variant="text"
                sx={{
                  boxShadow: 'none',
                  borderRadius: theme.spacing(1),
                  background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
                }}
              >
                {t('Save changes')}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default UserAccountSettings;
