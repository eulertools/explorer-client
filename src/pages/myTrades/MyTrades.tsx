import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import useSettings from 'src/hooks/useSettings';
import { PortfolioCreateIcon } from 'src/icons/PortfolioCreate';
import {
  MarketplaceContext,
  MarketplaceContextProvider,
  initialModal,
  initialPurchaseObject,
  initialSaleSettings,
} from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { ModalV2 } from 'src/pages/marketplace/components/Modal/ModalV2';
import slice from 'src/slices/tables/marketplace';
import { useDispatch } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { PageTitle } from 'src/ui/PageTitle';
import { MySales } from '../marketplace/components/Sale/MySales';

const MyTrades: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { identifier } = useParams();

  const { tab, updateModal, modal, updatePurchase, updateSaleSettings } = useContext(MarketplaceContext);

  const handleModalClose = () => {
    updateModal(initialModal);
    updatePurchase(initialPurchaseObject);
    updateSaleSettings(initialSaleSettings);
    dispatch(slice.actions.setSale(initialPurchaseObject));
    if (identifier) navigate(`/${settings.network}/marketplace/`);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          <PageTitle title={t('My trades')} />
        </Box>
      </Box>
      <Grid item xs={12}>
        <BasicTabPanel value={tab} index={0}>
          <MySales />
        </BasicTabPanel>
      </Grid>
      {modal?.showModal ? <ModalV2 open onCancel={handleModalClose} /> : null}
    </>
  );
};

const MyTradesWrapper = () => {
  const { settings } = useSettings();

  const userOnDifferentNetwork = useMemo(() => settings?.network !== ESupportedNetworks.BNB, [settings]);

  const Facade = () => (
    <Box display="grid" justifyContent="center" alignItems="center" minHeight="600px" height="100%">
      <Box display="flex" alignItems="center" flexDirection="row">
        <PortfolioCreateIcon />
        <Box display="grid" justifyContent="center">
          <Typography color="textPrimary" fontWeight={600} fontSize="1.5rem">
            We currently do not support <br /> this network in our marketplace <br /> please switch to{' '}
            <span>BNB Network</span>.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <AppSkeleton>
      <MarketplaceContextProvider>
        <CoinDataProvider>{userOnDifferentNetwork ? <Facade /> : <MyTrades />}</CoinDataProvider>
      </MarketplaceContextProvider>
    </AppSkeleton>
  );
};

export default MyTradesWrapper;
