import { FC, useCallback, useEffect, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilterState } from 'src/selectors/filters';
import { selectPairDetailDataByAddress } from 'src/selectors/pairDetail';
import { UITableID, tokenExchangeTableDefaultParams } from 'src/slices/filter.types';
import slice, { getExchanges } from 'src/slices/tables/exchanges';
import { setFilterPage, setFilterPageSize, setFilterTable } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { EulerExchangeTable } from 'src/ui/eulerTable/eulerExchangeTable/EulerExchangeTable';

const useStyles = makeStyles(() => ({
  mainCard: {
    overflowX: 'auto',
    width: '100%',
  },
}));

interface IPairExchangeContainerProps {
  address: string;
}

const PairExchangeContainer: FC<IPairExchangeContainerProps> = ({ address }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { detail: pairDetails } = useSelector(selectPairDetailDataByAddress(address));
  const { exchanges, loading = true, displayAge } = useSelector((state) => state.exchanges);

  const tableId = UITableID.pair_exchange_list;
  const filters = useSelector(selectFilterState(tableId));

  const handlePage = useCallback((params) => dispatch(setFilterPage(tableId, params)), [tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(tableId, params)), [tableId]);

  useEffect(() => {
    dispatch(getExchanges(pairDetails?.base_token_address, null, { ...filters.filter }));
  }, [pairDetails?.base_token_address, filters.filter]);

  const newHits = useMemo(
    () => exchanges?.hits?.filter((item) => item._source?.quote_token_address === pairDetails?.quote_token_address),
    [exchanges.hits, pairDetails],
  );

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
    <Box mt={3}>
      <Card className={classes.mainCard}>
        <Box minWidth="1000px">
          <EulerExchangeTable
            getRowId={(row) => row._id}
            exchanges={newHits || []}
            page={filters.filter.page}
            pageSize={filters.filter.size}
            rowCount={newHits.length || 0}
            onPageSizeChange={handleSize}
            onPageChange={handlePage}
            loading={loading || !newHits}
            displayAge={displayAge}
            currentAddress={address}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default PairExchangeContainer;
