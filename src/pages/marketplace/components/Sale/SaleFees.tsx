import { useWeb3React } from '@web3-react/core';
import { AxiosResponse } from 'axios';
import { useState, useCallback, useEffect, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useCoinData from 'src/hooks/useCoinData';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'src/lib/axios';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';

export const SaleFees = () => {
  const { bnbData } = useCoinData();
  const { account } = useWeb3React();
  const { sale } = useContext(MarketplaceContext);
  const [fees, setFees] = useState<AxiosResponse>(null);
  const isMountedRef = useIsMountedRef();

  const getFees = useCallback(async () => {
    const body = {
      action: 'create',
      section: 'marketplace',
      contract_params: {
        kind: sale.kind,
        account,
      },
    };
    const response = await axios.publicFetchClient.post('gas', body);
    if (isMountedRef.current) {
      setFees(response);
    }
  }, [sale, account]);

  useEffect(() => {
    getFees();
  }, [getFees]);

  return (
    <Grid container mt={2}>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500} my={1}>
          Blockchain cost (Gas):
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            {fees ? `~$${(fees.data[0].blockchain_cost * bnbData.price).toFixed(2)}` : '--'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500} my={1}>
          Euler fees:
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            {fees ? `~$${(fees.data[0].euler_fee * bnbData.price).toFixed(2)}` : '--'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" variant="subtitle2" fontSize={11} fontWeight={500} my={1}>
          Transaction cost:
        </Typography>
        <Box>
          <Typography fontSize={11} color="neutral.500" fontWeight={500}>
            {fees
              ? `${(Number(fees.data[0].euler_fee) + fees.data[0].blockchain_cost).toFixed(6)} BNB ~$${(
                  (Number(fees.data[0].euler_fee) + fees.data[0].blockchain_cost) *
                  bnbData.price
                ).toFixed(2)}`
              : '--'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
