import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import _isEqual from 'lodash/isEqual';
import Web3 from 'web3';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import { AssetsContext, assetsFlags } from 'src/pages/assets/AssetsContext';
import { TokensWorthChart } from 'src/pages/assets/components/TokensWorthChart';
import { TokensWorthTable } from 'src/pages/assets/components/TokensWorthTable';
import { TokensWorthTimePeriod } from 'src/pages/assets/components/TokensWorthTimePeriod';
import WalletSelector from 'src/pages/assets/components/WalletSelector';
import { LockToken } from 'src/types/locker';
import { ButtonLock } from 'src/ui/ButtonLock';
import { EulerAddress } from 'src/ui/EulerAddress';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { getBalance, getData, checkLockerEnabled } from 'src/utils/locker';
import { BNBToken } from 'src/utils/marketplace';

const TokensWorth: FC = () => {
  const { t } = useTranslation();
  const { bnbData } = useCoinData();
  const theme = useTheme();
  const { chain } = useContext(ConfigurationContext);
  const { account, library } = useWeb3React();
  const { selectedAddress } = useContext(AssetsContext);

  const web3 = new Web3(library?.provider);

  const [BNBLockToken, setBNBLockToken] = useState<LockToken>(null);
  const [oldTokens, setOldTokens] = useState(null);

  const lockerContractAddress = useMemo(() => chain?.bsc?.products?.locker, [chain?.bsc?.products?.locker]);
  const canLockTokens = useMemo(
    () =>
      !!(
        selectedAddress?.address?.toLowerCase() === account?.toLowerCase() && checkLockerEnabled(lockerContractAddress)
      ),
    [selectedAddress.identifier, account, lockerContractAddress],
  );

  const mediumScreen = useMediaQuery(theme.breakpoints.down(960));

  useEffect(() => {
    const getBNBLockTokenData = async () => {
      const bnbBalance = await getBalance(BNBToken, account, web3);
      const bnbTotalUsd = new BigNumber(bnbBalance).multipliedBy(bnbData.price).toNumber();
      const { amount, deadline } = await getData(BNBToken, lockerContractAddress, account, web3);

      if (bnbData?.price) {
        const newBNBLockToken = {
          address: BNBToken,
          balance: bnbBalance,
          deadline: +deadline,
          identifier: `bsc~token~${BNBToken}`,
          locked: Web3.utils.fromWei(amount),
          name: 'BNB',
          price_usd: +bnbData?.price,
          symbol: 'BNB',
          total_usd: bnbTotalUsd,
        };

        setBNBLockToken((prev) => ({ ...prev, ...newBNBLockToken }));
      }
    };

    if (canLockTokens && bnbData?.price) {
      getBNBLockTokenData();
    } else if (!canLockTokens) {
      setBNBLockToken(null);
    }
  }, [selectedAddress?.address, account, canLockTokens, bnbData]);

  /**
   * Equality check to correctly update table after
   * any add-remove-rename operation.
   */
  useEffect(() => {
    if (!_isEqual(selectedAddress?.tokens, oldTokens)) {
      setOldTokens(selectedAddress.tokens);
    }
  }, [selectedAddress?.tokens]);

  useEffect(() => {
    setOldTokens(selectedAddress.tokens);
  }, []);

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} display="flex" px={4} py={3} mb={1} justifyContent="space-between">
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '22px',
              color: (theme as any).palette.terciary[700],
            }}
          >
            {t('Tokens Worth')}
          </Typography>
          <Box display="flex" alignItems="flex-end" width="auto">
            {mediumScreen ? (
              <WalletSelector />
            ) : (
              <Typography
                component="div"
                sx={{
                  color: '#008380',
                  fontWeight: 500,
                }}
              >
                <EulerAddress address={String(selectedAddress?.address)} removeIcons />
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} display="flex" px={4} pt={1} mb={1}>
          <Box display="grid" gridTemplateColumns="auto 1fr" gap={2}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="72" height="72" rx="16" fill="#E0F1F2" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.1579 23.1667V27.3467C52.2447 27.9883 53 29.1433 53 30.5V41.5C53 42.8567 52.2447 44.0117 51.1579 44.6533V48.8333C51.1579 50.85 49.5 52.5 47.4737 52.5H21.6842C19.6395 52.5 18 50.85 18 48.8333V23.1667C18 21.15 19.6395 19.5 21.6842 19.5H47.4737C49.5 19.5 51.1579 21.15 51.1579 23.1667ZM36.4211 41.5H49.3158V30.5H36.4211V41.5ZM21.6842 23.1667V48.8333H47.4737V45.1667H36.4211C34.3947 45.1667 32.7368 43.5167 32.7368 41.5V30.5C32.7368 28.4833 34.3947 26.8333 36.4211 26.8333H47.4737V23.1667H21.6842ZM44.7105 36C44.7105 37.5188 43.4734 38.75 41.9474 38.75C40.4214 38.75 39.1842 37.5188 39.1842 36C39.1842 34.4812 40.4214 33.25 41.9474 33.25C43.4734 33.25 44.7105 34.4812 44.7105 36Z"
                fill="#42526E"
              />
            </svg>
            <Box>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '19.5px',
                  color: (theme as any).palette.terciary[700],
                  marginBottom: theme.spacing(1),
                }}
              >
                {t('Total balance USD')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '32px',
                  fontWeight: 600,
                  lineHeight: '36px',
                  color: (theme as any).palette.terciary[700],
                }}
              >
                {selectedAddress?.total >= 0 ? `$${getBigNumberCurrencyLabel(selectedAddress.total, false, 3)}` : '--'}
              </Typography>
              {assetsFlags.priceHistory ? (
                <Typography sx={{ color: theme.palette.success.main }} variant="caption" fontWeight={550}>
                  ▼▲3.54% ($166.88)
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} display="flex" px={4} pt={1} mb={1} pb={2}>
          <Box display="grid" gridTemplateColumns="auto 1fr" gap={2}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="72" height="72" rx="16" fill="#E0F1F2" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.4339 33.7128L36.0014 28.1454L41.5736 33.7176L44.8129 30.4783L36.0014 21.6667L27.1946 30.4735L30.4339 33.7128ZM21.666 36.0016L24.9045 32.7631L28.143 36.0016L24.9045 39.2401L21.666 36.0016ZM36.0013 43.8602L30.4338 38.2927L27.1898 41.5273L27.1945 41.532L36.0013 50.3388L44.8128 41.5273L41.5735 38.288L36.0013 43.8602ZM43.8568 36.0039L47.0953 32.7654L50.3338 36.0039L47.0953 39.2424L43.8568 36.0039ZM36.0013 32.7157L39.2883 36.0028L36.0013 39.2946L32.7143 36.0075V35.998L33.2915 35.4207L33.573 35.144L36.0013 32.7157Z"
                fill="#42526E"
              />
            </svg>
            <Box>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '19.5px',
                  color: (theme as any).palette.terciary[700],
                  marginBottom: theme.spacing(1),
                }}
              >
                {t('Balance BNB')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '32px',
                  fontWeight: 600,
                  lineHeight: '36px',
                  color: (theme as any).palette.terciary[700],
                }}
              >
                {selectedAddress?.balance >= 0 ? getBigNumberCurrencyLabel(selectedAddress.balance) : '--'}
                {canLockTokens && BNBLockToken ? <ButtonLock token={BNBLockToken} iconButton /> : null}
              </Typography>
              {assetsFlags.priceHistory ? (
                <Typography sx={{ color: theme.palette.success.main }} variant="caption" fontWeight={550}>
                  ▼▲3.54% ($166.88)
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Grid>
        {assetsFlags.chart ? <TokensWorthTimePeriod /> : null}
        {assetsFlags.chart ? <TokensWorthChart /> : null}
        {oldTokens ? (
          <Grid item xs={12} display="flex">
            <TokensWorthTable />
          </Grid>
        ) : null}
      </Grid>
    </Card>
  );
};

export default TokensWorth;
