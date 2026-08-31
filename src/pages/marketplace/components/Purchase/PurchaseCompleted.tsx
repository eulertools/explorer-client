import { useEulerTheme } from '@eulertools/ui';
import { useMemo, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { LoadingButton } from '@material-ui/lab';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import PurchaseCompletedIcon from 'src/icons/svg-icons/PurchaseCompletedIcon';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { IMarketSource } from 'src/types/marketplace';

export const PurchaseCompleted = (purchase: IMarketSource) => {
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const date = useMemo(() => new Date(), []);
  const { updateModal } = useContext(MarketplaceContext);

  const closeModal = () => {
    updateModal((prev) => ({ ...prev, showModal: false }));
  };

  return (
    <Grid container display="flex" flexDirection="column">
      <Grid item display="flex" justifyContent="center">
        <Box
          sx={{
            backgroundColor: eulerTheme.palette.primary[50],
            borderRadius: '180px',
            padding: theme.spacing(5),
            marginBottom: theme.spacing(4),
          }}
        >
          <PurchaseCompletedIcon />
        </Box>
      </Grid>
      <Grid container display="flex" flexDirection="column" textAlign="center">
        <Typography fontSize="20px" fontWeight={700} color="neutral.600">
          {`${purchase.base_token_quantity} ${purchase.base_token_symbol}`}
        </Typography>
        <Typography fontSize="13px" fontWeight={600} color="neutral.500" mt={1}>
          Deposit on your wallet
        </Typography>
      </Grid>
      <Grid container>
        <Grid container display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={3}>
          <Typography fontSize="13px" fontWeight={700} color="terciary.700">
            TRADE
          </Typography>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <AvatarThumbnail address={purchase.quote_token_address} alt={purchase.quote_token_symbol} size="medium" />
              <Typography fontSize="13px" fontWeight={700} color="terciary.700" ml={1} mr={2}>
                {purchase.quote_token_symbol}
              </Typography>
            </Box>
            <ArrowRightAltIcon />
            <Box display="flex" alignItems="center" ml={2}>
              <AvatarThumbnail address={purchase.base_token_address} alt={purchase.base_token_symbol} size="medium" />
              <Typography fontSize="13px" fontWeight={700} color="terciary.700" ml={1}>
                {purchase.base_token_symbol}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid container display="flex" justifyContent="space-between">
          <Typography fontSize="11px" fontWeight={600} color="terciary.700">
            Transaction date
          </Typography>
          <Typography fontSize="11px" fontWeight={500} color="terciary.700">
            {`${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${
              date.getMonth() + 1
            }/${date.getFullYear() < 10 ? '0' : ''}${date.getFullYear()} ${
              date.getHours() < 10 ? '0' : ''
            }${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}:${
              date.getSeconds() < 10 ? '0' : ''
            }${date.getSeconds()}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <LoadingButton
          onClick={closeModal}
          size="large"
          variant="text"
          fullWidth
          sx={{
            margin: theme.spacing(4, 0, 2, 0),
            backgroundColor: eulerTheme.palette.primary[50],
            color: eulerTheme.palette.primary[400],
            borderRadius: theme.spacing(1.25),
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Continue
        </LoadingButton>
        <LoadingButton
          size="large"
          variant="text"
          fullWidth
          sx={{
            color: eulerTheme.palette.primary[400],
            fontSize: '16px',
            fontWeight: 600,
            paddingBottom: theme.spacing(2),
          }}
        >
          View Details
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
