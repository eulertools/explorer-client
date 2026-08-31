import { FC, memo } from 'react';
import Box from '@material-ui/core/Box';
import TransactionTable from 'src/pages/portfolios/components/portfolioDetails/components/TransactionTable';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import ItemCard from './ItemCard';

interface ITransactionsCardProps {
  items: IPortfolioDetailsItem[];
}

// Transaction information won't change so only update it once or when we have a new one
const TransactionsCard: FC<ITransactionsCardProps> = memo(
  (props) => {
    const { items } = props;

    return (
      <Box>
        <ItemCard>
          <TransactionTable transactions={items} />
        </ItemCard>
      </Box>
    );
  },
  (prevProps, nextProps) =>
    nextProps.items.length === prevProps.items.length &&
    nextProps.items.every((ni) => prevProps.items.find((pi) => pi.identifier === ni.identifier)),
);

export default TransactionsCard;
