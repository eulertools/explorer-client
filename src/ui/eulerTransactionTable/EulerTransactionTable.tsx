import React from 'react';
import { Transaction } from 'src/types/blockchain';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { columnsTransactions } from './columns';

interface TransactionsTableProps extends Omit<EulerTableProps, 'rows' | 'columns'> {
  currentAddress: string;
  transactions: Transaction[];
  displayAge: boolean;
  network: string;
}

export const EulerTransactionTable = (props: TransactionsTableProps) => {
  const { transactions, displayAge, currentAddress, network, ...rest } = props;

  const customTransactions = React.useMemo(() => transactions.map((t, i) => ({ id: `${i}_${t.hash}`, ...t })), [
    transactions,
  ]);
  const customColumns = React.useMemo(() => columnsTransactions({ displayAge, currentAddress, network }), [
    displayAge,
    currentAddress,
    network,
  ]);

  return <EulerTable {...rest} rows={customTransactions} columns={customColumns} />;
};
