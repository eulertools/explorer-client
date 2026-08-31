import { FC, useMemo, useEffect, useState } from 'react';
import { getExchangeData } from 'src/slices/tables/exchanges';
import { PairTransaction } from 'src/types/blockchain';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { checksumAddress } from 'src/utils/stringUtils';
import { columnsPairTransactions } from './columns';

interface IPairTransactionsTableProps extends Omit<EulerTableProps, 'rows' | 'columns'> {
  transactions: PairTransaction[];
  displayAge: boolean;
  baseSymbol: string;
  quoteSymbol: string;
  prefix?: string;
  eulerView?: boolean;
}

export const EulerPairTransactionTable: FC<IPairTransactionsTableProps> = ({
  transactions,
  displayAge,
  baseSymbol,
  quoteSymbol,
  prefix,
  eulerView = false,
  ...rest
}) => {
  const [pairs, setPairs] = useState<any[]>([]);
  const [rows, setRows] = useState<any>([]);

  const getPairs = async () => {
    const unique = new Set<string>();
    transactions.forEach((i) => unique.add(checksumAddress(i.address)));
    const pairAddresses = Array.from(unique.values());
    const arrayPromise = pairAddresses.map((p) => getExchangeData(p, prefix));
    const promises = await Promise.all(arrayPromise);
    setPairs(promises);
  };

  useEffect(() => {
    getPairs();
    setRows([]);
  }, [transactions]);

  useEffect(() => {
    if (pairs.length > 0) {
      const customTransactions = transactions.map((t, i) => {
        const pair = pairs.find((p) => p.address.toLowerCase() === t.address.toLowerCase());
        let inverted = false;
        if (baseSymbol !== pair.base_token_symbol) inverted = true;
        return {
          id: `${i}_${t.transaction_hash}`,
          base_token_symbol: pair.base_token_symbol,
          quote_token_symbol: pair.quote_token_symbol,
          pair_symbol: pair.symbol,
          inverted,
          ...t,
        };
      });
      setRows(customTransactions);
    }
  }, [pairs]);

  const customColumns = useMemo(() => columnsPairTransactions({ displayAge, baseSymbol, quoteSymbol, eulerView }), [
    displayAge,
    baseSymbol,
    quoteSymbol,
    eulerView,
  ]);

  return <EulerTable {...rest} rows={rows} columns={customColumns} />;
};
