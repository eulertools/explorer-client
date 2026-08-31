import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Typography } from '@material-ui/core';
import { AppSkeleton } from 'src/components/templates';
import gtm from 'src/lib/gtm';
import { TransactionDetailsCard } from './components/TransactionDetailsCard';

const TransactionDetail: FC = () => {
  useEffect(() => {
    gtm.push({ event: 'user_view_transaction_detail', category: 'Transactions', action: 'View Transaction Detail' });
  }, []);

  const { hashId } = useParams();
  const { t } = useTranslation();
  const [transactionId, setTransactionId] = useState<string>(hashId);

  useEffect(() => {
    if (hashId !== transactionId) {
      setTransactionId(hashId);
    }
  }, [hashId]);

  return (
    <>
      <AppSkeleton>
        <Typography title={t('Transaction Details')} fontSize={14} fontWeight={600} color="terciary.600" mb={4}>
          Transaction detail
        </Typography>
        <TransactionDetailsCard hash={transactionId} />
      </AppSkeleton>
    </>
  );
};

export default TransactionDetail;
