import { ExtendedTheme } from '@eulertools/ui';
import React, { memo } from 'react';
import Chip from '@material-ui/core/Chip';
import { useTheme } from '@material-ui/core/styles';

interface IInOutChipProps {
  isOut: boolean;
}

const InOutChip = memo(({ isOut }: IInOutChipProps) => {
  const theme = useTheme();
  return (
    <Chip
      style={{
        background: isOut ? ((theme as unknown) as ExtendedTheme).eulerActionSofter : theme.palette.secondary[50],
        fontWeight: 600,
      }}
      label={isOut ? 'Out' : 'In'}
    />
  );
});

export default InOutChip;
