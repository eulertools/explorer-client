import { useState, useEffect, useContext, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { MarketplaceContext, initialPurchaseObject } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { PurchaseDetailsV2 } from 'src/pages/marketplace/components/Purchase/PurchaseDetailsV2';
import { PurchaseSummaryV2 } from 'src/pages/marketplace/components/Purchase/PurchaseSummaryV2';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { getTokenData } from 'src/slices/tables/tokens';
import { useDispatch, useSelector } from 'src/store';
import { EMarketContractSteps } from 'src/types/marketplace';
import { isLockedSale } from 'src/utils/marketplace';
import { localeDate } from 'src/utils/moment';
import { PurchaseBodyV2 } from './PurchaseBodyV2';
import { PurchaseCompleted } from './PurchaseCompleted';

export const PurchaseV2 = () => {
  const dispatch = useDispatch();
  const { sale, saleLoading } = useSelector(selectMarketplace);
  const { modal, purchase, updatePurchase } = useContext(MarketplaceContext);
  const { chain } = useContext(ConfigurationContext);
  const lockedSale = isLockedSale(+purchase.kind);

  const readableCreateDate = useMemo(() => new Date(purchase.create_date).toISOString(), [purchase.create_date]);
  const readableUpdateDate = useMemo(() => new Date(purchase.update_date).toISOString(), [purchase.update_date]);

  const [tokenPrices, setTokenPrices] = useState<{ basePrice: any; quotePrice: any }>(null);

  useEffect(() => {
    const getTokenPrices = async () => {
      const [base, quote] = await Promise.all([
        getTokenData(purchase.base_token_address, chain),
        getTokenData(purchase.quote_token_address, chain),
      ]);
      setTokenPrices({ basePrice: base?.price_usd, quotePrice: quote?.price_usd });
    };
    getTokenPrices();
  }, [purchase]);

  useEffect(() => {
    if (sale !== initialPurchaseObject && !saleLoading) {
      updatePurchase((prev) => ({ ...prev, ...sale }));
    }
  }, [sale, saleLoading]);

  useEffect(() => {
    if (modal.activeModal === 'purchase' && modal.step === EMarketContractSteps.CONFIRMED) {
      dispatch(getSale(purchase.identifier));
    }
  }, [modal.step]);

  return (
    <Grid container display="flex" justifyContent="space-between" spacing={2}>
      {modal.step === EMarketContractSteps.WAITING_APPROVAL ||
      modal.step === EMarketContractSteps.WAITING_CONFIRMATION ? (
        <Grid item xs={12} mb={2}>
          <Typography color="neutral.500" fontWeight={400} fontSize="13px">
            Make sure to double check all information before completing the trade.
          </Typography>
        </Grid>
      ) : null}

      <Grid item xs={12}>
        {modal.step !== EMarketContractSteps.CONFIRMED ? (
          <>
            <Typography fontSize="11px" fontWeight={500} color="neutral.400" textAlign="right" mt={1}>
              {localeDate(`${lockedSale ? readableUpdateDate : readableCreateDate}`)}
            </Typography>
            <Box>
              <PurchaseBodyV2 tokenPrices={tokenPrices} />
              <Box mt={2} mb={2}>
                <Grid container display="flex" justifyContent="space-between">
                  {!lockedSale ? <PurchaseDetailsV2 tokenPrices={tokenPrices} /> : null}
                  <PurchaseSummaryV2 />
                </Grid>
              </Box>
            </Box>
          </>
        ) : (
          <PurchaseCompleted {...purchase} />
        )}
      </Grid>
    </Grid>
  );
};
