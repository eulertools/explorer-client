import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface INFTCostsProps {
  price: string;
  priceUsd: string;
  gasBnb: number;
  gasUsd: number;
}

const NFTCosts: FC<INFTCostsProps> = ({ price, priceUsd, gasBnb, gasUsd }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      mt={2}
      sx={{
        background: theme.palette.background.default,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(2),
      }}
    >
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="terciary.800" variant="subtitle2" fontSize={13} fontWeight={600}>
          Price
        </Typography>
        <Box>
          <Typography fontSize={16} color="terciary.800" fontWeight={600} marginRight={4}>
            {`${getBigNumberCurrencyLabel(price, false, 7)} BNB`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="end" mb={1}>
        <Typography color="terciary.500" variant="subtitle2" fontSize={13} fontWeight={500} marginRight={4}>
          {`$${getBigNumberCurrencyLabel(priceUsd, false, 2)}`}
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" my={1}>
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500}>
          Blockchain cost (Gas):
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            {`~$${getBigNumberCurrencyLabel(gasUsd, false, 2)}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500}>
          Euler fees🎉:
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            ~$--
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500}>
          Transaction cost:
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            {`${getBigNumberCurrencyLabel(gasBnb, false, 7)} BNB`} {`~$${getBigNumberCurrencyLabel(gasUsd, false, 2)}`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NFTCosts;
