import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { GridAlignment, GridCellParams, GridColumnHeaderParams } from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '16px',
    width: '100%',
  },
  cell: {
    width: '100%',
    color: theme.palette.primary.main,
  },
}));

export const PairTransactionColumns = [
  {
    align: 'center' as GridAlignment,
    field: 'action',
    headerName: '',
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      return <Typography className={classes.cell}>{params.value}</Typography>;
    },
    renderHeader: () => {
      const classes = useStyles();
      return <span className={classes.header} />;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'totalValue',
    headerName: 'Total Value',
    flex: 1,
    renderHeader: (params: GridColumnHeaderParams) => {
      const classes = useStyles();
      return <span className={classes.header}>{params.colDef.headerName}</span>;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'totalAmount',
    headerName: 'Total Amount',
    flex: 1,
    renderHeader: (params: GridColumnHeaderParams) => {
      const classes = useStyles();
      return <span className={classes.header}>{params.colDef.headerName}</span>;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'tokenAmount',
    headerName: 'Token Amount',
    flex: 1,
    renderHeader: (params: GridColumnHeaderParams) => {
      const classes = useStyles();
      return <span className={classes.header}>{params.colDef.headerName}</span>;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'account',
    headerName: 'Account',
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      return <Typography className={classes.cell}>{params.value}</Typography>;
    },
    renderHeader: (params: GridColumnHeaderParams) => {
      const classes = useStyles();
      return <span className={classes.header}>{params.colDef.headerName}</span>;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'time',
    headerName: 'Time',
    flex: 1,
    renderHeader: (params: GridColumnHeaderParams) => {
      const classes = useStyles();
      return <span className={classes.header}>{params.colDef.headerName}</span>;
    },
  },
];
