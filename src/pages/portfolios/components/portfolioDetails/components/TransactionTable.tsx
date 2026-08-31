import _slice from 'lodash/slice';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { GridToolbarContainer } from '@material-ui/data-grid';
import axios from 'src/lib/axios';
import ItemCardHeader from 'src/pages/portfolios/components/portfolioDetails/components/ItemCardHeader';
import { EPortfolioItemType, ITransactionDetailsItem } from 'src/pages/portfolios/components/portfolioDetails/types';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerTable } from 'src/ui/EulerTable';
import { loggerError } from 'src/utils/logger';
import TransactionModalForm from './TransactionModalForm';
import getColumns from './TransactionTable.columns';

interface ITransactionTableProps {
  transactions?: IPortfolioDetailsItem[];
}

const TransactionTable: FC<ITransactionTableProps> = ({ transactions = [] }) => {
  const { t } = useTranslation();
  const [viewAll, setViewAll] = useState(false);
  const [shownTransactions, setShownTransactions] = useState<ITransactionDetailsItem[]>([]);
  const [item, setItem] = useState(null);
  const [fetchingTxData, setFetchingTxData] = useState<boolean>(true);
  const [errorFetching, setErrorFetching] = useState<boolean>(false);

  function onAddTransaction() {
    setItem({
      type: EPortfolioItemType.TRANSACTION,
    });
  }

  function onClose() {
    setItem(null);
  }

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  useEffect(() => {
    async function fetchAllTxData(_transactions: IPortfolioDetailsItem[]) {
      const promises = [];

      try {
        _transactions.forEach((transaction) => {
          const txDetailsPromise = axios.publicFetchClient
            .get(`transactions/${transaction.identifier}`)
            .then((response) => ({
              ...transaction,
              ...response.data,
            }))
            .catch(
              () =>
                // TODO remove once BE works with all addresses and replace this return with error
                ({
                  ...transaction,
                  blockHash: '-',
                  blockNumber: 0,
                  from_address: '-',
                  gas: 0,
                  gas_price: '0',
                  hash: transaction.identifier,
                  to_address: '-',
                  value: '0',
                }),

              // throw new Error('Error fetching transaction details.');
            );

          promises.push(txDetailsPromise);
        });

        const shownTransactionsWithDetails = await Promise.all(promises);

        setShownTransactions(shownTransactionsWithDetails);
      } catch (error) {
        loggerError(error);
        // Defaulting to no transactions and show error
        setErrorFetching(true);
        setShownTransactions([]);
      }

      setFetchingTxData(false);
    }

    if (!viewAll) {
      fetchAllTxData(_slice(transactions, 0, 5));
    } else {
      fetchAllTxData([...transactions]);
    }
  }, [viewAll, transactions]);

  return (
    <>
      <EulerTable
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        hideFooterPagination
        autoHeight
        loading={fetchingTxData}
        rows={shownTransactions}
        columns={getColumns(setItem)}
        getRowId={(row: ITransactionDetailsItem) => row.hash}
        components={{
          NoRowsOverlay: () => (
            <Typography align="center" variant="body2" position="absolute" top="50%" width="100%">
              {errorFetching ? t('TRANSACTIONS.FETCHING_ERROR') : t('TRANSACTIONS.FIRST_TRANSACTION')}
            </Typography>
          ),
          Toolbar: () => (
            <GridToolbarContainer>
              <ItemCardHeader
                onViewAll={shownTransactions.length >= 5 ? toggleViewAll : null}
                onAddButtonClick={onAddTransaction}
                addButtonLabel={t('ADD TRANSACTION')}
                viewAll={viewAll}
              />
            </GridToolbarContainer>
          ),
        }}
      />
      {item ? <TransactionModalForm onClose={onClose} item={item} headerLabel={t('TRANSACTION')} /> : null}
    </>
  );
};

export default TransactionTable;
