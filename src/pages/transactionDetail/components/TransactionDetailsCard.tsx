import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import TransactionLogs from 'src/pages/transactionDetail/components/TransactionLogs';
import TransactionOverview from 'src/pages/transactionDetail/components/TransactionOverview';
import { selectTxnsDataByAddress } from 'src/selectors/txns';
import { getTxns } from 'src/slices/tables/txns';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerTabs } from 'src/ui/EulerTabs';

interface ITransactionDetailsCardProps {
  hash: string;
}

export const TransactionDetailsCard = ({ hash }: ITransactionDetailsCardProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { detail, loading, error } = useSelector(selectTxnsDataByAddress(hash)) || {};
  const [value, setValue] = useState(0);

  useEffect(() => {
    dispatch(getTxns(hash));
  }, [hash]);

  if (error) return <EulerError error={error} />;

  if (loading || !detail) return <EulerLoading />;

  return (
    <Box>
      <Box
        sx={{
          marginY: theme.spacing(2),
          display: 'grid',
          gridTemplateColumns: '1fr 4fr',
          background: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: '100%',
        }}
      >
        <EulerTabs titles={['Overview', 'Logs']} selected={value} setSelected={setValue} />
      </Box>
      <BasicTabPanel value={value} index={0}>
        <TransactionOverview transaction={detail} />
      </BasicTabPanel>
      <BasicTabPanel value={value} index={1}>
        <TransactionLogs logs={detail.logs} />
      </BasicTabPanel>
    </Box>
  );
};
