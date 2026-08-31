import { FC } from 'react';
import { useParams } from 'react-router';
import { AppSkeleton } from 'src/components/templates';
import FarmsContent from './components/FarmsContent';

const TransactionDetail: FC = () => {
  const { farmId } = useParams();

  return (
    <AppSkeleton>
      <FarmsContent farmId={farmId} />
    </AppSkeleton>
  );
};

export default TransactionDetail;
