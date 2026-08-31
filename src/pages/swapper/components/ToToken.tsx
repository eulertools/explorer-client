import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import React, { FC, useContext } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useWalletConnected from 'src/hooks/useWalletConnected';
import { getBigNumberCurrencyLabel, uint256ToDecimalBn } from 'src/utils/bigNumber';
import { logger } from 'src/utils/logger';
import { balanceOfABI, NETWORK_TOKEN_ADDRESS, UNKNOWN_LABEL } from '../constants';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';
import { ISwapToken } from '../types';
import TokenSelector from './TokenSelector';

const ToTokenContainer: FC = () => {
  const { account, library } = useWeb3React();

  const classes = swapperStyles();

  const { fromToken, toToken, reloadCount, routeInfo, updateFromToken, updateToToken } = useContext(SwapperContext);

  const web3 = React.useRef(null);

  const [toTokenBalance, setToTokenBalance] = React.useState<BigNumber>(null);

  const walletConnected = useWalletConnected();

  React.useEffect(() => {
    const getFromTokenBalance = async () => {
      if (walletConnected !== 1) {
        return;
      }

      try {
        const isNetworkToken = toToken.address === NETWORK_TOKEN_ADDRESS;

        let balanceTo;

        // Create the web3 instance with the initialized provider if not defined
        if (!web3.current) {
          web3.current = new Web3(library.provider);
        }

        // Create contract considering it's an ERC20 token and will have the balanceOf method defined
        const balanceOfToContractInstance = new web3.current.eth.Contract(balanceOfABI, toToken.address);

        if (isNetworkToken) {
          balanceTo = await web3.current.eth.getBalance(account);
        } else {
          balanceTo = await balanceOfToContractInstance.methods.balanceOf(account).call();
        }

        const toBalanceBN = uint256ToDecimalBn(balanceTo || 0);

        setToTokenBalance(toBalanceBN);
      } catch (error) {
        logger(error);
        setToTokenBalance(null);
      }
    };

    getFromTokenBalance();
  }, [toToken, reloadCount, walletConnected]);

  const onUpdateToToken = React.useCallback(
    (token: ISwapToken) => {
      if (token.address === fromToken.address) {
        updateFromToken(toToken);
      }

      updateToToken(token);
    },
    [fromToken, toToken],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          To (estimated)
        </Typography>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '15px',
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          Balance: {toTokenBalance ? getBigNumberCurrencyLabel(toTokenBalance) : UNKNOWN_LABEL}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={1} mb={1}>
        <Box className={classes.tokenSelector} display="flex" alignItems="center">
          <TokenSelector label="" initialValue={toToken} onValueChange={onUpdateToToken} />
        </Box>
        <Box width="49%">
          <TextField
            fullWidth
            size="small"
            disabled
            className={classes.tokenAmountInput}
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'end',
                fontSize: '15px',
                height: '25px',
              },
            }}
            value={
              !routeInfo.toTokenAmount ? UNKNOWN_LABEL : getBigNumberCurrencyLabel(routeInfo.toTokenAmount, false, 18)
            }
            name="toTokenAmount"
            variant="outlined"
            id="euler-unstake-input"
          />
        </Box>
      </Box>
    </>
  );
};

export default ToTokenContainer;
