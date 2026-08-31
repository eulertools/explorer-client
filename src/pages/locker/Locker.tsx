import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { useState, useMemo, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import Alert from '@material-ui/core/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { WalletRequiredGuard } from 'src/components/WalletRequiredGuard';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import useSettings from 'src/hooks/useSettings';
import { PortfolioCreateIcon } from 'src/icons/PortfolioCreate';
import LockerTable from 'src/pages/locker/components/LockerTable';
import { WalletDonutChart, ChartToken } from 'src/pages/wallet/components/WalletDonutChart';
import { WalletOverview } from 'src/pages/wallet/components/WalletOverview';
import { selectWallet } from 'src/selectors/wallets';
import { ESupportedNetworks } from 'src/types/blockchain';
import { LockToken } from 'src/types/locker';
import { ButtonLock } from 'src/ui/ButtonLock';
import { CardRoot } from 'src/ui/CardRoot';
import { EulerAlert } from 'src/ui/EulerAlert';
import { EulerLoading } from 'src/ui/EulerLoading';
import { getData, getBalance } from 'src/utils/locker';
import { BNBToken } from 'src/utils/marketplace';

const useStyles = makeStyles((theme) => ({
  spanWallet: {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
}));

const Locker = () => {
  const theme = useTheme();
  const { bnbData } = useCoinData();
  const { account, library } = useWeb3React();
  const web3 = new Web3(library?.provider);
  const { chain } = useContext(ConfigurationContext);

  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  const { walletDetail, walletDetailLoading, error, myWallets } = useSelector(selectWallet);

  const [tokens, setTokens] = useState<LockToken[]>(null);
  const [BNBLockToken, setBNBLockToken] = useState<LockToken>(null);
  const [balanceUSD, setBalanceUSD] = useState<number>(null);
  const [balanceBNB, setBalanceBNB] = useState<number>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const donutChartTokens: ChartToken[] = useMemo(() => {
    if (tokens) {
      return tokens.filter((i) => i.balance).map((j) => ({ name: j.name, amount: +j.balance }));
    }
    return [];
  }, [tokens]);

  const selectedWallet = useMemo(() => myWallets.find((w) => w.address === account), [account, myWallets]);

  useEffect(() => {
    const init = async () => {
      const tokenList = await Promise.all(
        walletDetail.tokens.map(async (tkn) => {
          const { address, name, symbol, price_usd, identifier } = tkn?.token?._source;
          const { amount, deadline } = await getData(tkn.name.toLowerCase(), chain.bsc.products.locker, account, web3);

          const balance = await getBalance(tkn.name.toLowerCase(), account, web3);
          const totalUsd = new BigNumber(balance).multipliedBy(price_usd).toNumber();

          const newToken = {
            address,
            balance: +balance,
            deadline: +deadline,
            identifier,
            locked: +Web3.utils.fromWei(amount),
            name,
            price_usd: +price_usd,
            symbol,
            total_usd: totalUsd,
          };
          return newToken;
        }),
      );

      const bnbBalance = await getBalance(BNBToken, account, web3);
      const bnbTotalUsd = new BigNumber(bnbBalance).multipliedBy(bnbData.price).toNumber();
      const { amount, deadline } = await getData(BNBToken, chain.bsc.products.locker, account, web3);

      if (bnbData?.price) {
        const newBNBLockToken = {
          address: BNBToken,
          balance: +bnbBalance,
          deadline: +deadline,
          identifier: `bsc~token~${BNBToken}`,
          locked: +Web3.utils.fromWei(amount),
          name: 'BNB',
          price_usd: +bnbData?.price,
          symbol: 'BNB',
          total_usd: bnbTotalUsd,
        };

        setBNBLockToken((prev) => ({ ...prev, ...newBNBLockToken }));

        setTokens([newBNBLockToken, ...tokenList]);
      }
    };

    const refreshInterval = setInterval(() => init(), 10000);

    init();

    return () => clearInterval(refreshInterval);
  }, [walletDetail, account, bnbData?.price]);

  useEffect(() => {
    const balance = async () => {
      const bnbBalance = await getBalance(BNBToken, account, web3);
      const tokensUsdValue = tokens
        .map((i) => i.total_usd)
        .reduce((acc, current) => {
          const sum = new BigNumber(acc).plus(current).toNumber();
          return sum;
        });

      setBalanceBNB((prev) => {
        if (prev !== +bnbBalance) {
          return +bnbBalance;
        }
        return prev;
      });
      setBalanceUSD((prev) => {
        if (prev !== tokensUsdValue) {
          return tokensUsdValue;
        }
        return prev;
      });
    };

    if (tokens) {
      setLoading(true);
      balance();
      setLoading(false);
    }
  }, [tokens]);

  if (loading || !tokens || walletDetailLoading) return <EulerLoading />;

  if (error) return <EulerAlert type="info" message={error} customIcon />;

  return (
    <Grid container display="flex" pt={2}>
      <Grid item xs={12}>
        <Alert severity="error" variant="filled">
          This feature is in beta please use it at your own risk.
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <WalletOverview
          balance={balanceUSD}
          bnbValue={balanceBNB}
          wallet={selectedWallet}
          editWalletIcon={false}
          lockButton={BNBLockToken ? <ButtonLock token={BNBLockToken} iconButton /> : null}
        />
      </Grid>
      {donutChartTokens ? (
        <Grid item xs={12}>
          <WalletDonutChart tokenList={donutChartTokens} />
        </Grid>
      ) : null}
      <Grid item xs={12} pt={donutChartTokens.length > 0 ? 2 : 0} pb={2}>
        <CardRoot minWidth={isMobile ? 1200 : null}>
          <LockerTable tokens={tokens} />
        </CardRoot>
      </Grid>
    </Grid>
  );
};

const LockerWrapper = () => {
  const classes = useStyles();
  const { settings } = useSettings();

  const userOnDifferentNetwork = useMemo(() => settings?.network !== ESupportedNetworks.BNB, [settings]);

  const Facade = () => (
    <Box display="grid" justifyContent="center" alignItems="center" minHeight="600px" height="100%">
      <Box display="flex" alignItems="center" flexDirection="row">
        <PortfolioCreateIcon />
        <Box display="grid" justifyContent="center">
          <Typography color="textPrimary" fontWeight={600} fontSize="1.5rem">
            We currently do not support <br /> this network in our locker <br /> please switch to{' '}
            <span className={classes.spanWallet}>BNB Network</span>.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <WalletRequiredGuard>
      <CoinDataProvider>{userOnDifferentNetwork ? <Facade /> : <Locker />}</CoinDataProvider>
    </WalletRequiredGuard>
  );
};

export default LockerWrapper;
