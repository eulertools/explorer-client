import { FC, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { GridToolbarContainer } from '@material-ui/data-grid';
import TransactionModalForm from 'src/pages/portfolios/components/portfolioDetails/components/TransactionModalForm';
import { getTokensDetails } from 'src/slices/tables/tokens';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';
import { EulerTable } from 'src/ui/EulerTable';
import { EPortfolioItemType } from '../types';
import ItemCard from './ItemCard';
import ItemCardHeader from './ItemCardHeader';
import getColumns from './TokensCard.columns';

const MAX_TOKENS = 5;

interface ITokenTableProps {
  items?: IPortfolioDetailsItem[];
}

const TokenTable: FC<ITokenTableProps> = memo(
  ({ items = [] }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { portfolioTokens = [], loading } = useSelector((state) => state.tokens);

    const [viewAll, setViewAll] = useState(false);
    const [item, setItem] = useState<Partial<IPortfolioDetailsItem> | null>(null);

    function onAddToken() {
      setItem({
        type: EPortfolioItemType.TOKEN,
      });
    }

    function onCloseModal() {
      setItem(null);
    }

    function onViewAll() {
      setViewAll(!viewAll);
    }

    useEffect(() => {
      dispatch(getTokensDetails(items));
    }, [items]);

    const rows = useMemo(() => (viewAll ? portfolioTokens : portfolioTokens.slice(0, MAX_TOKENS)), [
      viewAll,
      portfolioTokens,
    ]);

    return (
      <>
        <ItemCard>
          <EulerTable
            autoHeight
            disableColumnFilter
            disableColumnMenu
            disableSelectionOnClick
            hideFooterPagination
            loading={loading}
            rows={rows}
            columns={getColumns(setItem)}
            getRowId={(row) => row._id}
            components={{
              NoRowsOverlay: () => (
                <Typography align="center" variant="body2" position="absolute" top="50%" width="100%">
                  {t('TOKEN.FIRST_TOKEN')}
                </Typography>
              ),
              Toolbar: () => (
                <GridToolbarContainer>
                  <ItemCardHeader
                    onViewAll={portfolioTokens.length > MAX_TOKENS ? onViewAll : null}
                    onAddButtonClick={onAddToken}
                    addButtonLabel={t('TOKEN.ADD_TOKEN')}
                    viewAll={viewAll}
                  />
                </GridToolbarContainer>
              ),
            }}
          />
        </ItemCard>
        {item ? <TransactionModalForm onClose={onCloseModal} item={item} headerLabel={t('TOKEN.TOKEN')} /> : null}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.items.length === nextProps.items.length &&
    nextProps.items.every((ni) => prevProps.items.find((pi) => pi.identifier === ni.identifier)),
);

export default TokenTable;
