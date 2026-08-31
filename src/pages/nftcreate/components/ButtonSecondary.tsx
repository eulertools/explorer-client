// I think this component should go in the ui kit when everything is configured
import { ExtendedTheme } from '@eulertools/ui';
import { FC } from 'react';
import { Button, ButtonProps, useTheme } from '@material-ui/core';

export const ButtonSecondary: FC<ButtonProps> = ({ ...props }: ButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
        color: theme.palette.primary.main,
        boxShadow: theme.shadows[1],
        borderRadius: theme.spacing(1),
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          boxShadow: theme.shadows[1],
        },
      }}
    />
  );
};
