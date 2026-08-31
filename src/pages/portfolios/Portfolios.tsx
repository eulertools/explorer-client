import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { AppSkeleton } from 'src/components/templates';
import { PageTitle } from 'src/ui/PageTitle';
import { PrivateSection } from 'src/ui/PrivateSection';
import PortfolioContent from './components/PortfolioContent';

const Portfolios: FC = () => {
  const { t } = useTranslation();

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Portfolios" />
      <Typography variant="h4" color="textPrimary" mb={3}>
        {t('Portfolios')}
      </Typography>
      <PrivateSection>
        <PortfolioContent />
      </PrivateSection>
    </AppSkeleton>
  );
};

export default Portfolios;
