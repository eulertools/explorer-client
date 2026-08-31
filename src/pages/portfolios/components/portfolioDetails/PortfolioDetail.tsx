import { FC, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IPortfolio, IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { useSelector } from 'src/store';
import { EulerTabs } from 'src/ui/EulerTabs';
import AddressesCard from './components/AddressesCard';
import ContractsCard from './components/ContractsCard';
import TokensCard from './components/TokensCard';
import TransactionsCard from './components/TransactionsCard';
import { EPortfolioItemType } from './types';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  currentTab: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, currentTab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={currentTab !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {currentTab === index ? children : null}
    </div>
  );
}
interface IItemsData {
  transactions: IPortfolioDetailsItem[];
  tokens: IPortfolioDetailsItem[];
  contracts: IPortfolioDetailsItem[];
  pairs: IPortfolioDetailsItem[];
  addresses: IPortfolioDetailsItem[];
}

const PortfolioDetail: FC = () => {
  const { network } = useParams();
  const { portfolios = [], selected: selectedPortfolio = null } = useSelector((state) => state.portfolios);
  const [details, setDetails] = useState<IPortfolio>(null);
  const [itemsData, setItemsData] = useState<IItemsData>();
  const [currentTab, setCurrentTab] = useState<number>(0);

  useEffect(() => {
    const currentPortfolioDetails = portfolios.find((pd) => pd.identifier === selectedPortfolio.identifier);

    if (currentPortfolioDetails) {
      const { items = [] } = currentPortfolioDetails;

      const reducedItems = items
        .filter((i) => i.network === network)
        .reduce(
          (acc, i) => {
            switch (i.type) {
              case EPortfolioItemType.TRANSACTION: {
                acc.transactions.push(i);
                break;
              }
              case EPortfolioItemType.TOKEN: {
                acc.tokens.push(i);
                break;
              }
              case EPortfolioItemType.CONTRACT: {
                acc.contracts.push(i);
                break;
              }
              case EPortfolioItemType.ADDRESS: {
                acc.addresses.push(i);
                break;
              }
              case EPortfolioItemType.PAIR: {
                acc.pairs.push(i);
                break;
              }
              default:
                break;
            }

            return acc;
          },
          {
            transactions: [],
            tokens: [],
            wallets: [],
            contracts: [],
            pairs: [],
            addresses: [],
          },
        );

      setItemsData(reducedItems);
      setDetails(currentPortfolioDetails);
    }
  }, [portfolios, selectedPortfolio, network]);

  if (details === null) {
    return <Typography color="textPrimary">Error fetching portfolio details. Please refresh.</Typography>;
  }

  if (!details) {
    return (
      <Grid container alignItems="center" justifyContent="center" display="flex" height="100%">
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box minHeight="100%" sx={{ backgroundColor: 'background.default' }}>
      <EulerTabs
        titles={['Tokens', 'Transactions', 'Contracts', 'Addresses']}
        selected={currentTab}
        setSelected={setCurrentTab}
      />
      <TabPanel currentTab={currentTab} index={0}>
        <TokensCard items={itemsData.tokens} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={1}>
        <TransactionsCard items={itemsData.transactions} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={2}>
        <ContractsCard items={itemsData.contracts} />
      </TabPanel>
      <TabPanel currentTab={currentTab} index={3}>
        <AddressesCard items={itemsData.addresses} />
      </TabPanel>
    </Box>
  );
};

export default PortfolioDetail;
