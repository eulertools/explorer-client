import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { FC, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import erc20Abi from 'src/abi/erc20.json';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { EulerToken } from 'src/ui/EulerToken';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isBNBToken, isFinished, isLockedSale } from 'src/utils/marketplace';

const useStyles = makeStyles((theme) => ({
  textBox: {
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  tokenLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: theme.spacing(3),
    '& > div > p': {
      fontSize: theme.spacing(3),
    },
  },
}));

interface IPurchaseBalanceProps {
  tokenPrices: { basePrice: any; quotePrice: any };
}

export const PurchaseBalance: FC<IPurchaseBalanceProps> = ({ tokenPrices }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const { purchase, purchaseState } = useContext(MarketplaceContext);

  const [tokensBalance, setTokensBalance] = useState<{
    baseTokenBalance: string;
    quoteTokenBalance: string;
  }>({
    baseTokenBalance: null,
    quoteTokenBalance: null,
  });

  const lockedSale = isLockedSale(+purchase?.kind);
  const finished = lockedSale ? isFinished(purchaseState.isOpen, purchaseState.allClaimed) : !purchaseState.isOpen;

  const claimDate = useMemo(() => {
    const claims = purchase?.claims?.[account.toLowerCase()];
    const lastClaim = claims?.[claims.length - 1];
    const lastClaimDate = new Date(lastClaim?.timestamp);
    const nextClaim = purchase.next_claim?.[account.toLowerCase()];
    const nextClaimDate = new Date(nextClaim?.timestamp);
    if (nextClaim) {
      return `${nextClaimDate.toLocaleDateString()} at ${nextClaimDate.toLocaleTimeString()}`;
    }
    if (lastClaim) {
      return `${lastClaimDate.toLocaleDateString()} at ${lastClaimDate.toLocaleTimeString()}`;
    }
    return '--';
  }, [purchase.next_claim, purchase.claims]);

  const claimAmount = useMemo(() => purchase.base_token_quantity / +purchase.packages, [purchase]);

  const remainingClaims = useMemo(() => +purchase.packages - purchase.claims?.[account.toLowerCase()]?.length, [
    purchase,
  ]);

  const getWalletBalance = useCallback(async () => {
    try {
      const web3 = new Web3(library?.provider);
      if (purchase.base_token_address && purchase.quote_token_address) {
        if (isBNBToken(purchase.base_token_address)) {
          const response = await web3.eth.getBalance(account);
          setTokensBalance((prevState) => ({
            baseTokenBalance: Web3.utils.fromWei(response),
            quoteTokenBalance: prevState.quoteTokenBalance,
          }));
        } else {
          const baseTokenContractInstance = new web3.eth.Contract(erc20Abi.abi as any, purchase.base_token_address);

          const baseResponse = await baseTokenContractInstance?.methods.balanceOf(account).call({ from: account });
          setTokensBalance({
            baseTokenBalance: Web3.utils.fromWei(baseResponse),
            quoteTokenBalance: null,
          });
        }

        if (isBNBToken(purchase.quote_token_address)) {
          const response = await web3.eth.getBalance(account);
          setTokensBalance((prevState) => ({
            baseTokenBalance: prevState.baseTokenBalance,
            quoteTokenBalance: Web3.utils.fromWei(response),
          }));
        } else {
          const quoteTokenContractInstance = new web3.eth.Contract(erc20Abi.abi as any, purchase.quote_token_address);

          const quoteResponse = await quoteTokenContractInstance?.methods.balanceOf(account).call({ from: account });
          setTokensBalance((prevState) => ({
            baseTokenBalance: prevState.baseTokenBalance,
            quoteTokenBalance: Web3.utils.fromWei(quoteResponse),
          }));
        }
      }
    } catch (error) {
      // Shallow error
    }
  }, [purchase]);

  useEffect(() => {
    getWalletBalance();
  }, [purchase]);

  return (
    <>
      {(!lockedSale && purchaseState.canBuy) || (lockedSale && purchaseState.canBuy) || (!lockedSale && finished) ? (
        <>
          <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="space-between">
            <Box className={classes.textBox}>
              <Typography color="textPrimary" variant="h6" marginBottom={1}>
                {`${purchase.quote_token_symbol} BALANCE`}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                {tokensBalance?.quoteTokenBalance
                  ? getBigNumberCurrencyLabel(tokensBalance.quoteTokenBalance, false, 7)
                  : '--'}
              </Typography>
              {tokenPrices?.quotePrice ? (
                <Typography color="textSecondary" variant="overline">
                  {`${tokenPrices.quotePrice} USD`}
                </Typography>
              ) : null}
            </Box>
            <Box my={2}>
              <Divider flexItem />
            </Box>
            <Box className={classes.textBox}>
              <Typography color="textPrimary" variant="h6" marginBottom={1}>
                {`${purchase.base_token_symbol} BALANCE`}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                {tokensBalance?.baseTokenBalance
                  ? getBigNumberCurrencyLabel(tokensBalance.baseTokenBalance, false, 7)
                  : '--'}
              </Typography>
              {tokenPrices?.basePrice ? (
                <Typography color="textSecondary" variant="overline">
                  {`${tokenPrices.basePrice} USD`}
                </Typography>
              ) : null}
            </Box>
            <Hidden mdUp>
              <Box mt={2}>
                <Divider flexItem />
              </Box>
            </Hidden>
          </Grid>
          <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="center">
            <Typography textAlign="center" color="textPrimary" variant="h6" marginBottom={1}>
              {t('DEPOSIT')}
            </Typography>
            <Typography className={classes.tokenLogo} color="textPrimary" variant="h5" gap={1}>
              {`${purchase ? getBigNumberCurrencyLabel(purchase.quote_token_quantity, false, 7) : '--'}`}
              <EulerToken address={purchase.quote_token_address} name={purchase.quote_token_symbol} />
            </Typography>
            <Box my={2}>
              <Divider flexItem />
            </Box>
            <Typography textAlign="center" color="textPrimary" variant="h6" marginBottom={1}>
              {t('RETURN')}
            </Typography>
            <Typography className={classes.tokenLogo} color="textPrimary" variant="h5" gap={1}>
              {`${purchase ? getBigNumberCurrencyLabel(purchase.base_token_quantity, false, 7) : '--'}`}
              <EulerToken address={purchase.base_token_address} name={purchase.base_token_symbol} />
            </Typography>
          </Grid>
        </>
      ) : null}
      {(lockedSale && !purchaseState.canBuy) || (lockedSale && finished) ? (
        <>
          <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="space-between">
            <Box className={classes.textBox}>
              <Typography color="textPrimary" variant="h6" marginBottom={1}>
                {purchaseState.canClaim ? t('CLAIM DATE') : null}
                {remainingClaims > 0 && !purchaseState.canClaim ? t('NEXT CLAIM DATE') : null}
                {remainingClaims === 0 && purchaseState.allClaimed ? t('LAST CLAIM DATE') : null}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                {purchaseState.canClaim ? 'NOW' : `${claimDate}`}
              </Typography>
            </Box>
            <Box my={2}>
              <Divider flexItem />
            </Box>
            <Box className={classes.textBox}>
              <Typography color="textPrimary" variant="h6" marginBottom={1}>
                {t('PACKAGES')}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                {`${purchase.claims?.[account.toLowerCase()]?.length || 0} OF ${purchase?.packages} CLAIMED`}
              </Typography>
            </Box>
            <Hidden mdUp>
              <Box mt={2}>
                <Divider flexItem />
              </Box>
            </Hidden>
          </Grid>
          <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography textAlign="center" color="textPrimary" variant="h6" marginBottom={1}>
              {t('CLAIM')}
            </Typography>
            <Typography className={classes.tokenLogo} color="textPrimary" variant="h5" gap={1}>
              {`${purchase ? getBigNumberCurrencyLabel(claimAmount, false, 7) : '--'}`}
              <EulerToken address={purchase.base_token_address} name={purchase.base_token_symbol} />
            </Typography>
            <Box my={2}>
              <Divider flexItem />
            </Box>
            <Typography textAlign="center" color="textPrimary" variant="h6" marginBottom={1}>
              {t('REMAINING')}
            </Typography>
            <Typography className={classes.tokenLogo} color="textPrimary" variant="h5" gap={1}>
              {`${purchase ? getBigNumberCurrencyLabel(claimAmount * remainingClaims, false, 7) : '--'}`}
              <EulerToken address={purchase.base_token_address} name={purchase.base_token_symbol} />
            </Typography>
          </Grid>
        </>
      ) : null}
    </>
  );
};
