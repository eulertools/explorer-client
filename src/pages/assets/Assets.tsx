import { useWeb3React } from '@web3-react/core';
import _isEqual from 'lodash/isEqual';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useWalletConnected from 'src/hooks/useWalletConnected';
import {
  AssetsContext,
  AssetsContextProvider,
  assetsFlags,
  initialSelectedAddress,
} from 'src/pages/assets/AssetsContext';
import AssetsLanding from 'src/pages/assets/AssetsLanding';
import NFTAssets from 'src/pages/assets/components/NFTAssets';
import TokensWorth from 'src/pages/assets/components/TokensWorth';
import { TrackedAddressesTable } from 'src/pages/assets/components/TrackedAddressesTable';
import { TrackedTokensTable } from 'src/pages/assets/components/TrackedTokensTable';
import { selectMyWallets } from 'src/selectors/wallets';
import { getAddressDataV2 } from 'src/slices/entities/address';
import { getFavorites } from 'src/slices/user/favorites';
import { getMyWallets } from 'src/slices/user/wallet';
import { useDispatch, useSelector } from 'src/store';
import { EulerSwapButton } from 'src/ui/EulerSwapButton';
import { EulerTransakButton } from 'src/ui/EulerTransakButton';
import { PageTitle } from 'src/ui/PageTitle';

const Assets: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { account } = useWeb3React();
  const { isAuthenticated } = useAuth();
  const walletAddresses = useSelector(selectMyWallets);
  const { isDemo, updateDemo, addresses, updateAddresses, updateSelectedAddress } = useContext(AssetsContext);
  const { chain } = useContext(ConfigurationContext);

  const [oldWallets, setOldWallets] = useState(addresses);
  const smallScreen = useMediaQuery(theme.breakpoints.down(675));

  const toggleDemo = useCallback(() => {
    updateDemo(false);
    updateAddresses([]);
    updateSelectedAddress(initialSelectedAddress);
  }, [updateDemo, updateAddresses, updateSelectedAddress]);

  useEffect(() => {
    const getAddressObject = async () => {
      const list = await Promise.all(
        [...oldWallets].map(async (w) => {
          const addressData = await getAddressDataV2(w.address.toLocaleLowerCase(), chain);
          const sortedTokens = addressData?.tokens?.sort((a, b) => +b.value - +a.value);
          return {
            address: w.address,
            name: w.name,
            identifier: w.identifier,
            type: w.type,
            network: w.network,
            total: addressData ? addressData.total : 0,
            balance: addressData ? addressData.balance : 0,
            tokens: sortedTokens?.length > 0 ? [...sortedTokens] : [],
          };
        }),
      );
      const sorted = list.sort((a, b) => b.total - a.total);
      if (sorted.length > 0) {
        if (sorted[0].address) {
          updateSelectedAddress(sorted[0]);
          updateAddresses(sorted);
        }
      }
    };
    if (oldWallets.length > 0 && oldWallets[0].address) {
      getAddressObject();
    }
  }, [oldWallets]);

  /**
   * Equality check to correctly update table after
   * any add-remove-rename operation.
   */
  useEffect(() => {
    if (!isAuthenticated && addresses[0]?.address && !_isEqual(oldWallets, addresses)) {
      setOldWallets(addresses);
    }
    if (isAuthenticated && !_isEqual(walletAddresses, oldWallets)) {
      setOldWallets(walletAddresses);
    }
  }, [walletAddresses, account, isDemo, addresses]);

  useEffect(
    () => () => {
      updateAddresses([]);
      updateSelectedAddress(initialSelectedAddress);
    },
    [],
  );

  return (
    <>
      <Grid container display="flex" justifyContent="space-between">
        <Grid item display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              '& > h4': {
                fontSize: '24px',
                fontWeight: 600,
                lineHeight: '28px',
                color: (theme as any).palette.neutral[700],
              },
            }}
          >
            <PageTitle title={t('Assets')} />
          </Box>
          {!smallScreen ? (
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '20px',
                color: (theme as any).palette.neutral[600],
                marginBottom: theme.spacing(3),
              }}
            >
              {t('Check your assets, view your favorites and more')}
            </Typography>
          ) : null}
        </Grid>
        {smallScreen ? (
          <Grid item xs={12}>
            <Typography
              mb={2}
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '20px',
                color: (theme as any).palette.neutral[600],
              }}
            >
              {t('Check your assets, view your favorites and more')}
            </Typography>
          </Grid>
        ) : null}
        <Grid item>
          {isDemo ? (
            <Button variant="text" size="large" sx={{ fontSize: 16 }} onClick={toggleDemo}>
              <strong>{t('Quit Demo')}</strong>
            </Button>
          ) : null}
          <EulerSwapButton />
          <EulerTransakButton />
        </Grid>
      </Grid>
      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} md={8} display="flex" flexDirection="column" gap={2}>
          <CoinDataProvider>
            <TokensWorth />
          </CoinDataProvider>
          {assetsFlags.showNFTAssets ? <NFTAssets /> : null}
        </Grid>
        <Grid item xs={12} md={4} display="flex" flexDirection="column" gap={2}>
          {!smallScreen ? <TrackedAddressesTable /> : null}
          {assetsFlags.showTrackedTokens ? <TrackedTokensTable /> : null}
        </Grid>
      </Grid>
    </>
  );
};

const AssetsWrapper = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { isAuthenticated } = useAuth();
  const isConnected = useWalletConnected();
  const { addresses, selectedAddress, isDemo, updateDemo } = useContext(AssetsContext);

  const landingCondition = useMemo(() => {
    if (isDemo) return false;
    // Applied for Imported Address from Landing.
    if (!isAuthenticated && !account && selectedAddress?.identifier === 'tempAddress') return false;
    if (isAuthenticated && !account && addresses.length === 0 && selectedAddress?.identifier === 'tempAddress')
      return false;
    if (isAuthenticated && addresses.length > 0) return false;
    if (isConnected === 1) return false;
    return true;
  }, [isDemo, addresses, selectedAddress?.identifier, isConnected, isAuthenticated, account]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyWallets());
      dispatch(getFavorites());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDemo && isConnected === 1) {
      updateDemo(false);
    }
    if (isDemo && isAuthenticated) {
      updateDemo(false);
    }
  }, [isConnected, isAuthenticated]);

  return <AppSkeleton>{landingCondition ? <AssetsLanding /> : <Assets />}</AppSkeleton>;
};

export default () => (
  <AssetsContextProvider>
    <AssetsWrapper />
  </AssetsContextProvider>
);
