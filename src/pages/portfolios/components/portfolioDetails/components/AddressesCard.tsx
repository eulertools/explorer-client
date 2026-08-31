import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { GridToolbarContainer } from '@material-ui/data-grid';
import TransactionModalForm from 'src/pages/portfolios/components/portfolioDetails/components/TransactionModalForm';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerTable } from 'src/ui/EulerTable';
import { EPortfolioItemType } from '../types';
import getColumns from './AddressesCard.columns';
import ItemCard from './ItemCard';
import ItemCardHeader from './ItemCardHeader';

interface ITransactionTableProps {
  items?: IPortfolioDetailsItem[];
}

const AddressesCard: FC<ITransactionTableProps> = ({ items = [] }) => {
  const { t } = useTranslation();
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [shownAddresses, setShownAddresses] = useState<IPortfolioDetailsItem[]>([]);
  const [item, setItem] = useState<Partial<IPortfolioDetailsItem> | null>(null);

  useEffect(() => {
    if (!viewAll) {
      setShownAddresses(items.slice(0, 5));
    } else {
      setShownAddresses([...items]);
    }
  }, [viewAll, items]);

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  function onAddContract() {
    setItem({
      type: EPortfolioItemType.ADDRESS,
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
        rows={shownAddresses}
        columns={getColumns(setItem)}
        getRowId={(row: IPortfolioDetailsItem) => row.identifier}
        components={{
          NoRowsOverlay: () => (
            <Typography align="center" variant="body2" position="absolute" top="50%" width="100%">
              {t('ADDRESSES.ADD_NEW_ADDRESS')}
            </Typography>
          ),
          Toolbar: () => (
            <GridToolbarContainer>
              <ItemCardHeader
                onViewAll={shownAddresses.length >= 5 ? toggleViewAll : null}
                onAddButtonClick={onAddContract}
                addButtonLabel={t('ADD ADDRESS')}
                viewAll={viewAll}
              />
            </GridToolbarContainer>
          ),
        }}
      />
      {item ? <TransactionModalForm onClose={onCloseModal} item={item} headerLabel={t('ADDRESS')} /> : null}
    </ItemCard>
  );
};

export default AddressesCard;
