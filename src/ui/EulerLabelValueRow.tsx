import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Separator } from 'src/ui/Separator';
import { TruncatedTooltipText } from './TruncatedTooltipText';

interface EulerLabelValueRowProps {
  label: string;
  value: number | React.ReactNode;
  showSeparator?: boolean;
}

export const EulerLabelValueRow = (props: EulerLabelValueRowProps) => {
  const { label, value, showSeparator = true } = props;
  return (
    <>
      <Box display="grid" gridTemplateColumns="50% 50%" marginX={1}>
        <Box>
          <Typography fontWeight={600} fontSize={13}>
            {label}
          </Typography>
        </Box>
        <Box>
          <Box display="grid" justifyContent="flex-end">
            <TruncatedTooltipText value={value} />
          </Box>
        </Box>
      </Box>
      {showSeparator ? <Separator /> : null}
    </>
  );
};
