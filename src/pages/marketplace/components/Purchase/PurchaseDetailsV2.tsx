import { useEulerTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { FC, useState, useContext, useEffect, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import useCoinData from 'src/hooks/useCoinData';
import axios from 'src/lib/axios';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

const useStyles = makeStyles((theme) => ({
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: '246px',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: theme.spacing(1),
      boxShadow: `2px 2px 4px ${theme.palette.divider}`,
    },
  },
  tooltipArrow: {
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.background.paper,
      '&::before': {
        boxShadow: `2px 2px 4px ${theme.palette.divider}`,
      },
    },
  },
}));

interface IPurchaseHeaderProps {
  tokenPrices: { basePrice: number; quotePrice: number };
}

export const PurchaseDetailsV2: FC<IPurchaseHeaderProps> = ({ tokenPrices }) => {
  const classes = useStyles();
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const { purchase } = useContext(MarketplaceContext);
  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);

  const { bnbData } = useCoinData();

  const { account } = useWeb3React();

  const [fees, setFees] = useState<AxiosResponse>(null);

  const getFees = useCallback(async () => {
    const body = {
      action: 'buy',
      section: 'marketplace',
      contract_params: {
        kind: purchase.kind,
        account,
      },
    };
    const response = await axios.publicFetchClient.post('gas', body);
    setFees(response);
  }, []);

  useEffect(() => {
    getFees();
  }, []);

  useEffect(() => {
    if (tokenPrices?.basePrice && tokenPrices?.quotePrice) {
      const depositValue = new BigNumber(tokenPrices.quotePrice).multipliedBy(purchase.quote_token_quantity);
      const returnValue = new BigNumber(tokenPrices.basePrice).multipliedBy(purchase.base_token_quantity);
      const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);

      setVariationPercentage(percentage);
    }
  }, [tokenPrices]);

  return (
    <Grid container spacing={2} pb={1}>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="terciary.700" fontWeight={600} fontSize="11px" my={1} display="flex" alignItems="center">
          {`${purchase.quote_token_symbol} per ${purchase.base_token_symbol}`}
          <Tooltip
            placement="top"
            arrow
            sx={{
              marginLeft: theme.spacing(0.5),
              fontSize: 'small',
              background: eulerTheme.palette.terciary[400],
            }}
            classes={{ tooltipArrow: classes.tooltipArrow, popper: classes.tooltipPopper }}
            enterTouchDelay={0}
            title={
              variationPercentage ? (
                <Typography color="neutral.500" fontSize="11px" fontWeight={500} textAlign="center">
                  {`Based on current market values, swapping 
                  ${purchase.quote_token_symbol} for ${purchase.base_token_symbol} results in a
                  ${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}% 
                  ${variationPercentage.isLessThanOrEqualTo(0) ? 'loss' : 'profit'}.`}
                </Typography>
              ) : (
                '--'
              )
            }
          >
            <InfoIcon
              sx={{
                background: theme.palette.text.secondary,
                color: theme.palette.primary.contrastText,
                borderRadius: '50%',
                fontSize: '13px',
                marginLeft: theme.spacing(1),
              }}
            />
          </Tooltip>
        </Typography>
        {variationPercentage ? (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography
              color={
                variationPercentage.absoluteValue().isLessThanOrEqualTo(0) ? 'success.700' : theme.palette.error.main
              }
              fontWeight={700}
              fontSize={13}
            >{`${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}%`}</Typography>
          </Box>
        ) : (
          '--'
        )}
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" fontWeight={500} fontSize="11px">
          Blockchain cost (Gas)
        </Typography>
        <Box>
          <Typography color="neutral.500" fontWeight={500} fontSize="11px">
            {fees ? `~$${(fees.data[0].blockchain_cost * bnbData.price).toFixed(2)}` : '--'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" fontWeight={500} fontSize="11px">
          Euler fees🎉
        </Typography>
        <Box>
          <Typography color="neutral.500" fontWeight={500} fontSize="11px">
            {fees ? `~$${(fees.data[0].euler_fee * bnbData.price).toFixed(2)}` : '--'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="neutral.500" fontWeight={500} fontSize="11px">
          Transaction cost
        </Typography>
        <Box>
          <Typography color="neutral.500" fontWeight={500} fontSize="11px">
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
