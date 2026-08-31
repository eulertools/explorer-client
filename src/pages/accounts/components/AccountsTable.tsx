import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { GridPageChangeParams } from '@material-ui/data-grid';
import axios from 'src/lib/axios';
import AccountsGridToolbar from 'src/pages/accounts/components/AccountsGridToolbar';
import { AccountsTableColumns } from 'src/pages/accounts/components/AccountsTableColumns';
import { EulerTable } from 'src/ui/EulerTable';
import { loggerError } from 'src/utils/logger';

const useStyles = makeStyles(() => ({
  dataGrid: {
    border: 'none !important',
  },
}));

type AccountsTableProps = {
  hideToolbar?: boolean;
  toolbarTitle?: string;
};

const AccountsTable: FC<AccountsTableProps> = ({ hideToolbar, toolbarTitle }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(16);

  const classes = useStyles();

  useEffect(() => {
    let mounted = true;
    const fetchAccounts = async () => {
      try {
        if (mounted) {
          setLoading(true);
          const accountsRes = await axios.publicFetchClient.get<{
            accounts: any[];
            // TODO ask gera about this
          }>('api/accounts');
          setAccounts(accountsRes.data.accounts);
        }
      } catch (error) {
        loggerError(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <EulerTable
      table_id="accounts_table"
      className={classes.dataGrid}
      disableColumnFilter
      disableColumnMenu
      pageSize={pageSize}
      rows={accounts}
      rowsPerPageOptions={[8, 16, 32]}
      columns={AccountsTableColumns}
      loading={loading}
      components={{
        Toolbar: !hideToolbar && toolbarTitle ? () => <AccountsGridToolbar title={toolbarTitle} /> : () => <></>,
      }}
      autoHeight
      onPageSizeChange={(pageParams: GridPageChangeParams) => {
        setPageSize(pageParams.pageSize);
      }}
    />
  );
};

export default AccountsTable;
