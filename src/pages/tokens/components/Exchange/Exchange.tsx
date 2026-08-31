import { FC, useEffect, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { selectExchange } from 'src/selectors/exchange';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID, tokenExchangeTableDefaultParams } from 'src/slices/filter.types';
import slice, { getExchanges } from 'src/slices/tables/exchanges';
import { setFilterPage, setFilterPageSize, setFilterTable } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { EulerExchangeTable } from 'src/ui/eulerTable/eulerExchangeTable/EulerExchangeTable';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(0),
    overflowX: 'auto',
    width: '100%',
  },
}));

interface IExchangeProps {
  address?: string;
  prefix?: string;
  eulerView?: boolean;
}

const Exchange: FC<IExchangeProps> = ({ address, prefix, eulerView }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { exchanges, loading = true, displayAge } = useSelector(selectExchange);

  const tableId = UITableID.token_exchange_list;
  const filters = useSelector(selectFilterState(tableId));

  const handlePage = useCallback((params) => dispatch(setFilterPage(tableId, params)), [tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(tableId, params)), [tableId]);

  useEffect(() => {
    dispatch(getExchanges(address, null, { ...filters.filter }, prefix));
  }, [address, filters.filter]);

  useEffect(
    () => () => {
      dispatch(setFilterTable(tableId, tokenExchangeTableDefaultParams));
      dispatch(
        slice.actions.setExchanges({
          hits: [],
          total: {
            value: 0,
            relation: '',
          },
        }),
      );
    },
    [],
  );

  return (
    <Box pt={2}>
      <Card className={classes.card}>
        <Box minWidth="1000px">
          <EulerExchangeTable
            getRowId={(row) => row._id}
            exchanges={exchanges ? exchanges.hits : []}
            page={filters.filter.page}
            pageSize={filters.filter.size}
            rowCount={exchanges && exchanges.total.value}
            onPageSizeChange={handleSize}
            onPageChange={handlePage}
            loading={loading || !exchanges?.hits}
            displayAge={displayAge}
            currentAddress={address}
            eulerView={eulerView}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Exchange;
