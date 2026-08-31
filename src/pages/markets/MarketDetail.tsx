import _isEmpty from 'lodash/isEmpty';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import { AppSkeleton } from 'src/components/templates';
import useSettings from 'src/hooks/useSettings';
import { MarketCardHeader } from 'src/pages/markets/components/Market/MarketCardHeader';
import { MarketChart } from 'src/pages/markets/components/MarketChart';
import { MarketTabs } from 'src/pages/markets/components/MarketTabs';
import Project from 'src/pages/markets/components/Project/Project';
import Security from 'src/pages/markets/components/Security/Security';
import SwapperWrapper from 'src/pages/swapper';
import { getExchanges } from 'src/slices/tables/exchanges';
import slice, { getMarket, getMarketAddress } from 'src/slices/tables/markets';
import { useDispatch, useSelector } from 'src/store';
import { IMarketSource } from 'src/types/market';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerAlert } from 'src/ui/EulerAlert';
import { PageTitle } from 'src/ui/PageTitle';
import { isAddress } from 'src/utils/stringUtils';

interface IMarketDetailProps {
  market: IMarketSource;
}

const MarketDetail: FC<IMarketDetailProps> = ({ market }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  // Temporarily disable Swapper from Token Section
  const showSwapper = false;
  const projectData = useMemo(() => !_isEmpty(market.links), [market.links]);
  const securityData = useMemo(() => !_isEmpty(market.networks?.bnb?.address), [market.networks?.bnb?.address]);

  useEffect(() => {
    if (showSwapper) {
      navigate({
        pathname: location.pathname,
        search: `?${new URLSearchParams({
          from: market.networks?.bnb?.address || '',
        }).toString()}`,
      });
    }
  }, [market.networks?.bnb?.address, location.pathname]);

  return (
    <AppSkeleton>
      <PageTitle pageTitle={`${market.name} (${market.symbol})`} />
      <Grid container display="flex" spacing={2}>
        <Grid item xs={12} display="flex" alignItems="center">
          <MarketCardHeader market={market} />
        </Grid>
        <MarketTabs titles={['Token', 'Project', 'Security']} selected={selectedTab} setSelected={setSelectedTab} />
        <Grid item xs={12}>
          <BasicTabPanel value={selectedTab} index={0}>
            <Grid container mt={1} spacing={3}>
              <Grid item xs={12} md={showSwapper ? 8 : 12} sx={{ paddingTop: '0px !important' }}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: (theme) => `${theme.spacing(2)} ${theme.spacing(3)}`,
                    boxShadow: 'none',
                    '& > div': {
                      width: '100%',
                    },
                  }}
                >
                  <MarketChart identifier={market.identifier} symbol={market.symbol} />
                </Card>
              </Grid>
              {showSwapper ? (
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    paddingTop: '0px !important',
                    '& > div > div > div': {
                      margin: '0px !important',
                      maxWidth: '100% !important',
                    },
                  }}
                >
                  {location?.search ? <SwapperWrapper showPageTitle={false} /> : null}
                </Grid>
              ) : null}
            </Grid>
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={1}>
            {projectData ? (
              <Project market={market} />
            ) : (
              <Box pt={2}>
                <EulerAlert type="info" message={t('TOKEN.PROJECT_NOT_FOUND')} customIcon />
              </Box>
            )}
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={2}>
            {securityData ? <Security tokenAddress={market.networks?.bnb?.address} /> : null}
          </BasicTabPanel>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

const MarketDetailWrapper = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { market = null, loading } = useSelector((state) => state.markets);
  const { address } = useParams();

  useEffect(() => {
    if (isAddress(address)) {
      dispatch(getMarketAddress(address, settings.network));
    } else {
      dispatch(getMarket(address));
    }

    return () => {
      dispatch(slice.actions.setMarket({ market: null }));
    };
  }, [address, settings.network]);

  useEffect(() => {
    if (market) {
      dispatch(getExchanges(market.address, null, { size: 20, page: 0 }));
    }
  }, [market]);

  if (loading) {
    return <ScreenSpinner />;
  }

  return !market ? (
    <Box py={4} px={2}>
      <EulerAlert type="info" message={t('TOKEN.TOKEN_NOT_FOUND')} customIcon />
    </Box>
  ) : (
    <MarketDetail market={market} />
  );
};

export default MarketDetailWrapper;
