import { useEffect, useContext } from 'react';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { MySaleFilterForm } from 'src/pages/marketplace/components/Sale/MySaleFilterForm';
import TradeTable from 'src/pages/marketplace/components/Trade/TradeTable';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { CardRoot } from 'src/ui/CardRoot';
import { EulerTabs } from 'src/ui/EulerTabs';
import { FilterButtonIcon } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    '& > div > div': {
      minWidth: 'auto',
    },
  },
  tabHeader: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'grid',
    paddingLeft: theme.spacing(2),
    width: '100%',
    gridTemplateColumns: '1fr 1fr',
    columnGap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down(900)]: {
      gridTemplateColumns: '1fr',
      marginBottom: theme.spacing(2),
    },
  },
  filters: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

export const MySales = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const tableId = UITableID.marketplace_my_sale_list;
  const filters = useSelector(selectFilterState(tableId));
  const { saleTab, updateSaleTab } = useContext(MarketplaceContext);
  const tradeTableId = UITableID.marketplace_trade_list;

  const tabs = ['SALES', 'PURCHASES'];
  const isMobile = useMediaQuery(theme.breakpoints.down(900));
  const { featureFlags } = useContext(ConfigurationContext);
  const { nftDisabled } = featureFlags;

  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName: 'tradeType',
        filterValue: tabs[saleTab].toLowerCase(),
      }),
    );
  }, [saleTab]);

  return (
    <Grid container display="flex" justifyContent="space-between" spacing={2}>
      <Grid item xs={12} className={classes.mainGrid}>
        <Box className={classes.tabHeader}>
          <EulerTabs titles={tabs} selected={saleTab} setSelected={updateSaleTab} inMarketplace />
          {nftDisabled ? null : (
            <Box width="100%" className={classes.filters}>
              <FilterQuery placeholder="Search by Name or Symbol" tableId={tradeTableId} />
              <FilterButtonIcon tableId={tradeTableId} />
            </Box>
          )}
        </Box>
        <FilterContainer tableId={tableId} FilterForm={MySaleFilterForm} topRightBorder>
          <CardRoot
            noTopLeftBorder
            noTopRightBorder={filters.openFilter}
            minWidth={!isMobile ? 1200 : null}
            backgroundPaper
          >
            <TradeTable tableId={tableId} />
          </CardRoot>
        </FilterContainer>
      </Grid>
    </Grid>
  );
};
