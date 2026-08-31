import { FC, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import gtm from 'src/lib/gtm';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { getMarkets } from 'src/slices/tables/markets';
import { setFilterOrder, setFilterPage, setFilterPageSize } from 'src/slices/ui/filters';
import { getFavorites } from 'src/slices/user/favorites';
import { getPortfolios } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';
import { EulerTable } from 'src/ui/EulerTable';
import marketColumns from './MarketColumns';

interface MarketsTableProps {
  tableId: UITableID;
}

const useStyle = makeStyles(() => ({
  table: {
    '& .MuiDataGrid-row .MuiDataGrid-cell:nth-child(2), & .MuiDataGrid-colCellWrapper .MuiDataGrid-colCell:nth-child(2)': {
      paddingLeft: '3px',
    },
  },
}));

const MarketsTable: FC<MarketsTableProps> = (props) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilterState(props.tableId));
  const { markets, loading, total = 0 } = useSelector((state) => state.markets);
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
  const handleOrder = useCallback(
    (params) => {
      dispatch(setFilterOrder(props.tableId, params));

      const { field, sort } = params.sortModel[0];
      let order;

      switch (field) {
        case 'name':
          order = 'Name';
          break;
        case 'price_usd':
          order = 'Price';
          break;
        case 'price1Hour':
          order = '1h';
          break;
        case 'price24Hour':
          order = '24h';
          break;
        case 'price7Day':
          order = '7d';
          break;
        case 'volumen_24h':
          order = 'Volume (24h)';
          break;
        case 'market_cap':
          order = 'Market Cap';
          break;
        default:
          break;
      }

      gtm.push({ event: 'user_sorted_tokens_table', category: 'Tokens', orderBy: order, orderDir: sort });
    },
    [props.tableId],
  );

  useEffect(() => {
    const customFilters = {
      ...filters.filter,
      network: 'bnb',
    };

    dispatch(getMarkets(customFilters));
  }, [filters.filter, network]);

  const didMount = useRef(false);
  let timer;

  useEffect(() => {
    // This is to prevent the first render to trigger the event
    if (didMount.current) {
      // The timeout here is to match the delay of getting the string typed by the user
      clearInterval(timer);
      timer = setTimeout(() => {
        gtm.push({ event: 'show_search_results', rows: total });
      }, 2000);
    } else {
      didMount.current = true;
    }
  }, [total]);

  return (
    <EulerTable
      page={filters.filter.page}
      pageSize={filters.filter.size}
      rows={markets}
      getRowId={(row) => row.identifier}
      rowCount={total}
      columns={marketColumns}
      loading={loading}
      onPageSizeChange={handleSize}
      onPageChange={handlePage}
      onSortModelChange={handleOrder}
      classes={{ root: classes.table }}
    />
  );
};

export default MarketsTable;
