import { useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { Box, TextField } from '@material-ui/core';

interface IProps {
  fullWidth?: boolean;
}

const FormikVerifyCodeInput = ({ fullWidth }: IProps) => {
  const itemsRef = useRef([]);
  const { setFieldValue, touched, errors, values, handleBlur } = useFormikContext<{ code: string[] }>();

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);
  }, []);

  return (
    <Box
      sx={{
        maxWidth: fullWidth ? '100%' : 350,
        marginX: 'auto',
        display: 'grid',
        columnGap: '16px',
        gridTemplateColumns: 'repeat(6, 1fr)',
        pt: 1,
        position: 'relative',
        marginBottom: 2,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((ref, i) => (
        <TextField
          error={Boolean(Array.isArray(touched.code) && touched.code.length === 6 && errors.code)}
          fullWidth
          inputRef={(el) => {
            itemsRef.current[i] = el;
          }}
          onChange={(e) => {
            const value = (e as any).nativeEvent.data;

            // pasting from device clipboard
            if (value.length > 1) {
              const pasteArray = value.split('');

              if (pasteArray.length !== 6) {
                return;
              }

              let valid = true;

              pasteArray.forEach((x) => {
                if (!Number.isInteger(parseInt(x, 10))) {
                  valid = false;
                }
              });

              if (valid) {
                setFieldValue('code', pasteArray);
                itemsRef.current[5].focus();
              }
            } else if (Number.isInteger(parseInt(value, 10))) {
              setFieldValue(`code[${i}]`, value);

              if (i < 5) {
                itemsRef.current[i + 1].focus();
              }
            }
          }}
          // eslint-disable-next-line react/no-array-index-key
          key={`code-${i}`}
          name={`code[${i}]`}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.code === 'ENTER' || event.code === 'Enter') {
              if (values.code[i]) {
                setFieldValue(`code[${i}]`, '');
                return;
              }

              if (i > 0) {
                setFieldValue(`code[${i}]`, '');
                itemsRef.current[i - 1].focus();
                return;
              }
            }

            if (event.code === 'Backspace' || event.code === 'Delete' || event.key === 'Backspace') {
              if (values.code[i]) {
                setFieldValue(`code[${i}]`, '');
              }

              if (i > 0) {
                itemsRef.current[i - 1].focus();
              }
            }
          }}
          onPaste={(event) => {
            const paste = (event.clipboardData || (window as any).clipboardData).getData('text');
            const pasteArray = paste.split('');
            if (pasteArray.length !== 6) {
              return;
            }

            let valid = true;

            pasteArray.forEach((x) => {
              if (!Number.isInteger(parseInt(x, 10))) {
                valid = false;
              }
            });

            if (valid) {
              setFieldValue('code', pasteArray);
              itemsRef.current[5].focus();
            }
          }}
          value={values.code[i]}
          sx={{
            display: 'inline-block',
            textAlign: 'center',
            '& .MuiInputBase-input': {
              textAlign: 'center',
            },
          }}
          variant="outlined"
          size={fullWidth ? 'medium' : 'small'}
          autoComplete="off"
        />
      ))}
    </Box>
  );
};

export default FormikVerifyCodeInput;
