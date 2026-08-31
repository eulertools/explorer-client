import { FC, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { Box } from '@material-ui/core';
import { GridRowParams } from '@material-ui/data-grid';
import useAuth from 'src/hooks/useAuth';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { getPairsList } from 'src/slices/tables/pairs';
import { setFilterPage, setFilterPageSize, setFilterOrder } from 'src/slices/ui/filters';
import { openModal } from 'src/slices/ui/globalModal';
import { getFavorites } from 'src/slices/user/favorites';
import { getPortfolios } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { EulerTable } from 'src/ui/EulerTable';
import { extractPairAddress } from 'src/utils/stringUtils';
import { pairsTableColumns } from './pairs-table.columns';

interface IProps {
  tableId: UITableID;
}

export const PairsTable: FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { network } = useParams();

  const filters = useSelector(selectFilterState(props.tableId));
  const { pairs, loading, total } = useSelector((state) => state.pairs);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getPortfolios());
      dispatch(getFavorites());
    }
  }, []);

  const handlePage = useCallback((params) => dispatch(setFilterPage(props.tableId, params)), [props.tableId]);
  const handleSize = useCallback((params) => dispatch(setFilterPageSize(props.tableId, params)), [props.tableId]);
  const handleOrder = useCallback((params) => dispatch(setFilterOrder(props.tableId, params)), [props.tableId]);

  useEffect(() => {
    dispatch(getPairsList(filters.filter));
  }, [filters.filter, network]);

  const handleModal = useCallback(
    (params: GridRowParams) => {
      const address = extractPairAddress(params.row.address);
      dispatch(
        openModal({
          identifier: address,
          type: EulerAddressTypes.lptoken,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Box pr={1}>
      <EulerTable
        table_id="pairs_table"
        getRowId={(row) => row.identifier}
        rows={pairs}
        rowCount={total}
        columns={pairsTableColumns({ handleModal, network })}
        loading={loading}
        components={{
          Toolbar: () => <></>,
        }}
        onPageSizeChange={handleSize}
        onPageChange={handlePage}
        onSortModelChange={handleOrder}
      />
    </Box>
  );
};
