import { useWeb3React } from '@web3-react/core';
import { FC, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import useModal from 'src/components/modal/useModal';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { PortfolioCreateIcon } from 'src/icons/PortfolioCreate';
import gtm from 'src/lib/gtm';
import {
  MarketplaceContext,
  MarketplaceContextProvider,
  initialModal,
  initialPurchaseObject,
  initialSaleSettings,
} from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { Modal } from 'src/pages/marketplace/components/Modal/Modal';
import { ModalV2 } from 'src/pages/marketplace/components/Modal/ModalV2';
import { TradeFilterForm } from 'src/pages/marketplace/components/Trade/TradeFilterForm';
import TradeTable from 'src/pages/marketplace/components/Trade/TradeTable';
import { selectFilterState } from 'src/selectors/filters';
import { selectMarketplace } from 'src/selectors/marketplace';
import { UITableID } from 'src/slices/filter.types';
import slice, { getSale } from 'src/slices/tables/marketplace';
import { useDispatch, useSelector } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { EMarketContractSteps } from 'src/types/marketplace';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { CardRoot } from 'src/ui/CardRoot';
import { EulerTabs } from 'src/ui/EulerTabs';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterButtonIcon } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';
import { MySales } from './components/Sale/MySales';
import NFTsList from './components/nfts/NFTsList';

const useStyles = makeStyles((theme) => ({
  tabHeader: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'grid',
    paddingLeft: theme.spacing(2),
    width: '100%',
    gridTemplateColumns: '1fr 3fr',
    columnGap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down(900)]: {
      gridTemplateColumns: '1fr',
      marginBottom: theme.spacing(2),
    },
  },
  filters: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    '& > div > div': {
      minHeight: '92%',
      '& > div': {
        minHeight: '92%',
      },
    },
  },
  newSaleButton: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(1),
    width: '180px',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down(500)]: {
      width: '100%',
    },
  },
  spanWallet: {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  alertGrid: {
    paddingBottom: theme.spacing(2),
    marginTop: '-6px',
    [theme.breakpoints.down(900)]: {
      marginTop: 0,
    },
  },
}));

