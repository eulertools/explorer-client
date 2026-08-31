import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

interface ITokenPriceVariationProps {
  percentage: number;
  currentPrice: number;
  showVariation?: boolean;
  showIcon?: boolean;
}

export const TokenPriceVariation: FC<ITokenPriceVariationProps> = ({
  percentage,
  currentPrice,
  showVariation = false,
  showIcon = false,
}) => {
  const theme = useTheme();

  const priceVariation = new BigNumber(100).minus(percentage).multipliedBy(currentPrice).dividedBy(100).toNumber();

  if (percentage === 0) {
    return (
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '17px',
        }}
      >
        {`0% ${showVariation ? `($${priceVariation})` : ''}`}
      </Typography>
    );
  }
  if (percentage < 0) {
    return (
      <Typography
        sx={{
          color: theme.palette.error[700],
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '17px',
        }}
      >
        {`${showIcon ? '▼' : ''} ${percentage}% ${showVariation ? `($${priceVariation})` : ''}`}
      </Typography>
    );
  }
  if (percentage > 0) {
    return (
      <Typography
        sx={{
          color: theme.palette.success[800],
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '17px',
        }}
      >
        {`${showIcon ? '▲' : ''} ${percentage}% ${showVariation ? `($${priceVariation})` : ''}`}
      </Typography>
    );
  }
  return (
    <Typography
      sx={{
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '17px',
      }}
    >
      0%
    </Typography>
  );
};
