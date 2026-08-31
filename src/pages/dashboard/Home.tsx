import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import CollapseAlert from 'src/components/home/CollapseAlert';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import gtm from 'src/lib/gtm';
import Disclaimer from 'src/ui/Disclaimer';
import { EulerAlert } from 'src/ui/EulerAlert';
import { PageTitle } from 'src/ui/PageTitle';
import { getEnv } from 'src/utils/env';
import { ChartsCard } from './components/ChartsCard';
import { MainCardsRow } from './components/MainCardsRow';
import { TrendingCard } from './components/TrendingCard';

interface Props {
  forceRedirect?: boolean;
}

export const Home = ({ forceRedirect = true }: Props) => {
  const { t } = useTranslation();
  const { featureFlags } = useContext(ConfigurationContext);

  const environment = getEnv();

  useEffect(() => {
    gtm.push({ event: 'homepage_view', category: 'Homepage', action: 'Pageview' });
  }, []);

  const { network } = useParams();
  // https://eulertools.atlassian.net/browse/GROWTH-131
  if (forceRedirect) return <Navigate to={featureFlags.marketsDisabled ? `/${network}/token` : `/tokens`} />;

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Home" />
      <Grid container display="flex" spacing={2}>
        {environment === 'app.euler.tools' || environment.includes('localhost') ? null : (
          <Grid item xs={12}>
            <EulerAlert message={t('UNSTABLE_FEATURES')} type="error" customIcon />
          </Grid>
        )}
        <Grid item xs={12}>
          <MainCardsRow />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TrendingCard />
            </Grid>
            <Grid item xs={12} md={9}>
              <ChartsCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} marginY={4}>
        <CollapseAlert title="Legal Disclaimer" description={<Disclaimer />} />
      </Grid>
    </AppSkeleton>
  );
};

const HomeWrapper = () => (
  <CoinDataProvider>
    <Home />
  </CoinDataProvider>
);

export default HomeWrapper;
