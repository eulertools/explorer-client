import IconButton from '@material-ui/core/IconButton';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import { ITransactionDetailsItem } from 'src/pages/portfolios/components/portfolioDetails/types';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { addressColumn } from 'src/ui/eulerTable/addressColumn';
import { txnsColumn } from 'src/ui/eulerTable/txnsColumn';

const getColumns = (onEditItem: React.Dispatch<React.SetStateAction<Partial<ITransactionDetailsItem>>>) => [
  txnsColumn({
    type: EulerAddressTypes.txns,
    field: 'hash',
    headerName: 'Txn Hash',
    flex: 1,
  }),
  addressColumn({
    type: EulerAddressTypes.address,
    field: 'from_address',
    headerName: 'From',
  }),
  addressColumn({
    type: EulerAddressTypes.address,
    field: 'to_address',
    headerName: 'To',
  }),
  {
    flex: 1,
    headerAlign: 'center' as GridAlignment,
    field: 'name',
    headerName: 'Custom Name',
    align: 'center' as GridAlignment,
  },
  {
    align: 'center' as GridAlignment,
    field: '',
    headerName: '',
    disableClickEventBubbling: true,
    renderCell: (params: GridCellParams) => {
      function onEditClick() {
        onEditItem((params.row as unknown) as ITransactionDetailsItem);
      }

      return (
        <IconButton color="primary" aria-label="upload picture" component="span" onClick={onEditClick}>
          <EditIcon fontSize="small" />
        </IconButton>
      );
    },
  },
];

export default getColumns;
