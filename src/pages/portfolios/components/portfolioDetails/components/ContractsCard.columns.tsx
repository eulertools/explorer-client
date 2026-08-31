import IconButton from '@material-ui/core/IconButton';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { addressColumn } from 'src/ui/eulerTable/addressColumn';

const getColumns = (onEditItem: React.Dispatch<React.SetStateAction<Partial<IPortfolioDetailsItem>>>) => [
  addressColumn({
    field: 'identifier',
    headerName: 'Contract',
    type: EulerAddressTypes.contract,
  }),
  {
    flex: 2.25,
    headerAlign: 'center' as GridAlignment,
    align: 'center' as GridAlignment,
    field: 'name',
    headerName: 'Name',
  },
  {
    align: 'center' as GridAlignment,
    field: '',
    headerName: '',
    disableClickEventBubbling: true,
    renderCell: (params: GridCellParams) => {
      function onEditClick() {
        onEditItem((params.row as unknown) as IPortfolioDetailsItem);
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
