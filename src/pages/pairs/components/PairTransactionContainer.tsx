import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { GridSortModel } from '@material-ui/data-grid';
import Tabs from 'src/components/tabs';
import { PairTransactionFilterForm } from 'src/pages/pairs/components/PairTransactionFilterForm';
import { selectFilterState } from 'src/selectors/filters';
import { selectPairTransaction } from 'src/selectors/pairTransaction';
import { UITableID, tradeTableDefaultFilterParams } from 'src/slices/filter.types';
import slice, { getPairTransactionDetail, getPairTransactionTotal } from 'src/slices/tables/pairTransactions';
import {
  setFilterValue,
  setFilterPage,
  setFilterPageSize,
  setFilterTable,
  setFilterOrder,
  clearFilterOrder,
} from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { IPairSource } from 'src/types/pair';
import { CardRoot } from 'src/ui/CardRoot';
import { EulerError } from 'src/ui/EulerError';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { EulerPairTransactionTable } from 'src/ui/eulerTransactionTable/EulerPairTransactionTable';
import { dayMs, weekMs, monthMs, yearMs } from 'src/utils/moment';

interface IPairTransactionContainerProps {
  pairDetails: IPairSource;
}

const PairTransactionContainer: FC<IPairTransactionContainerProps> = ({ pairDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { detailPairTransactions, errorPairTransactions, loadingPairTransactions, displayAge } = useSelector(
    selectPairTransaction,
  );
  const tableId = UITableID.trade_list;
  const filters = useSelector(selectFilterState(tableId));

  const tabs = ['ALL', 'BUY', 'SELL'];
  const [selectedTab, setSelectedTab] = useState(0);

  const [totalDates, setTotalDates] = useState<{ day: number; week: number; month: number; all: number }>(null);
  const [allEntries, setAllEntries] = useState(false);
  const [sortModel] = useState<GridSortModel>([
    { field: filters.filter.orderBy.toString(), sort: filters.filter.orderDir },
  ]);

  const handlePage = useCallback((params) => dispatch(setFilterPage(tableId, params)), [tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(tableId, params)), [tableId]);
  const handleOrder = useCallback(
    (params) => {
      if (params.sortModel.length === 0) {
        dispatch(clearFilterOrder(tableId));
      } else {
        dispatch(setFilterOrder(tableId, params));
      }
    },
    [tableId],
  );

  // Check if we are in the last Page of Transactions
  const compareFilters = useCallback(
    (currentTotal) => currentTotal - filters.filter.size * filters.filter.page > filters.filter.size,
    [filters.filter],
  );

  const getTotals = useCallback(async () => {
    const dayAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - dayMs);
    const weekAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - weekMs);
    const monthAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - monthMs);
    let allTotal: number;
    const [dayTotal, weekTotal, monthTotal] = await Promise.all([
      getPairTransactionTotal(
        pairDetails.base_token_address.toString().toLowerCase(),
        { ...filters.filter, dateRange: [dayAgo.toISOString(), filters.filter.dateRange[1]] },
        false,
      ),
      getPairTransactionTotal(
        pairDetails.base_token_address.toString().toLowerCase(),
        { ...filters.filter, dateRange: [weekAgo.toISOString(), filters.filter.dateRange[1]] },
        false,
      ),
      getPairTransactionTotal(
        pairDetails.base_token_address.toString().toLowerCase(),
        { ...filters.filter, dateRange: [monthAgo.toISOString(), filters.filter.dateRange[1]] },
        false,
      ),
    ]);

    // Avoid heavy API call unless its needed.
    if (!compareFilters(monthTotal)) {
      allTotal = await getPairTransactionTotal(
        pairDetails.base_token_address.toString().toLowerCase(),
        { ...filters.filter },
        true,
      );
    }

    setTotalDates({
      day: dayTotal || 0,
      week: weekTotal || 0,
      month: monthTotal || 0,
      all: allTotal || 0,
    });
  }, [filters.filter]);

  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName: 'tradeType',
        filterValue: tabs[selectedTab].toLowerCase(),
      }),
    );
  }, [selectedTab]);

  useEffect(() => {
    if (allEntries) return;
    if (filters.filter.dateRange[0] < new Date(new Date(filters.filter.dateRange[1]).getTime() - yearMs + dayMs))
      return;
    if (!loadingPairTransactions && !compareFilters(detailPairTransactions?.total)) {
      getTotals();
      return;
    }
    if (totalDates === null) {
      getTotals();
    }
  }, [detailPairTransactions?.total, loadingPairTransactions]);

  // Go back the less required time for next Page to Load.
  useEffect(() => {
    const dayAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - dayMs);
    const weekAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - weekMs);
    const monthAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - monthMs);
    if (compareFilters(detailPairTransactions?.total)) return;
    if (compareFilters(totalDates?.day)) {
      dispatch(
        setFilterValue(tableId, {
          filterName: 'dateRange',
          filterValue: [dayAgo.toISOString(), filters.filter.dateRange[1]],
        }),
      );
      return;
    }
    if (compareFilters(totalDates?.week)) {
      dispatch(
        setFilterValue(tableId, {
          filterName: 'dateRange',
          filterValue: [weekAgo.toISOString(), filters.filter.dateRange[1]],
        }),
      );
      return;
    }
    if (compareFilters(totalDates?.month)) {
      dispatch(
        setFilterValue(tableId, {
          filterName: 'dateRange',
          filterValue: [monthAgo.toISOString(), filters.filter.dateRange[1]],
        }),
      );
      return;
    }
    if (compareFilters(totalDates?.all)) {
      setAllEntries(true);
      return;
    }
    if (totalDates?.all && !compareFilters(totalDates?.all)) {
      setAllEntries(true);
    }
  }, [totalDates]);

  useEffect(() => {
    if (allEntries) {
      dispatch(
        getPairTransactionDetail(pairDetails.base_token_address.toString().toLowerCase(), { ...filters.filter }, true),
      );
    } else if (filters.filter.dateRange[0] !== filters.filter.dateRange[1]) {
      dispatch(
        getPairTransactionDetail(pairDetails.base_token_address.toString().toLowerCase(), { ...filters.filter }),
      );
    }
  }, [filters.filter, allEntries]);

  useEffect(
    () => () => {
      dispatch(setFilterTable(tableId, tradeTableDefaultFilterParams));
      dispatch(slice.actions.setPairTransactionDetails(null));
    },
    [],
  );

  if (errorPairTransactions) return <EulerError error={errorPairTransactions} />;

  return (
    <Box mt={3}>
      <Box display="grid" gridTemplateColumns="1fr auto" columnGap={3} marginBottom={2}>
        <Box>
          <Typography variant="h4" color="textPrimary">
            {t('Trade History')}
          </Typography>
        </Box>
        <Box>
          <FilterButton tableId={tableId} />
        </Box>
      </Box>
      <Tabs tabs={tabs} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
      <FilterContainer tableId={tableId} FilterForm={PairTransactionFilterForm} topRightBorder>
        <CardRoot noTopLeftBorder noTopRightBorder={filters.openFilter} backgroundPaper minWidth={1500}>
          <EulerPairTransactionTable
            transactions={detailPairTransactions ? detailPairTransactions.data : []}
            page={filters.filter.page}
            pageSize={filters.filter.size}
            sortModel={sortModel}
            onSortModelChange={handleOrder}
            rowCount={detailPairTransactions && detailPairTransactions.total}
            rowsPerPageOptions={[20, 50]}
            onPageSizeChange={handleSize}
            onPageChange={handlePage}
            loading={loadingPairTransactions || !detailPairTransactions}
            displayAge={displayAge}
            baseSymbol={pairDetails.base_token_symbol}
            quoteSymbol={pairDetails.quote_token_symbol}
          />
        </CardRoot>
      </FilterContainer>
    </Box>
  );
};

export default PairTransactionContainer;
