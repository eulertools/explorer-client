import { useEulerTheme } from '@eulertools/ui';
import { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';

interface TitleFormProps {
  title: string;
  description: string;
}

export const TitleForm: FC<TitleFormProps> = (props: TitleFormProps) => {
  const theme: any = useEulerTheme();
  const { palette } = theme;
  const { settings } = useSettings();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      width="100%"
      color={theme.palette.text.secondary}
    >
      <Typography
        fontSize={20}
        fontWeight={600}
        color={settings.theme === 'light' ? palette.neutral[700] : palette.text.primary}
        mb={1}
      >
        {props.title}
      </Typography>
      <Typography
        fontSize={13}
        fontWeight={600}
        color={settings.theme === 'light' ? palette.neutral[600] : palette.text.secondary}
      >
        {props.description}
      </Typography>
    </Box>
  );
};
