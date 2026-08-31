import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { GridSortModel } from '@material-ui/data-grid';
import gtm from 'src/lib/gtm';
import { MarketTradeFilterForm } from 'src/pages/markets/components/Market/MarketTradeFilterForm';
import { MarketTradeTable } from 'src/pages/markets/components/Market/MarketTradeTable';
import { selectFilterState } from 'src/selectors/filters';
import { selectPairTransaction } from 'src/selectors/pairTransaction';
import { UITableID, tokenTradeTableDefaultFilterParams } from 'src/slices/filter.types';
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
import { CardRoot } from 'src/ui/CardRoot';
import { EulerError } from 'src/ui/EulerError';
import { dayMs, weekMs, monthMs, yearMs } from 'src/utils/moment';

interface IMarketTradeContainerProps {
  address: string;
  symbol: string;
}

export const MarketTradeContainer: FC<IMarketTradeContainerProps> = ({ address, symbol }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { detailPairTransactions, errorPairTransactions, loadingPairTransactions, displayAge } = useSelector(
    selectPairTransaction,
  );
  const tableId = UITableID.token_trade_list;
  const filters = useSelector(selectFilterState(tableId));

  // TODO: Remove once trades API can support filtering by buy/sell/all type.
  const showTradeFilter = false;

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
        const { field, sort } = params.sortModel[0];
        let order;
        switch (field) {
          case 'block_timestamp':
            order = 'Date';
            break;
          case 'base_token_price_usd':
            order = 'USD price';
            break;
          case 'ratio':
            order = 'Ratio';
            break;
          case 'volume':
            order = 'USD traded';
            break;
          default:
            break;
        }
        gtm.push({ event: 'user_sorted_table', category: 'Tokens', orderBy: order, orderDir: sort });
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
    if (address) {
      const dayAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - dayMs);
      const weekAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - weekMs);
      const monthAgo = new Date(new Date(filters.filter.dateRange[0]).getTime() - monthMs);
      let allTotal: number;
      const [dayTotal, weekTotal, monthTotal] = await Promise.all([
        getPairTransactionTotal(
          address.toLowerCase(),
          { ...filters.filter, dateRange: [dayAgo.toISOString(), filters.filter.dateRange[1]] },
          false,
        ),
        getPairTransactionTotal(
          address.toLowerCase(),
          { ...filters.filter, dateRange: [weekAgo.toISOString(), filters.filter.dateRange[1]] },
          false,
        ),
        getPairTransactionTotal(
          address.toLowerCase(),
          { ...filters.filter, dateRange: [monthAgo.toISOString(), filters.filter.dateRange[1]] },
          false,
        ),
      ]);

      // Avoid heavy API call unless its needed.
      if (monthTotal !== null && !compareFilters(monthTotal)) {
        allTotal = await getPairTransactionTotal(address.toLowerCase(), { ...filters.filter }, true);
      }

      setTotalDates({
        day: dayTotal || 0,
        week: weekTotal || 0,
        month: monthTotal || 0,
        all: allTotal || 0,
      });
    }
  }, [filters.filter]);

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
    if (allEntries && address) {
      dispatch(getPairTransactionDetail(address.toLowerCase(), { ...filters.filter }, true));
    } else if (filters.filter.dateRange[0] !== filters.filter.dateRange[1] && address) {
      dispatch(getPairTransactionDetail(address.toLowerCase(), { ...filters.filter }));
    }
  }, [filters.filter, allEntries]);

  useEffect(
    () => () => {
      dispatch(setFilterTable(tableId, tokenTradeTableDefaultFilterParams));
      dispatch(slice.actions.setPairTransactionDetails(null));
    },
    [],
  );

  if (errorPairTransactions) return <EulerError error={errorPairTransactions} />;

  return (
    <Box mt={3}>
      <CardRoot backgroundPaper minWidth={1500}>
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '26px 16px',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: '22px',
                color: (theme) => (theme as any).palette.terciary[700],
              }}
            >
              {t('Trade History')}
            </Typography>
            {showTradeFilter ? <MarketTradeFilterForm /> : null}
          </Box>
          <MarketTradeTable
            address={address.toLowerCase()}
            symbol={symbol.toUpperCase()}
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
          />
        </>
      </CardRoot>
    </Box>
  );
};
