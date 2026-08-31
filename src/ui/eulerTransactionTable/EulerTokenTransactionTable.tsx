import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TokenTransaction } from 'src/types/blockchain';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { columnsTokenTransactions } from './columns';

const useStyles = makeStyles(() => ({
  table: {
    '& .MuiTypography-root': {
      fontSize: '13px',
    },
  },
}));

interface TokenTransactionsTableProps extends Omit<EulerTableProps, 'rows' | 'columns'> {
  currentAddress: string;
  transactions: TokenTransaction[];
  displayAge: boolean;
  network: string;
}

export const EulerTokenTransactionTable = (props: TokenTransactionsTableProps) => {
  const { transactions, displayAge, currentAddress, network, ...rest } = props;
  const classes = useStyles();

  const customTransactions = React.useMemo(
    () => transactions.map((t, i) => ({ id: `${i}_${t.transaction_hash}`, ...t })),
    [transactions],
  );
  const customColumns = React.useMemo(() => columnsTokenTransactions({ displayAge, currentAddress, network }), [
    displayAge,
    currentAddress,
    network,
  ]);

  return <EulerTable {...rest} rows={customTransactions} columns={customColumns} classes={{ root: classes.table }} />;
};
