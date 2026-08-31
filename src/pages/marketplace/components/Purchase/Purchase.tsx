import { useState, useEffect, useContext } from 'react';
import Alert from '@material-ui/core/Alert';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { MarketplaceContext, initialPurchaseObject } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { PurchaseBalance } from 'src/pages/marketplace/components/Purchase/PurchaseBalance';
import { PurchaseHeader } from 'src/pages/marketplace/components/Purchase/PurchaseHeader';
import { PurchaseSummary } from 'src/pages/marketplace/components/Purchase/PurchaseSummary';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { getTokenData } from 'src/slices/tables/tokens';
import { useDispatch, useSelector } from 'src/store';
import { EMarketContractSteps } from 'src/types/marketplace';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    '& > div > div': {
      minWidth: 'auto',
    },
  },
  card: {
    background: theme.palette.background.default,
  },
  cardHeader: {
    paddingRight: 0,
  },
}));

export const Purchase = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sale, saleLoading } = useSelector(selectMarketplace);
  const { modal, purchase, updatePurchase } = useContext(MarketplaceContext);
  const { chain } = useContext(ConfigurationContext);

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
      <Grid item xs={12}>
        <Alert severity="info">Make sure to double check all information before completing the trade.</Alert>
      </Grid>
      <Grid item xs={12} className={classes.mainGrid}>
        <Card className={classes.card}>
          <CardHeader className={classes.cardHeader} title={<PurchaseHeader tokenPrices={tokenPrices} />} />
          <CardContent>
            <Grid container pb={1} rowGap={2} display="flex" justifyContent="space-between">
              <PurchaseBalance tokenPrices={tokenPrices} />
              <PurchaseSummary />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
