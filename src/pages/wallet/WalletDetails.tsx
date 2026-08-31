import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useResponsiveValues } from 'src/hooks/useResponsiveValues';
import Locker from 'src/pages/locker/Locker';
import { WalletDonutChart } from 'src/pages/wallet/components/WalletDonutChart';
import { WalletListSelector } from 'src/pages/wallet/components/WalletListSelector';
import { WalletOverview } from 'src/pages/wallet/components/WalletOverview';
import { WalletTable } from 'src/pages/wallet/components/WalletTable';
import { WalletsFormModal } from 'src/pages/wallet/components/WalletsFormModal';
import { selectAccount } from 'src/selectors/account';
import { selectWallet } from 'src/selectors/wallets';
import { getWalletDetail, WalletItem } from 'src/slices/user/wallet';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerTabs } from 'src/ui/EulerTabs';
import { PageTitle } from 'src/ui/PageTitle';
import { logger } from 'src/utils/logger';

interface WalletDetailsProps {
  address: string;
}
export default function WalletDetails({ address }: WalletDetailsProps): JSX.Element {
  const { t } = useTranslation();
  const media = useResponsiveValues();
  const dispatch = useDispatch();
  const { account } = useWeb3React();

  const { myWallets, walletDetailLoading, error, walletDetail } = useSelector(selectWallet);
  const { subscription, loading: subsLoading } = useSelector(selectAccount);
  const totalWalletsAllowed = subscription?.permissions?.wallets ?? 1;

  const allowedWallets = useMemo(() => myWallets?.slice(0, totalWalletsAllowed), [myWallets, totalWalletsAllowed]);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentWallet, setCurrentWallet] = useState<WalletItem>(allowedWallets?.find((i) => i.address === address));

  const eulerTabs = useMemo(() => {
    if (account === currentWallet?.address) {
      return ['Wallet', 'Locker Manager'];
    }
    return ['Wallet'];
  }, [account, currentWallet]);

  useEffect(() => {
    if (allowedWallets) {
      setCurrentWallet(allowedWallets?.find((i) => i.address === address));
    }
  }, [allowedWallets, subsLoading]);

  useEffect(() => {
    if (currentWallet) {
      logger('Wallet load details');
      dispatch(getWalletDetail(currentWallet.address || address));
      setSelectedTab(0);
    }
  }, [account, currentWallet]);

  const onWalletChange = useCallback(
    (newWallet: string) => {
      setCurrentWallet(allowedWallets.find((i) => i.address === newWallet));
      setSelectedTab(0);
    },
    [allowedWallets],
  );

  const pureWallet = useMemo(
    () =>
      currentWallet?.address ? (
        <Box>
          <WalletOverview balance={walletDetail.total} bnbValue={walletDetail.totalBNB} wallet={currentWallet} />
          <Box display="grid">
            <WalletDonutChart />
          </Box>
          <Box display="grid" pb={2}>
            <WalletTable address={currentWallet.address} />
          </Box>
        </Box>
      ) : null,
    [currentWallet, walletDetail, media.isLG],
  );

  /**
   * current wallet is required to display the information
   * if we don't have current wallet something is wrong or the page
   * is still loading
   */
  const loading = !currentWallet || walletDetailLoading;

  return (
    <>
      {error && <EulerError error={error} minHeight="60px" />}
      <PageTitle
        pageTitle={`${t('Wallet')} | ${currentWallet?.address}`}
        title={`${t('Wallets')} : ${loading ? '...' : currentWallet?.name}`}
      />
      {loading ? (
        <EulerLoading />
      ) : (
        <Box>
          <Box
            pb={2}
            display="grid"
            justifyContent="space-between"
            gridTemplateColumns="auto 200px"
            alignItems="center"
          >
            <WalletListSelector
              allowedWallets={allowedWallets}
              value={currentWallet?.address}
              onChange={onWalletChange}
            />
            {myWallets.length < totalWalletsAllowed ? <WalletsFormModal /> : null}
          </Box>
          <EulerTabs titles={eulerTabs} selected={selectedTab} setSelected={setSelectedTab} />
          <BasicTabPanel value={selectedTab} index={0}>
            {pureWallet}
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={1}>
            <Locker />
          </BasicTabPanel>
        </Box>
      )}
    </>
  );
}
