import { ExtendedTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { FC, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import erc20Abi from 'src/abi/erc20.json';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { EulerToken } from 'src/ui/EulerToken';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { isBNBToken, isFinished, isLockedSale, getPeriodAndUnit } from 'src/utils/marketplace';

const useStyles = makeStyles((theme) => ({
  textBox: {
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  tokenTag: {
    background: theme.palette.background.default,
    borderRadius: '16px',
    padding: theme.spacing(1.5, 2, 1.5, 2),
  },
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1, 2),
      borderRadius: '7px',
    },
  },
  arrowPositive: {
    color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
  },
  arrowNegative: {
    color: theme.palette.error.main,
  },
}));

interface IPurchaseBalanceProps {
  tokenPrices: { basePrice: number; quotePrice: number };
}

export const PurchaseBodyV2: FC<IPurchaseBalanceProps> = ({ tokenPrices }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const { purchase, purchaseState } = useContext(MarketplaceContext);
  const [, setTokensBalance] = useState<{
    baseTokenBalance: string;
    quoteTokenBalance: string;
  }>({
    baseTokenBalance: null,
    quoteTokenBalance: null,
  });

  const [variationPercentage, setVariationPercentage] = useState<BigNumber>(null);

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

  const [timePeriod, timeUnit] = useMemo(() => getPeriodAndUnit(purchase?.period), [purchase]);

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

  const ratio = getBigNumberCurrencyLabel(+purchase.ratio, false, 9);

  useEffect(() => {
    if (tokenPrices?.basePrice && tokenPrices?.quotePrice) {
      const depositValue = new BigNumber(tokenPrices.quotePrice).multipliedBy(purchase.quote_token_quantity);
      const returnValue = new BigNumber(tokenPrices.basePrice).multipliedBy(purchase.base_token_quantity);
      const percentage = returnValue.multipliedBy(100).dividedBy(depositValue).minus(100);

      setVariationPercentage(percentage);
    }
  }, [tokenPrices]);

  return (
    <>
      {!lockedSale ? (
        <Grid container display="flex" flexDirection="column">
          <Grid>
            <Typography color="terciary.700" fontSize="13px" fontWeight={700} my={1} display="flex" gap={1}>
              {purchaseState.canClaim ? t('CLAIM') : t('TRADE')}
            </Typography>
          </Grid>
          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.tokenTag}
            mt={1}
            mb={2}
          >
            <Typography textAlign="center" color="terciary.700" fontSize="13px" fontWeight={500}>
              {t('You send')}
            </Typography>
            <Box display="flex">
              <Box display="flex" flexDirection="column" alignItems="flex-end" mr={1}>
                <Typography color="terciary.700" fontSize="13px" fontWeight={700} gap={1}>
                  {`${purchase ? getBigNumberCurrencyLabel(purchase.quote_token_quantity, false, 7) : '--'} ${
                    purchase ? purchase.quote_token_symbol : ''
                  }`}
                </Typography>
                <Typography color="neutral.500" fontSize="11px" fontWeight={500}>
                  {`~$${(purchase.quote_token_quantity * tokenPrices?.quotePrice).toFixed(2)}`}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AvatarThumbnail
                  address={purchase.quote_token_address}
                  alt={purchase.quote_token_symbol}
                  size="medium"
                />
              </Box>
            </Box>
          </Grid>
          <Grid display="flex" justifyContent="space-between" alignItems="center" className={classes.tokenTag}>
            <Typography textAlign="center" color="terciary.700" fontSize="13px" fontWeight={500}>
              {t('You get')}
            </Typography>
            <Box display="flex">
              <Box display="flex" flexDirection="column" alignItems="flex-end" mr={1}>
                <Typography color="terciary.700" fontSize="13px" fontWeight={700} gap={1}>
                  {`${purchase ? getBigNumberCurrencyLabel(purchase.base_token_quantity, false, 7) : '--'} ${
                    purchase ? purchase.base_token_symbol : ''
                  }`}
                </Typography>
                <Typography color="neutral.500" fontSize="11px" fontWeight={500}>
                  {`~$${(purchase.base_token_quantity * tokenPrices?.basePrice).toFixed(2)}`}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AvatarThumbnail address={purchase.base_token_address} alt={purchase.base_token_symbol} size="medium" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid display="flex" justifyContent="space-between" mb={2}>
            <Typography color="terciary.700" fontSize="13px" fontWeight={700} my={1} display="flex" gap={1}>
              {purchaseState.canClaim ? t('CLAIM') : t('TRADE')}
            </Typography>
            <Box display="flex" alignItems="baseline">
              <AvatarThumbnail address={purchase.quote_token_address} alt={purchase.quote_token_symbol} size="medium" />
              <AvatarThumbnail address={purchase.base_token_address} alt={purchase.base_token_symbol} size="medium" />
            </Box>
          </Grid>
          <Grid display="flex" justifyContent="space-between" mt={2}>
            <Typography color="terciary.700" fontSize="11px" fontWeight={600}>
              Rate
            </Typography>
            <Typography color="neutral.500" fontSize="11px" fontWeight={500}>
              {`1 ${purchase.quote_token_symbol} = ${getBigNumberCurrencyLabel(ratio, false, 4)} ${
                purchase.base_token_symbol
              } `}
            </Typography>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" my={2}>
            <Typography color="textPrimary" variant="subtitle1" fontWeight={500} display="flex" alignItems="center">
              {`${purchase.quote_token_symbol} per ${purchase.base_token_symbol}`}
              <Tooltip
                classes={{ popper: classes.tooltipPopper }}
                enterTouchDelay={0}
                title={
                  variationPercentage ? (
                    <Typography color="black">
                      {`Based on current market values, swapping 
                      ${purchase.quote_token_symbol} for ${purchase.base_token_symbol} results in a
                      ${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}% 
                      ${variationPercentage.isLessThanOrEqualTo(0) ? 'loss' : 'profit'}.`}
                    </Typography>
                  ) : (
                    '--'
                  )
                }
              >
                <InfoIcon />
              </Tooltip>
            </Typography>
            {variationPercentage ? (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography
                  color={
                    variationPercentage.absoluteValue().isLessThanOrEqualTo(0)
                      ? 'success.700'
                      : theme.palette.error.main
                  }
                  fontWeight={700}
                  fontSize={13}
                >
                  {`${getBigNumberCurrencyLabel(variationPercentage.absoluteValue(), false, 2)}%`}
                </Typography>
              </Box>
            ) : (
              '--'
            )}
          </Grid>
        </>
      )}
      {lockedSale ? (
        <Grid item xs={12} display="flex" justifyContent="space-between" flexDirection="column">
          <Grid item display="flex" alignItems="center" textAlign="center" justifyContent="space-between" my={2}>
            <Typography color="terciary.700" fontSize="11px" fontWeight={600}>
              {t('Trade limit')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" textAlign="center">
              <Typography color="neutral.500" fontSize="11px" fontWeight={500}>
                {`${getBigNumberCurrencyLabel(purchase.base_token_quantity / +purchase.packages, false, 7)} ${
                  purchase.base_token_symbol
                }`}
              </Typography>
            </Box>
          </Grid>
          <Grid item display="flex" alignItems="center" textAlign="center" justifyContent="space-between">
            <Typography color="terciary.700" fontSize="11px" fontWeight={600}>
              {t('Period')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" textAlign="center">
              <Typography color="neutral.700" fontSize="11px" fontWeight={500}>
                {purchase?.period !== '0'
                  ? `1 EVERY ${
                      +timeUnit > 1 ? `${timeUnit} ${timePeriod.toUpperCase()}S` : `${timePeriod.toUpperCase()}`
                    }`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ) : null}
      {(lockedSale && !purchaseState.canBuy) || (lockedSale && finished) ? (
        <Box display="flex" flexDirection="column">
          <Grid item xs={12} display="flex" flexDirection="column">
            <Grid
              item
              className={classes.textBox}
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mt={2}
            >
              <Typography color="terciary.700" fontSize="11px" fontWeight={600}>
                {t('Claim date')}
                {remainingClaims > 0 && !purchaseState.canClaim ? t('NEXT CLAIM DATE') : null}
                {remainingClaims === 0 && purchaseState.allClaimed ? t('LAST CLAIM DATE') : null}
              </Typography>
              <Typography color="terciary.700" fontSize="13px" fontWeight={600}>
                {purchaseState.canClaim ? 'NOW' : `${claimDate}`}
              </Typography>
            </Grid>
            <Grid
              item
              className={classes.textBox}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Typography color="terciary.700" fontSize="11px" fontWeight={600}>
                {t('Packages')}
              </Typography>
              <Typography color="terciary.700" fontSize="13px" fontWeight={600}>
                {`${purchase.claims?.[account.toLowerCase()]?.length || 0} OF ${purchase?.packages} CLAIMED`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} display="flex" flexDirection="column">
            <Grid display="flex" justifyContent="space-between" alignItems="center" className={classes.tokenTag} mt={2}>
              <Typography textAlign="center" color="terciary.700" fontSize="13px" fontWeight={500}>
                {t('Claim')}
              </Typography>
              <Typography color="terciary.700" fontSize="13px" fontWeight={700} gap={1} display="flex">
                {`${purchase ? getBigNumberCurrencyLabel(claimAmount, false, 7) : '--'}`}
                <EulerToken address={purchase.base_token_address} name={purchase.base_token_symbol} />
              </Typography>
            </Grid>
            <Grid display="flex" justifyContent="space-between" alignItems="center" className={classes.tokenTag}>
              <Typography textAlign="center" color="terciary.700" fontSize="13px" fontWeight={500}>
                {t('Remaining')}
              </Typography>
              <Typography color="terciary.700" fontSize="13px" fontWeight={700} gap={1} display="flex">
                {`${purchase ? getBigNumberCurrencyLabel(claimAmount * remainingClaims, false, 7) : '--'}`}
                <EulerToken address={purchase.base_token_address} name={purchase.base_token_symbol} />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </>
  );
};
