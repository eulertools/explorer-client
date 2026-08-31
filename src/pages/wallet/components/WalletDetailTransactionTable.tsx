import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GridSortModel } from '@material-ui/data-grid';
import useSettings from 'src/hooks/useSettings';
import { selectFilterState } from 'src/selectors/filters';
import { selectTransaction } from 'src/selectors/transaction';
import { UITableID, transactionTableDefaultFilterParams } from 'src/slices/filter.types';
import slice, { getTransactionDetail, getTransactionTotal } from 'src/slices/tables/transactions';
import {
  setFilterPage,
  setFilterPageSize,
  setFilterOrder,
  setFilterValue,
  setFilterTable,
  clearFilterOrder,
} from 'src/slices/ui/filters';
import { EulerError } from 'src/ui/EulerError';
import { EulerTransactionTable } from 'src/ui/eulerTransactionTable/EulerTransactionTable';
import { dayMs, weekMs, monthMs, yearMs } from 'src/utils/moment';

export const WalletDetailTransactionTable = ({ address }) => {
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const { detailTransactions, errorTransactions, loadingTransactions, displayAge } = useSelector(selectTransaction);

  const tableId = UITableID.transaction_list;
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
      getTransactionTotal(address, {
        ...filters.filter,
        dateRange: [dayAgo.toISOString(), filters.filter.dateRange[1]],
      }),
      getTransactionTotal(
        address,
        { ...filters.filter, dateRange: [weekAgo.toISOString(), filters.filter.dateRange[1]] },
        null,
        false,
      ),
      getTransactionTotal(address, {
        ...filters.filter,
        dateRange: [monthAgo.toISOString(), filters.filter.dateRange[1]],
      }),
    ]);

    // Avoid heavy API call unless its needed.
    if (monthTotal !== null && !compareFilters(monthTotal)) {
      allTotal = await getTransactionTotal(address, { ...filters.filter }, null, true);
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
    if (!loadingTransactions && !compareFilters(detailTransactions?.total)) {
      getTotals();
      return;
    }
    if (totalDates === null) {
      getTotals();
    }
  }, [detailTransactions?.total, loadingTransactions]);

  // Go back the less required time for next Page to Load.
  useEffect(() => {
    const dayAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - dayMs);
    const weekAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - weekMs);
    const monthAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - monthMs);
    if (compareFilters(detailTransactions?.total)) return;
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
      dispatch(getTransactionDetail(address, { ...filters.filter }, null, true));
    } else if (filters.filter.dateRange[0] !== filters.filter.dateRange[1]) {
      dispatch(getTransactionDetail(address, { ...filters.filter }));
    }
  }, [address, filters.filter, allEntries]);

  useEffect(
    () => () => {
      dispatch(setFilterTable(tableId, transactionTableDefaultFilterParams));
      dispatch(slice.actions.setTransactionDetails(null));
    },
    [],
  );

  if (errorTransactions) return <EulerError error={errorTransactions} />;

  return (
    <EulerTransactionTable
      transactions={detailTransactions ? detailTransactions.data : []}
      page={filters.filter.page}
      pageSize={filters.filter.size}
      sortModel={sortModel}
      onSortModelChange={handleOrder}
      rowCount={detailTransactions && detailTransactions.total}
      onPageSizeChange={handleSize}
      onPageChange={handlePage}
      loading={loadingTransactions || !detailTransactions}
      displayAge={displayAge}
      currentAddress={address}
      network={settings.network}
    />
  );
};
