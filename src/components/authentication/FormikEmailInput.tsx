import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type IProps = TextFieldProps & {
  onWalletConnect: () => void;
};

const FormikEmailInput = ({ onWalletConnect, ...textFieldProps }: IProps) => {
  const { t } = useTranslation();
  const { errors, touched, handleBlur, handleChange, values } = useFormikContext<{ email: string }>();

  return (
    <>
      <TextField
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
        {...textFieldProps}
      />
    </>
  );
};

export default FormikEmailInput;
