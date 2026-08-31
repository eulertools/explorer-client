import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useCoinData from 'src/hooks/useCoinData';
import WalletIcon from 'src/icons/svg-icons/WalletIcon';
import { selectWallet } from 'src/selectors/wallets';
import { getWalletDetail } from 'src/slices/user/wallet';
import { useDispatch, useSelector } from 'src/store';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import DashboardCard, { TokenDashboardCard } from 'src/ui/DashboardCard';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

export const MainCardsRow = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { chain } = useContext(ConfigurationContext);
  const { network } = useParams();
  const { walletDetail } = useSelector(selectWallet);
  const { isAuthenticated } = useAuth();
  const { account, chainId } = useWeb3React();
  const { btcPriceData, bnbData, wethPriceData } = useCoinData();

  const networkData = useMemo(() => settingsSupportedNetworks.find((n) => n.value === network), [network]);

  useEffect(() => {
    /**
     * TODO: Check if user has primary_wallet linked to account
     * and display it as default using Wallets API.
     * Maybe prioritize connected web3 wallet otherwise or if
     * it's different from primary_wallet
     */
    if (account) {
      if (isAuthenticated) {
        /**
         * Wallets API does not work in ETH Network at the time.
         * But we do need to reload after web3 network change
         * in order to display correct values.
         */
        dispatch(getWalletDetail(account));
      }
    }
  }, [account, network, chainId, isAuthenticated]);

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item xs={12} sm={6} lg={3}>
        <TokenDashboardCard
          base={chain[network].tokens.btc.symbol}
          baseAddress={chain[network].tokens.btc.address}
          quote="USD"
          price={btcPriceData.price}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <TokenDashboardCard
          base={
            network === ESupportedNetworks.BNB
              ? chain[ESupportedNetworks.BNB].tokens.bnb.symbol
              : chain.eth.tokens.eth.symbol
          }
          baseAddress={
            network === ESupportedNetworks.BNB
              ? chain[ESupportedNetworks.BNB].tokens.bnb.address
              : chain.eth.tokens.eth.address
          }
          quote="USD"
          price={network === ESupportedNetworks.BNB ? bnbData.price : wethPriceData.price}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <DashboardCard
          userCard
          title="WALLET BALANCE"
          actionLogo={<WalletIcon fill={theme.palette.primary.contrastText} />}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography marginLeft={1} color={account ? 'textPrimary' : 'lightgrey'} fontSize="20px" fontWeight="bold">
              {walletDetail?.total && account
                ? `USD $${getBigNumberCurrencyLabel(walletDetail.total, false, 3)}`
                : '--'}
            </Typography>
          </Box>
        </DashboardCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <DashboardCard
          userCard
          title={`WALLET ${networkData?.shortLabel} BALANCE`}
          actionLogo={<WalletIcon fill={theme.palette.primary.contrastText} />}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography marginLeft={1} color={account ? 'textPrimary' : 'lightgrey'} fontSize="20px" fontWeight="bold">
              {walletDetail?.totalBNB && account
                ? `${getBigNumberCurrencyLabel(walletDetail.totalBNB, false, 3)} ${networkData?.shortLabel}`
                : '--'}
            </Typography>
          </Box>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};
