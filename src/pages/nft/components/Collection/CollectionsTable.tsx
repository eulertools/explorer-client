import { FC, useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { tradeColumns } from 'src/pages/marketplace/components/Trade/TradeColumns';
import { selectFilterState } from 'src/selectors/filters';
import { selectMarketplace } from 'src/selectors/marketplace';
import { UITableID } from 'src/slices/filter.types';
import { getSales } from 'src/slices/tables/marketplace';
import { setFilterPage, setFilterPageSize, setFilterOrder } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { EulerTable } from 'src/ui/EulerTable';

interface CollectionsTableProps {
  tableId: UITableID;
}

export const CollectionsTable: FC<CollectionsTableProps> = ({ tableId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilterState(tableId));
  const { sales, total, salesLoading } = useSelector(selectMarketplace);

  const [rowHeight, setRowHeight] = useState<number>(115);
  const isMobile = useMediaQuery(theme.breakpoints.down(900));
  const isSmaller = useMediaQuery(theme.breakpoints.down(700));

  const handlePage = useCallback((params) => dispatch(setFilterPage(tableId, params)), [tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(tableId, params)), [tableId]);
  const handleOrder = useCallback((params) => dispatch(setFilterOrder(tableId, params)), [tableId]);

  useEffect(() => {
    if (isSmaller) {
      setRowHeight(500);
    } else if (isMobile) {
      setRowHeight(350);
    } else {
      setRowHeight(115);
    }
  }, [isMobile, isSmaller]);

  /**
   * Starts the interval for refreshing
   * both tables every 20 seconds.
   */
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(getSales(filters.filter, tableId));
    }, 20000);

    // First run is already done by next hook so avoid it here
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    dispatch(getSales(filters.filter, tableId));
  }, [filters.filter]);

  // TODO: Replace with corresponding API calls once ready.
  return (
    <EulerTable
      rowHeight={rowHeight}
      headerHeight={0}
      page={filters.filter.page}
      pageSize={filters.filter.size}
      rows={sales || []}
      getRowId={(row) => row.identifier}
      rowCount={sales && total}
      columns={tradeColumns(tableId)}
      loading={!sales && salesLoading}
      onPageSizeChange={handleSize}
      onPageChange={handlePage}
      onSortModelChange={handleOrder}
    />
  );
};
