import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { GridToolbarContainer } from '@material-ui/data-grid';
import TransactionModalForm from 'src/pages/portfolios/components/portfolioDetails/components/TransactionModalForm';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerTable } from 'src/ui/EulerTable';
import { EPortfolioItemType } from '../types';
import ItemCard from './ItemCard';
import ItemCardHeader from './ItemCardHeader';
import getColumns from './PairsCard.column';

interface ITransactionTableProps {
  items?: IPortfolioDetailsItem[];
}

const PairsCard: FC<ITransactionTableProps> = ({ items = [] }) => {
  const { t } = useTranslation();
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [shownPairs, setShownPairs] = useState<IPortfolioDetailsItem[]>([]);
  const [item, setItem] = useState<Partial<IPortfolioDetailsItem> | null>(null);

  useEffect(() => {
    if (!viewAll) {
      setShownPairs(items.slice(0, 5));
    } else {
      setShownPairs([...items]);
    }
  }, [viewAll, items]);

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  function onAddContract() {
    setItem({
      type: EPortfolioItemType.PAIR,
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
        rows={shownPairs}
        columns={getColumns(setItem)}
        getRowId={(row: IPortfolioDetailsItem) => row.identifier}
        components={{
          NoRowsOverlay: () => (
            <Typography align="center" variant="body2" position="absolute" top="50%" width="100%">
              {t('PAIRS.ADD_NEW_PAIR')}
            </Typography>
          ),
          Toolbar: () => (
            <GridToolbarContainer>
              <ItemCardHeader
                onViewAll={shownPairs.length >= 5 ? toggleViewAll : null}
                onAddButtonClick={onAddContract}
                addButtonLabel={t('ADD PAIR')}
                viewAll={viewAll}
              />
            </GridToolbarContainer>
          ),
        }}
      />
      {item ? <TransactionModalForm onClose={onCloseModal} item={item} headerLabel={t('PAIR')} /> : null}
    </ItemCard>
  );
};

export default PairsCard;
