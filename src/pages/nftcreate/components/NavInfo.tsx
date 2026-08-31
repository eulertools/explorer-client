import { useEulerTheme } from '@eulertools/ui';
import { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/KeyboardArrowRight';
import useSettings from 'src/hooks/useSettings';

interface NavInfoProps {
  sections: string[];
}

export const NavInfo: FC<NavInfoProps> = (props: NavInfoProps) => {
  const theme: any = useEulerTheme();
  const { settings } = useSettings();
  const color = settings.theme === 'light' ? theme.palette.terciary[600] : theme.palette.text.secondary;
  return (
    <Box display="flex" gap={1}>
      {props.sections.map((title, index) => (
        <Box key={title} display="flex" gap={1} alignItems="center">
          <Typography fontSize={14} fontWeight={600} color={color}>
            {title}
          </Typography>
          {index !== props.sections.length - 1 ? <ArrowForwardIosIcon color="action" fontSize="medium" /> : null}
        </Box>
      ))}
    </Box>
  );
};
