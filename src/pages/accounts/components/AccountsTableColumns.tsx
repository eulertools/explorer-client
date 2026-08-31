import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { GridAlignment, GridCellParams, GridColumnHeaderParams, GridColumns } from '@material-ui/data-grid';
import useSettings from 'src/hooks/useSettings';
import { setAddressType } from 'src/slices/entities/address';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';

const useStyles = makeStyles(() => ({
  header: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '16px',
    width: '100%',
  },
}));

const renderHeader = (params: GridColumnHeaderParams) => {
  const classes = useStyles();
  return <TruncatedTooltipText className={classes.header} value={params.colDef.headerName} />;
};

export const AccountsTableColumns: GridColumns = [
  {
    align: 'center' as GridAlignment,
    field: 'address',
    headerName: 'Address',
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { settings } = useSettings();

      return (
        <TruncatedTooltipText
          value={
            <Link
              onClick={(e) => {
                e.preventDefault();
                dispatch(setAddressType('default'));
                navigate(`/${settings.network}/address/${params.value}`);
              }}
              href="#"
            >
              {params.value}
            </Link>
          }
          title={params.value.toString()}
        />
      );
    },
    renderHeader,
  },
  {
    align: 'center' as GridAlignment,
    field: 'nameTag',
    headerName: 'Name Tag',
    flex: 1,
    renderHeader,
    renderCell: (params: GridCellParams) => <TruncatedTooltipText value={params.value} />,
  },
  {
    align: 'center' as GridAlignment,
    field: 'balance',
    headerName: 'Balance',
    flex: 1,
    renderHeader,
    renderCell: (params: GridCellParams) => <TruncatedTooltipText value={`${params.value.toLocaleString()} BNB`} />,
  },
  {
    align: 'center' as GridAlignment,
    field: 'percentage',
    headerName: 'Percentage',
    flex: 1,
    renderHeader,
    renderCell: (params: GridCellParams) => <TruncatedTooltipText value={`${params.value.toLocaleString()}%`} />,
  },
  {
    align: 'center' as GridAlignment,
    field: 'txnCount',
    headerName: 'Txn Count',
    flex: 1,
    renderHeader,
    renderCell: (params: GridCellParams) => <TruncatedTooltipText value={params.value.toLocaleString()} />,
  },
];
