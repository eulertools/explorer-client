import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { GridToolbarContainer } from '@material-ui/data-grid';
import TransactionModalForm from 'src/pages/portfolios/components/portfolioDetails/components/TransactionModalForm';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerTable } from 'src/ui/EulerTable';
import { EPortfolioItemType } from '../types';
import getColumns from './ContractsCard.columns';
import ItemCard from './ItemCard';
import ItemCardHeader from './ItemCardHeader';

interface ITransactionTableProps {
  items?: IPortfolioDetailsItem[];
}

const TransactionTable: FC<ITransactionTableProps> = ({ items = [] }) => {
  // TODO this items array is going to grow exponentially impacting user experience
  // TODO2 we can improve it by doing one run to filter all items
  const { t } = useTranslation();
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [shownContracts, setShownContracts] = useState<IPortfolioDetailsItem[]>([]);
  const [item, setItem] = useState<Partial<IPortfolioDetailsItem> | null>(null);

  useEffect(() => {
    if (!viewAll) {
      setShownContracts(items.slice(0, 5));
    } else {
      setShownContracts([...items]);
    }
  }, [viewAll, items]);

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  function onAddContract() {
    setItem({
      type: EPortfolioItemType.CONTRACT,
    });
  }

  function onCloseModal() {
    setItem(null);
  }

  return (
    <ItemCard>
      <EulerTable
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        autoHeight
        hideFooterPagination
        rows={shownContracts}
        columns={getColumns(setItem)}
        getRowId={(row: IPortfolioDetailsItem) => row.identifier}
        components={{
          NoRowsOverlay: () => (
            <Typography align="center" variant="body2" position="absolute" top="50%" width="100%">
              {t('CONTRACTS.ADD_NEW_CONTRACT')}
            </Typography>
          ),
          Toolbar: () => (
            <GridToolbarContainer>
              <ItemCardHeader
                onViewAll={shownContracts.length >= 5 ? toggleViewAll : null}
                onAddButtonClick={onAddContract}
                addButtonLabel={t('ADD CONTRACT')}
                viewAll={viewAll}
              />
            </GridToolbarContainer>
          ),
        }}
      />
      {item ? <TransactionModalForm onClose={onCloseModal} item={item} headerLabel={t('CONTRACT')} /> : null}
    </ItemCard>
  );
};

export default TransactionTable;
