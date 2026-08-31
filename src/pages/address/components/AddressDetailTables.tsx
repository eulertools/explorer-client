import clsx from 'clsx';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AddressDetailTokenTransactionFilterForm } from 'src/pages/address/components/AddressDetailTokenTransactionFilterForm';
import { AddressDetailTransactionFilterForm } from 'src/pages/address/components/AddressDetailTransactionFilterForm';
import { AddressDetailsTokenTransactionTable } from 'src/pages/address/components/AddressDetailsTokenTransactionTable';
import { AddressDetailTransactionTable } from 'src/pages/address/components/AddressDetailsTransactionTable';
import { selectAddressDetailTokensWithQuantity } from 'src/selectors/address';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { CardRoot } from 'src/ui/CardRoot';
import { EulerTabs } from 'src/ui/EulerTabs';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import EulerTokenTableWrapper from 'src/ui/eulerTokenTable/EulerTokenTable';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    background: theme.palette.background.paper,
    '& > div#full-width-tabpanel-1': {
      '& > div': {
        width: '100%',
        overflowX: 'auto',
      },
    },
    '& > div#full-width-tabpanel-2': {
      background: theme.palette.background.paper,
      '& > div': {
        width: '100%',
        overflowX: 'auto',
      },
    },
    '& > div#full-width-tabpanel-3': {
      background: theme.palette.background.paper,
      '& > div': {
        width: '100%',
        overflowX: 'auto',
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

const tabs = ['Token', 'Txns', 'Bep-20 Token Txns'];

export const AddressDetailTables: FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { addressId } = useParams();
  const addressTokens = useSelector(selectAddressDetailTokensWithQuantity);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const transactionFilters = useSelector(selectFilterState(UITableID.transaction_list));
  const tokenTransactionFilters = useSelector(selectFilterState(UITableID.token_transaction_list));

  return (
    <Box mt={3} mb={2}>
      <Box
        sx={{
          marginY: theme.spacing(2),
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: '1fr 3fr',
          background: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: '100%',
        }}
      >
        <EulerTabs titles={tabs} selected={value} setSelected={setValue} />
      </Box>
      <Box display="flex" justifyContent="end" mb={1}>
        {value !== 0 ? (
          <FilterButton tableId={value === 1 ? UITableID.transaction_list : UITableID.token_transaction_list} />
        ) : null}
      </Box>
      <FilterContainer
        tableId={value === 1 ? UITableID.transaction_list : UITableID.token_transaction_list}
        FilterForm={value === 1 ? AddressDetailTransactionFilterForm : AddressDetailTokenTransactionFilterForm}
        topRightBorder
      >
        <Paper
          elevation={0}
          className={clsx(
            classes.paper,
            { [classes.transactionFilter]: transactionFilters.openFilter && value === 1 },
            { [classes.tokenTransactionFilter]: tokenTransactionFilters.openFilter && value === 2 },
          )}
        >
          <BasicTabPanel value={value} index={0}>
            <CardRoot>
              <EulerTokenTableWrapper tokens={addressTokens} paginationMode="client" />
            </CardRoot>
          </BasicTabPanel>
          <BasicTabPanel value={value} index={1}>
            <CardRoot>
              <AddressDetailTransactionTable address={addressId} />
            </CardRoot>
          </BasicTabPanel>
          <BasicTabPanel value={value} index={2}>
            <CardRoot>
              <AddressDetailsTokenTransactionTable address={addressId} />
            </CardRoot>
          </BasicTabPanel>
        </Paper>
      </FilterContainer>
    </Box>
  );
};
