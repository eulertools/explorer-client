import { FC } from 'react';
import { TextField, TextFieldProps, useTheme } from '@material-ui/core';

export const InputFormik: FC<TextFieldProps> = ({ ...props }: TextFieldProps) => {
  const theme = useTheme();
  return (
    <TextField
      {...props}
      sx={{
        '& > .MuiOutlinedInput-root': {
          background: theme.palette.background.paper,
        },
        '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.disabled,
        },
      }}
    />
  );
};
