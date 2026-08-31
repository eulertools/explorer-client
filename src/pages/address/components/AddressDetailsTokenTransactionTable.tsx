import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GridSortModel } from '@material-ui/data-grid';
import useSettings from 'src/hooks/useSettings';
import { selectFilterState } from 'src/selectors/filters';
import { selectTokenTransaction } from 'src/selectors/tokenTransaction';
import { UITableID, tokenTransactionTableDefaultParams } from 'src/slices/filter.types';
import slice, { getTokenTransactionDetail, getTokenTransactionTotal } from 'src/slices/tables/tokenTransactions';
import {
  setFilterPage,
  setFilterPageSize,
  setFilterOrder,
  setFilterValue,
  setFilterTable,
  clearFilterOrder,
} from 'src/slices/ui/filters';
import { EulerError } from 'src/ui/EulerError';
import { EulerTokenTransactionTable } from 'src/ui/eulerTransactionTable/EulerTokenTransactionTable';
import { logger } from 'src/utils/logger';
import { dayMs, weekMs, monthMs, yearMs } from 'src/utils/moment';

export const AddressDetailsTokenTransactionTable = ({ address }) => {
  const { settings } = useSettings();
  logger('Load AddressDetailsTokenTransactionTable');
  const dispatch = useDispatch();
  const { detailTokenTransactions, errorTokenTransactions, loadingTokenTransactions, displayAge } = useSelector(
    selectTokenTransaction,
  );

  const tableId = UITableID.token_transaction_list;
  const filters = useSelector(selectFilterState(tableId));

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
      getTokenTransactionTotal(address, {
        ...filters.filter,
        dateRange: [dayAgo.toISOString(), filters.filter.dateRange[1]],
      }),
      getTokenTransactionTotal(address, {
        ...filters.filter,
        dateRange: [weekAgo.toISOString(), filters.filter.dateRange[1]],
      }),
      getTokenTransactionTotal(address, {
        ...filters.filter,
        dateRange: [monthAgo.toISOString(), filters.filter.dateRange[1]],
      }),
    ]);

    // Avoid heavy API call unless its needed.
    if (monthTotal !== null && !compareFilters(monthTotal)) {
      allTotal = await getTokenTransactionTotal(address, { ...filters.filter }, true);
    }

    setTotalDates({
      day: dayTotal || 0,
      week: weekTotal || 0,
      month: monthTotal || 0,
      all: allTotal || 0,
    });
  }, [filters.filter]);

  useEffect(() => {
    if (allEntries) return;
    if (filters.filter.dateRange[0] < new Date(new Date(filters.filter.dateRange[1]).getTime() - yearMs + dayMs))
      return;
    if (!loadingTokenTransactions && !compareFilters(detailTokenTransactions?.total)) {
      getTotals();
      return;
    }
    if (totalDates === null) {
      getTotals();
    }
  }, [detailTokenTransactions?.total, loadingTokenTransactions]);

  useEffect(() => {
    const dayAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - dayMs);
    const weekAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - weekMs);
    const monthAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - monthMs);
    if (compareFilters(detailTokenTransactions?.total)) return;
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
      dispatch(getTokenTransactionDetail(address, { ...filters.filter }, true));
    } else if (filters.filter.dateRange[0] !== filters.filter.dateRange[1]) {
      dispatch(getTokenTransactionDetail(address, { ...filters.filter }));
    }
  }, [address, filters.filter, allEntries]);

  useEffect(
    () => () => {
      dispatch(setFilterTable(tableId, tokenTransactionTableDefaultParams));
      dispatch(slice.actions.setTokenTransactionDetails(null));
    },
    [],
  );

  if (errorTokenTransactions) return <EulerError error={errorTokenTransactions} />;

  return (
    <EulerTokenTransactionTable
      transactions={detailTokenTransactions ? detailTokenTransactions.data : []}
      page={filters.filter.page}
      pageSize={filters.filter.size}
      rowCount={detailTokenTransactions && detailTokenTransactions.total}
      onPageSizeChange={handleSize}
      onPageChange={handlePage}
      sortModel={sortModel}
      onSortModelChange={handleOrder}
      loading={loadingTokenTransactions || !detailTokenTransactions}
      displayAge={displayAge}
      currentAddress={address}
      network={settings.network}
    />
  );
};
