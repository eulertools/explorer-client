import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import Web3 from 'web3';
import React, { FC, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useWalletConnected from 'src/hooks/useWalletConnected';
import axios from 'src/lib/axios';
import gtm from 'src/lib/gtm';
import { getBigNumberCurrencyLabel, uint256ToDecimalBn } from 'src/utils/bigNumber';
import { logger } from 'src/utils/logger';
import { balanceOfABI, NETWORK_TOKEN_ADDRESS, UNKNOWN_LABEL } from '../constants';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';
import { ISwapToken, TBalanceAndInfo } from '../types';
import TokenSelector from './TokenSelector';

const FromTokenContainer: FC = () => {
  const classes = swapperStyles();
  const { chain } = useContext(ConfigurationContext);
  const { fromToken, toToken, updateFromToken, updateToToken, reloadCount } = useContext(SwapperContext);

  const { setFieldValue, setFieldTouched, touched, errors, values, handleChange, isSubmitting } = useFormikContext<{
    fromTokenAmount: number;
  }>();
  const { account, library } = useWeb3React();
  const walletConnected = useWalletConnected();

  const web3 = React.useRef(null);

  const [fromTokenBalance, setFromTokenBalance] = React.useState<BigNumber>(null);
  const [fromTokenInformation, setFromTokenInformation] = React.useState<any>(null);

  React.useEffect(() => {
    const getFromTokenBalance = async () => {
      try {
        const isNetworkToken = fromToken.address === NETWORK_TOKEN_ADDRESS;

        const promises: TBalanceAndInfo = [
          axios.publicFetchClient.get(
            `/tokens/${
              isNetworkToken ? chain.bsc.tokens.bnb.address : fromToken.address
            }?fields[]=price_usd,name,symbol`,
          ),
        ] as any;

        if (walletConnected === 1) {
          // Create the web3 instance with the initialized provider if not defined
          if (!web3.current) {
            web3.current = new Web3(library.provider);
          }

          // Create contract considering it's an ERC20 token and will have the balanceOf method defined
          const balanceOfFromContractInstance = new web3.current.eth.Contract(balanceOfABI, fromToken.address);

          if (fromToken.address === NETWORK_TOKEN_ADDRESS) {
            promises.push(web3.current.eth.getBalance(account));
          } else {
            promises.push(balanceOfFromContractInstance.methods.balanceOf(account).call());
          }
        }

        const [tokenInformation, balanceFrom] = await Promise.allSettled(promises);

        // If we don't have information about the token we still want to continue
        let fromBalanceBN = null;

        if (balanceFrom?.status === 'fulfilled') {
          fromBalanceBN = uint256ToDecimalBn(balanceFrom.value || 0);
        }

        if (tokenInformation.status === 'fulfilled') {
          setFromTokenInformation(tokenInformation?.value?.data);
        }

        setFromTokenBalance(fromBalanceBN);
      } catch (error) {
        logger(error);
        setFromTokenBalance(null);
      }
    };

    getFromTokenBalance();
  }, [fromToken, reloadCount, walletConnected]);

  const onUpdateFromToken = React.useCallback(
    (token: ISwapToken) => {
      if (token.address === toToken.address) {
        updateToToken(fromToken);
      }

      updateFromToken(token);
      gtm.push({ event: 'user_select_token', category: 'Swapper', action: 'User select token' });
    },
    [toToken, fromToken],
  );

  const fromTokenUSDPrice = new BigNumber(values.fromTokenAmount).multipliedBy(
    fromTokenInformation?._source?.price_usd,
  );

  return (
    <Box className={classes.fromContainer}>
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          From
        </Typography>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          Balance:{' '}
          {fromTokenBalance ? (
            <>
              {getBigNumberCurrencyLabel(fromTokenBalance)}
              {/* Known issue in MUI paddings and margins get overridden */}
              <Link
                paddingLeft="8px !important"
                component="button"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  setFieldValue('fromTokenAmount', fromTokenBalance.toString());
                  setFieldTouched('fromTokenAmount', true, false);
                }}
                underline="hover"
              >
                Max
              </Link>
            </>
          ) : (
            UNKNOWN_LABEL
          )}
        </Typography>
      </Box>
      <Box display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="flex-start">
        <Box className={classes.tokenSelector} display="flex" alignItems="center">
          <TokenSelector initialValue={fromToken} onValueChange={onUpdateFromToken} label="" />
        </Box>
        <Box width="49%">
          <TextField
            fullWidth
            size="small"
            className={classes.tokenAmountInput}
            color="primary"
            value={values.fromTokenAmount}
            onChange={handleChange}
            name="fromTokenAmount"
            variant="outlined"
            id="euler-unstake-input"
            error={Boolean(touched.fromTokenAmount && errors.fromTokenAmount)}
            helperText={touched.fromTokenAmount && errors.fromTokenAmount}
            onFocus={(event) => {
              event.target.select();
            }}
            disabled={isSubmitting}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          {fromToken.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          {fromTokenUSDPrice?.isGreaterThan(0) ? `~ $${getBigNumberCurrencyLabel(fromTokenUSDPrice)}` : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default FromTokenContainer;
