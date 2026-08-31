import BigNumber from 'bignumber.js';
import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useIntl } from 'src/hooks/useIntl';

interface IVoumeProps {
  volume: number;
  price: number;
  symbol: string;
}

export const Volume: FC<IVoumeProps> = ({ volume, price, symbol }) => {
  const intl = useIntl();

  const tokenVolume = new BigNumber(volume).dividedBy(price);

  return (
    <Box display="flex" flexDirection="column">
      <Typography
        sx={{
          color: (theme) => (theme as any).palette.terciary[700],
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '17px',
        }}
      >
        {`$ ${intl.formatNumber(new BigNumber(volume).toNumber(), {
          notation: 'compact',
          minimumSignificantDigits: 3,
          maximumSignificantDigits: 3,
        })}`}
      </Typography>
      <Typography
        sx={{
          color: (theme) => (theme as any).palette.terciary[700],
          fontWeight: 500,
          fontSize: '11px',
          lineHeight: '15px',
        }}
      >
        {`${intl.formatNumber(tokenVolume.toNumber(), {
          notation: 'compact',
          minimumSignificantDigits: 3,
          maximumSignificantDigits: 3,
        })} ${symbol}`}
      </Typography>
    </Box>
  );
};