const Marketplace: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { identifier } = useParams();
  const { account } = useWeb3React();
  const { showModal } = useModal();
  const { isAuthenticated } = useAuth();

  const tradeTableId = UITableID.marketplace_trade_list;
  const mySalesTableId = UITableID.marketplace_my_sale_list;
  const tradeFilters = useSelector(selectFilterState(tradeTableId));
  const { sale, saleLoading } = useSelector(selectMarketplace);
  const { tab, updateTab, updateModal, modal, updatePurchase, updateSaleSettings } = useContext(MarketplaceContext);
  const { featureFlags } = useContext(ConfigurationContext);

  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  const handleNewSale = () => {
    if (!isAuthenticated) {
      const authModal = showModal(AuthDialog, {
        onClose: () => {
          authModal.hide();
        },
      });
      return;
    }
    gtm.push({
      event: 'clicked_marketplace_create_ad',
      category: 'Marketplace',
      action: 'Clicked MarketPlace Create Ad',
    });
    updateModal((prev) => ({
      ...prev,
      showModal: true,
      activeModal: 'sale',
      loading: false,
      step: EMarketContractSteps.CREATING_SALE,
    }));
  };

  const handleModalClose = () => {
    updateModal(initialModal);
    updatePurchase(initialPurchaseObject);
    updateSaleSettings(initialSaleSettings);
    dispatch(slice.actions.setSale(initialPurchaseObject));
    if (identifier) navigate(`/${settings.network}/marketplace/`);
  };

  useEffect(() => {
    if (identifier) dispatch(getSale(identifier));
  }, [identifier]);

  /**
   * Perform checks for New Sale Data when changing routes to
   * /marketplace/{identifier} and ignore old or base data.
   */

  useEffect(() => {
    if (sale !== initialPurchaseObject && !saleLoading && identifier) {
      updatePurchase((prev) => ({ ...prev, ...sale }));

      updateModal((prev) => ({
        ...prev,
        showModal: true,
        activeModal: 'purchase',
        loading: false,
        kind: +sale?.kind,
        step: EMarketContractSteps.CREATING_PURCHASE,
      }));
    }
  }, [sale, saleLoading, identifier]);

  const { nftDisabled } = featureFlags;

  let tabs;
  if (nftDisabled) {
    tabs = account ? ['Token Trades', 'My Trades'] : ['Token Trades'];
  } else {
    tabs = ["NFT'S", 'Token Trades'];
  }

  const showTokenTrades = (nftDisabled && tab === 0) || (!nftDisabled && tab === 1);

  const onClickPostNft = () => {
    navigate('/nft/post');
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" pl={2}>
          <PageTitle title="Marketplace" />
        </Box>
      </Box>
      <Grid container display="flex" spacing={2} justifyContent="space-between" marginTop={4} marginLeft={0}>
        {!isMobile ? (
          <Box className={classes.tabHeader} display="flex" justifyContent="space-between">
            <EulerTabs titles={tabs} selected={tab} setSelected={updateTab} inMarketplace />
          </Box>
        ) : (
          <>
            <Box className={classes.tabHeader}>
              <EulerTabs titles={tabs} selected={tab} setSelected={updateTab} inMarketplace />
            </Box>
            {showTokenTrades ? (
              <>
                <Box width="100%" ml={2} className={classes.filters}>
                  <FilterQuery placeholder="Search by Name or Symbol" tableId={tradeTableId} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" ml={2} mt={2}>
                  {/* <Button className={classes.newSaleButton} onClick={handleNewSale} variant="contained">
                    <Typography mx={0.5} my={0.5} fontWeight={600}>
                      {t('Post Ad')}
                    </Typography>
                  </Button> */}
                  <FilterButtonIcon tableId={tradeTableId} />
                </Box>
              </>
            ) : null}
            {nftDisabled && tab === 1 ? (
              <>
                <Box width="100%" ml={2} className={classes.filters}>
                  <FilterQuery placeholder="Search by Name or Symbol" tableId={mySalesTableId} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" ml={2} mt={2}>
                  <Button className={classes.newSaleButton} onClick={handleNewSale} variant="contained">
                    <Typography mx={0.5} my={0.5} fontWeight={600}>
                      {t('Post Ad')}
                    </Typography>
                  </Button>
                  <FilterButtonIcon tableId={mySalesTableId} />
                </Box>
              </>
            ) : null}
          </>
        )}
        <Grid item xs={12}>
          {!isMobile ? (
            <>
              {nftDisabled
                ? null
                : tab === 0 && (
                    <Box
                      className={classes.filters}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={3}
                    >
                      <Box width="50%">
                        <FilterQuery placeholder="Search by Name or Symbol" tableId={tradeTableId} />
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Button onClick={onClickPostNft} className={classes.newSaleButton} variant="contained">
                          <Typography mx={0.5} my={0.5} fontWeight={600}>
                            {t('Post NFT')}
                          </Typography>
                        </Button>
                        <FilterButtonIcon tableId={tradeTableId} />
                      </Box>
                    </Box>
                  )}
              {showTokenTrades ? (
                <Box
                  className={classes.filters}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Box width="50%">
                    <FilterQuery placeholder="Search by Name or Symbol" tableId={tradeTableId} />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* <Button className={classes.newSaleButton} onClick={handleNewSale} variant="contained">
                      <Typography mx={0.5} my={0.5} fontWeight={600}>
                        {t('Post Ad')}
                      </Typography>
                    </Button> */}
                    <FilterButtonIcon tableId={tradeTableId} />
                  </Box>
                </Box>
              ) : null}
              {nftDisabled && tab === 1 ? (
                <Box
                  className={classes.filters}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <Box width="50%">
                    <FilterQuery placeholder="Search by Name or Symbol" tableId={mySalesTableId} />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button className={classes.newSaleButton} onClick={handleNewSale} variant="contained">
                      <Typography mx={0.5} my={0.5} fontWeight={600}>
                        {t('Post Ad')}
                      </Typography>
                    </Button>
                    <FilterButtonIcon tableId={mySalesTableId} />
                  </Box>
                </Box>
              ) : null}
            </>
          ) : null}
          <BasicTabPanel value={tab} index={nftDisabled ? -1 : 0}>
            <NFTsList />
          </BasicTabPanel>
          <BasicTabPanel value={tab} index={nftDisabled ? 0 : 1}>
            <FilterContainer
              tableId={tradeTableId}
              FilterForm={TradeFilterForm}
              backgroundImage
              topLeftBorder
              topRightBorder
            >
              <CardRoot
                noTopLeftBorder={tradeFilters.openFilter}
                noTopRightBorder={tradeFilters.openFilter}
                minWidth={!isMobile ? 1000 : null}
              >
                <TradeTable tableId={tradeTableId} />
              </CardRoot>
            </FilterContainer>
          </BasicTabPanel>
          <BasicTabPanel value={tab} index={nftDisabled ? 1 : -1}>
            <MySales />
          </BasicTabPanel>
        </Grid>
      </Grid>
      {modal?.showModal ? (
        <>
          {featureFlags.marketplaceV2Enabled ? (
            <ModalV2 open onCancel={handleModalClose} />
          ) : (
            <Modal open onCancel={handleModalClose} />
          )}
        </>
      ) : null}
    </>
  );
};

const MarketplaceWrapper = () => {
  const classes = useStyles();
  const { settings } = useSettings();

  const userOnDifferentNetwork = useMemo(() => settings?.network !== ESupportedNetworks.BNB, [settings]);

  const Facade = () => (
    <Box display="grid" justifyContent="center" alignItems="center" minHeight="600px" height="100%">
      <Box display="flex" alignItems="center" flexDirection="row">
        <PortfolioCreateIcon />
        <Box display="grid" justifyContent="center">
          <Typography color="textPrimary" fontWeight={600} fontSize="1.5rem">
            We currently do not support <br /> this network in our marketplace <br /> please switch to{' '}
            <span className={classes.spanWallet}>BNB Network</span>.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <AppSkeleton>
      <MarketplaceContextProvider>
        <CoinDataProvider>{userOnDifferentNetwork ? <Facade /> : <Marketplace />}</CoinDataProvider>
      </MarketplaceContextProvider>
    </AppSkeleton>
  );
};

export default MarketplaceWrapper;
