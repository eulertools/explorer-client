import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs, { TabPanel } from 'src/components/tabs';
import { WalletDetailTransactionTable } from 'src/pages/wallet/components/WalletDetailTransactionTable';
import { WalletDetailsTokenTransactionTable } from 'src/pages/wallet/components/WalletDetailsTokenTransactionTable';
import { WalletTokenTransactionFilterForm } from 'src/pages/wallet/components/WalletTokenTransactionFilterForm';
import { WalletTransactionFilterForm } from 'src/pages/wallet/components/WalletTransactionFilterForm';
import { selectFilterState } from 'src/selectors/filters';
import { selectWalletTokensSorted } from 'src/selectors/wallets';
import { UITableID } from 'src/slices/filter.types';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import EulerTokenTableWrapper from 'src/ui/eulerTokenTable/EulerTokenTable';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    borderTopRightRadius: '20px !important',
    borderTopLeftRadius: '0 !important',
    background: theme.palette.background.paper,
    '& > div#full-width-tabpanel-1': {
      '& > div': {
        width: '100%',
        overflowX: 'auto',
        borderTopRightRadius: '20px !important',
        borderTopLeftRadius: '0 !important',
      },
    },
    '& > div#full-width-tabpanel-2': {
      background: theme.palette.background.paper,
      '& > div': {
        width: '100%',
        overflowX: 'auto',
        borderTopRightRadius: '20px !important',
        borderTopLeftRadius: '0 !important',
      },
    },
    '& > div#full-width-tabpanel-3': {
      background: theme.palette.background.paper,
      '& > div': {
        width: '100%',
        overflowX: 'auto',
        borderTopRightRadius: '20px !important',
        borderTopLeftRadius: '0 !important',
      },
    },
  },
  transactionFilter: {
    borderTopRightRadius: '0 !important',
  },
  tokenTransactionFilter: {
    borderTopRightRadius: '0 !important',
  },
}));

const tabs = ['Token', 'Txns', 'BEP-20 Token Txns'];

interface WalletTableProps {
  address: string;
}
export const WalletTable = (props: WalletTableProps) => {
  const { address } = props;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const tokens = useSelector(selectWalletTokensSorted);

  const transactionFilters = useSelector(selectFilterState(UITableID.transaction_list));
  const tokenTransactionFilters = useSelector(selectFilterState(UITableID.token_transaction_list));

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Tabs tabs={tabs} currentTab={value} setCurrentTab={setValue} />
        {value !== 0 ? (
          <Box display="flex" alignItems="center">
            <FilterButton tableId={value === 1 ? UITableID.transaction_list : UITableID.token_transaction_list} />
          </Box>
        ) : null}
      </Box>
      <FilterContainer
        tableId={value === 1 ? UITableID.transaction_list : UITableID.token_transaction_list}
        FilterForm={value === 1 ? WalletTransactionFilterForm : WalletTokenTransactionFilterForm}
        topRightBorder
      >
        <Paper
          className={clsx(
            classes.paper,
            { [classes.transactionFilter]: transactionFilters.openFilter && value === 1 },
            { [classes.tokenTransactionFilter]: tokenTransactionFilters.openFilter && value === 2 },
          )}
        >
          <TabPanel currentTab={value} index={0}>
            <Box width="100%" overflow="auto" minWidth="1000px">
              {/* on this case we should use client because we receive the full list */}
              <EulerTokenTableWrapper tokens={tokens} paginationMode="client" />
            </Box>
          </TabPanel>
          <TabPanel currentTab={value} index={1}>
            <Box width="100%" overflow="auto" minWidth="1000px">
              <WalletDetailTransactionTable address={address} />
            </Box>
          </TabPanel>
          <TabPanel currentTab={value} index={2}>
            <Box width="100%" overflow="auto" minWidth="1000px">
              <WalletDetailsTokenTransactionTable address={address} />
            </Box>
          </TabPanel>
        </Paper>
      </FilterContainer>
    </Box>
  );
};
