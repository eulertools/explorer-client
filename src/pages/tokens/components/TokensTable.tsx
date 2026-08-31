import { FC, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import tokenColumns from 'src/pages/tokens/components/TokenColumns';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { getTokens } from 'src/slices/tables/tokens';
import { setFilterOrder, setFilterPage, setFilterPageSize } from 'src/slices/ui/filters';
import { getFavorites } from 'src/slices/user/favorites';
import { getPortfolios } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';
import { EulerTable } from 'src/ui/EulerTable';

interface TokensTableProps {
  tableId: UITableID;
}
const useStyle = makeStyles(() => ({
  table: {
    '& .MuiDataGrid-row .MuiDataGrid-cell:nth-child(2), & .MuiDataGrid-colCellWrapper .MuiDataGrid-colCell:nth-child(2)': {
      paddingLeft: '3px',
    },
  },
}));
const TokensTable: FC<TokensTableProps> = (props) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilterState(props.tableId));
  const { tokens, loading, total = 0 } = useSelector((state) => state.tokens);
  const { isAuthenticated } = useAuth();
  const { network } = useParams();
  const classes = useStyle();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getPortfolios());
      dispatch(getFavorites());
    }
  }, [isAuthenticated]);

  const handlePage = useCallback((params) => dispatch(setFilterPage(props.tableId, params)), [props.tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(props.tableId, params)), [props.tableId]);
  const handleOrder = useCallback((params) => dispatch(setFilterOrder(props.tableId, params)), [props.tableId]);

  const fields = ['name', 'symbol', 'address', 'price_usd', 'price_changes', 'market_cap'];

  useEffect(() => {
    const customFilters = {
      ...filters.filter,
    };

    dispatch(getTokens(customFilters, fields));
  }, [filters.filter, network]);

  return (
    <EulerTable
      page={filters.filter.page}
      pageSize={filters.filter.size}
      rows={tokens}
      getRowId={(row) => row.identifier}
      rowCount={total}
      columns={tokenColumns({ network })}
      loading={loading}
      onPageSizeChange={handleSize}
      onPageChange={handlePage}
      onSortModelChange={handleOrder}
      classes={{ root: classes.table }}
    />
  );
};

export default TokensTable;
