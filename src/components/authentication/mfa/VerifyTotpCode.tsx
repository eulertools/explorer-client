import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { Box, Button, FormHelperText, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import FormikVerifyCodeInput from 'src/ui/FormikVerifyCodeInput';
import { loggerError } from 'src/utils/logger';

interface IProps {
  onCancelFlow: () => void;
  onVerifyCode: (code: string) => void;
  submitButtonLabelKey?: string;
}

const VerifyTotpCode = ({ onCancelFlow, onVerifyCode, submitButtonLabelKey = 'Activate' }: IProps) => {
  const [validationSchema] = useState(
    Yup.object().shape({
      code: isMobile ? Yup.string().length(6).required('') : Yup.array().length(6).of(Yup.string().required('')),
    }),
  );

  const isMountedRef = useIsMountedRef();
  const { t } = useTranslation();

  const onSubmit = useCallback(async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
    try {
      await onVerifyCode(isMobile ? values.code : values.code.join(''));

      if (isMountedRef.current) {
        setSubmitting(false);
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
      initialValues={{
        code: isMobile ? '' : ['', '', '', '', '', ''],
        submit: null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, handleSubmit, isSubmitting, touched, values, handleBlur, handleChange }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <Typography color="textSecondary" marginTop={2} variant="subtitle2" textAlign="center">
            {t('Verification code')}
          </Typography>
          <BrowserView>
            <FormikVerifyCodeInput />
            {Array.isArray(touched.code) && touched.code.length === 6 && errors.code ? (
              <FormHelperText error sx={{ mx: '14px' }}>
                {Array.isArray(errors.code) && (errors.code as string[]).find((x) => x !== undefined)}
              </FormHelperText>
            ) : null}
          </BrowserView>
          <MobileView>
            <TextField
              fullWidth
              error={!!(touched.code && errors.code)}
              key="code-mfa"
              name="code"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.code}
              sx={{
                display: 'inline-block',
                textAlign: 'center',
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                },
              }}
              variant="outlined"
              size="small"
              autoComplete="off"
            />
            {touched.code && errors.code ? (
              <FormHelperText error sx={{ mx: '14px' }}>
                {errors.code}
              </FormHelperText>
            ) : null}
          </MobileView>
          {errors.submit && (
            <Box marginTop={2}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box marginTop={2} maxWidth={200} marginX="auto">
            <Button fullWidth color="primary" disabled={isSubmitting} type="submit" variant="contained">
              {t(submitButtonLabelKey)}
            </Button>
            <Button fullWidth variant="text" onClick={onCancelFlow} sx={{ marginTop: 2 }}>
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default VerifyTotpCode;
