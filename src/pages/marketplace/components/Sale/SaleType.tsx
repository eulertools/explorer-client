import { useState, useMemo, useCallback, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { marketSaleTypeOptions } from 'src/types/marketplace';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down(1100)]: {
      flexDirection: 'column',
    },
  },
  descriptionGrid: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
  },
  description: {
    display: 'flex',
    fontWeight: 700,
  },
}));

export const SaleType = () => {
  const classes = useStyles();
  const { sale, updateSale, updateModal } = useContext(MarketplaceContext);

  const currentSale = useMemo(() => marketSaleTypeOptions.find((i) => i.key === sale.kind), [sale?.kind]);
  const [saleCurrentOption, setSaleCurrentOption] = useState(currentSale || marketSaleTypeOptions[0]);

  const handleSaleChange = useCallback((s) => {
    updateSale((prev) => ({ ...prev, kind: s.key }));
    setSaleCurrentOption(s);
    updateModal((prev) => ({ ...prev, kind: s.key }));
  }, []);

  return (
    <Grid container display="flex" justifyContent="space-between" gap={1}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Typography className={classes.description}>Select the type of sale you wish to create</Typography>
      </Grid>
      <Grid className={classes.mainGrid} container>
        <Grid item>
          <Button
            size="large"
            variant={saleCurrentOption === marketSaleTypeOptions[0] ? 'contained' : 'outlined'}
            onClick={() => handleSaleChange(marketSaleTypeOptions[0])}
          >
            {marketSaleTypeOptions[0].label}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant={saleCurrentOption === marketSaleTypeOptions[1] ? 'contained' : 'outlined'}
            onClick={() => handleSaleChange(marketSaleTypeOptions[1])}
          >
            {marketSaleTypeOptions[1].label}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant={saleCurrentOption === marketSaleTypeOptions[2] ? 'contained' : 'outlined'}
            onClick={() => handleSaleChange(marketSaleTypeOptions[2])}
          >
            {marketSaleTypeOptions[2].label}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant={saleCurrentOption === marketSaleTypeOptions[3] ? 'contained' : 'outlined'}
            onClick={() => handleSaleChange(marketSaleTypeOptions[3])}
          >
            {marketSaleTypeOptions[3].label}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.descriptionGrid}>
        <Typography fontWeight={700}>{saleCurrentOption.description}</Typography>
      </Grid>
    </Grid>
  );
};
