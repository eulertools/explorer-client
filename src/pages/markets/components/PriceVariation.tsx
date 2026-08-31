import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface IPriceVariationProps {
  price: number;
}

export const PriceVariation: FC<IPriceVariationProps> = ({ price }) => (
  <Box display="flex" flexDirection="column">
    <Typography
      sx={{
        color: (theme) => (theme as any).palette.terciary[700],
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '17px',
      }}
    >
      {`$${getBigNumberCurrencyLabel(price || 0)}`}
    </Typography>
  </Box>
);
