import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { AppSkeleton } from 'src/components/templates';
import { PageTitle } from 'src/ui/PageTitle';
import StakingContentWrapper from './components/Content';

const TransactionDetail: FC = () => {
  const { t } = useTranslation();

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Staking" />
      <Typography variant="h4" color="textPrimary">
        {t('Staking')}
      </Typography>
      <StakingContentWrapper />
    </AppSkeleton>
  );
};

export default TransactionDetail;
