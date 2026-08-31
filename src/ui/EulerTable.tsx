import { FC } from 'react';
import { DataGrid, DataGridProps } from '@material-ui/data-grid';
import { useStyle } from './eulerTable/styles';

export interface EulerTableSort {
  field: string;
  sort: 'asc' | 'desc';
}
export interface EulerTableProps extends DataGridProps {
  table_id?: string;
}

export const EulerTable: FC<EulerTableProps> = (props) => {
  const classes = useStyle();
  return (
    <DataGrid
      disableColumnFilter
      disableColumnMenu
      autoHeight
      disableSelectionOnClick
      pageSize={16}
      rowsPerPageOptions={[16, 32]}
      paginationMode="server"
      className={classes.datagrid}
      sortingOrder={['asc', 'desc']}
      components={{
        Toolbar: () => <></>,
      }}
      {...props}
    />
  );
};
