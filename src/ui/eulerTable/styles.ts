import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    overflowEllipsis: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    header: {
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '16px',
      width: '100%',
    },
    customHeader: {
      fontSize: '13px',
      color: 'terciary-700',
      fontWeight: 600,
    },
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    left: {
      textAlign: 'left',
    },
    success: {
      color: theme.palette.success.main,
    },
    error: {
      color: theme.palette.error.main,
    },
    datagrid: {
      border: 'none !important',
      '& .MuiDataGrid-columnSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: `${theme.spacing(0.3)} solid ${theme.palette.background.default}`,
        padding: theme.spacing(0),
        '&:focus': {
          outline: 'none',
        },
        '&:focus-within': {
          outline: 'none',
        },
      },
    },
    star: {
      color: '#f3ba2f',
    },
    headerLink: {
      color: theme.palette.primary.main,
    },
  }),
);
