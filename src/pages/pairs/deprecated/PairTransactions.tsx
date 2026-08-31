import { FC, useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { GridPageChangeParams } from '@material-ui/data-grid';
import { PairTransactionColumns } from 'src/pages/pairs/deprecated/PairTransactionColumns';
import { EulerTable } from 'src/ui/EulerTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
    dataGrid: {
      borderRadius: '0px 0px 20px 20px',
    },
    filterToggle: {
      '& > button': {
        border: 'none',
        padding: '10px 34px 6px 34px',
        boxSizing: 'border-box',
        borderRadius: '20px 20px 0px 0px',
        '& > span': {
          '& > h6': {
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '27px',
            padding: '0px 6px',
            textTransform: 'none',
          },
        },
      },
    },
    selectedButton: {
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&>span': {
          '&>h6': {
            color: theme.palette.primary.contrastText,
          },
        },
      },
      '&.Mui-selected:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }),
);

const mockTransactions = [
  {
    id: 1,
    action: 'Swap XKAT for BUSD',
    totalValue: '$14,018',
    totalAmount: '7540 XKAT',
    tokenAmount: '14.014 BUSD',
    account: '0x6bf0...b64e',
    time: '10 secs ago',
  },
  {
    id: 2,
    action: 'Remove BUSD and XKAT',
    totalValue: '$21,543',
    totalAmount: '10.769 BUSD',
    tokenAmount: '5740 XKAT',
    account: '0x6bf0...b64e',
    time: '10 secs ago',
  },
  {
    id: 3,
    action: 'Add BUSD and XKAT',
    totalValue: '$306.11',
    totalAmount: '152,996 BUSD',
    tokenAmount: '81,443 XKAT',
    account: '0x9c57...e224',
    time: '12 secs ago',
  },
];

interface ToolbarProps {
  value: string;
  setValue: React.Dispatch<string>;
}

const Toolbar: FC<ToolbarProps> = ({ value, setValue }) => {
  const classes = useStyles();

  const handleToggle = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue) setValue(newValue);
  };

  return (
    <ToggleButtonGroup className={classes.filterToggle} value={value} exclusive onChange={handleToggle}>
      <ToggleButton classes={{ root: classes.selectedButton }} size="small" value="all" aria-label="left aligned">
        <Typography align="center" color="textSecondary" variant="subtitle2">
          All
        </Typography>
      </ToggleButton>
      <ToggleButton classes={{ root: classes.selectedButton }} size="small" value="swap" aria-label="left aligned">
        <Typography align="center" color="textSecondary" variant="subtitle2">
          Swaps
        </Typography>
      </ToggleButton>
      <ToggleButton classes={{ root: classes.selectedButton }} size="small" value="add" aria-label="centered">
        <Typography align="center" color="textSecondary" variant="subtitle2">
          Adds
        </Typography>
      </ToggleButton>
      <ToggleButton classes={{ root: classes.selectedButton }} size="small" value="remove" aria-label="centered">
        <Typography align="center" color="textSecondary" variant="subtitle2">
          Removes
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

interface IPairTransactionsProps {
  pairDetails: any;
}

const PairTransactions: FC<IPairTransactionsProps> = () => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [toggleValue, setToggleValue] = useState('all');

  useEffect(() => {
    setLoading(true);
    // Fetch API
    setTransactions(mockTransactions);
    setFilter(mockTransactions);
    // Finish Fetching
    setLoading(false);
  }, []);

  useEffect(() => {
    if (toggleValue === 'all') setFilter(mockTransactions);
    else setFilter(transactions.filter((item) => item.action.toLowerCase().startsWith(toggleValue)));
  }, [toggleValue]);

  return (
    <Grid item xs={12}>
      <Typography variant="h5" color="textPrimary">
        Transactions
      </Typography>
      <Card className={classes.mainCard}>
        <Toolbar value={toggleValue} setValue={setToggleValue} />
        <EulerTable
          table_id="pair_table_transaccions"
          className={classes.dataGrid}
          pageSize={pageSize}
          rows={filter}
          rowsPerPageOptions={[10, 20, 30]}
          columns={PairTransactionColumns}
          loading={loading}
          onPageSizeChange={(pageParams: GridPageChangeParams) => {
            setPageSize(pageParams.pageSize);
          }}
        />
      </Card>
    </Grid>
  );
};

export default PairTransactions;
