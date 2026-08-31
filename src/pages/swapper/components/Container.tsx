import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import Web3 from 'web3';
import * as Yup from 'yup';
import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import eulerDexAggregatorAbi from 'src/abi/dex_aggregator.json';
import erc20Abi from 'src/abi/erc20.json';
import wbnbContract from 'src/abi/wbnb.json';
import { WalletRequiredGuard } from 'src/components/WalletRequiredGuard';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import useModal from 'src/components/modal/useModal';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useWalletConnected from 'src/hooks/useWalletConnected';
import gtm from 'src/lib/gtm';
import { EMetamaskErrors } from 'src/pages/staking/components/shared';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import { MAX_APPROVE } from 'src/utils/marketplace';
import SnackbarService from 'src/utils/snackbar';
import { EDEXContrarError, NETWORK_TOKEN_ADDRESS } from '../constants';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';
import FlipTokens from './FlipTokens';
import FromTokenContainer from './FromToken';
import SwapperHeader from './Header';
import RouteRoad from './RouteRoad';
import RoutesContainer from './Routes';
import ToTokenContainer from './ToToken';

const SwapperContainer: FC = () => {
  const { t } = useTranslation();
  const classes = swapperStyles();
  const { showModal } = useModal();
  const { account, library } = useWeb3React();
  const walletConnected = useWalletConnected();

  const [requireWallet, setRequireWallet] = React.useState(false);

  const { chain } = useContext(ConfigurationContext);

  const {
    fromToken,
    toToken,
    routeInfo,
    settings: { slippageTolerancePercentage, gasPrice },
    updateReloadCount,
  } = useContext(SwapperContext);

  async function onSwap(values, { setStatus, setSubmitting, resetForm }) {
    if (walletConnected !== 1) {
      setRequireWallet(true);
      return;
    }

    function resetFormAndReload() {
      // Formik Reset Form and more:
      setStatus({ success: true });
      setSubmitting(false);
      resetForm({ fromTokenAmount: 0 });

      // Reload everything
      updateReloadCount();
    }

    gtm.push({ event: 'swap_start', category: 'Swap', action: 'User started swap' });

    try {
      const amountInInputValue: string = values.fromTokenAmount;
      const web3 = new Web3(library?.provider);

      const dexAContract = chain.bsc.products.dex_agregator;
      const { address: fromTokenAddress } = fromToken;
      const isNetworkToken = fromTokenAddress === NETWORK_TOKEN_ADDRESS;
      // Start check if WBNB to avoid doing swap from euler contract and instead use WBNB contract
      const { address: toTokenAddress } = toToken;
      const wbnbTokenAddress = chain.bsc.tokens.bnb.address;

      const amountIn = web3.utils.toWei(amountInInputValue, 'ether');

      if (isNetworkToken && toTokenAddress.toLowerCase() === wbnbTokenAddress) {
        const wbnbContractInstance = new web3.eth.Contract(wbnbContract.abi as any, wbnbTokenAddress);

        await wbnbContractInstance.methods.deposit().send({ from: account, value: amountIn });

        SnackbarService.success(`Successfully converted to WBNB`, {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 8000,
        });

        resetFormAndReload();
        return;
      }

      if (fromTokenAddress.toLowerCase() === wbnbTokenAddress && toTokenAddress === NETWORK_TOKEN_ADDRESS) {
        const wbnbContractInstance = new web3.eth.Contract(wbnbContract.abi as any, wbnbTokenAddress);

        await wbnbContractInstance.methods.withdraw(amountIn).send({ from: account });

        SnackbarService.success(`Successfully converted to BNB`, {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 8000,
        });

        resetFormAndReload();
        return;
      }

      // End WBNB check
      // ------------------------------------------------------------------
      // Start approve/increase allowance
      // TODO move ABIs to shared folder and this whole logic
      if (!isNetworkToken) {
        const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, fromTokenAddress);

        const allowance = await erc20ContractInstance.methods.allowance(account, dexAContract).call({ from: account });

        const allowanceBn = uint256ToDecimalBn(allowance);

        if (allowanceBn.isZero()) {
          await erc20ContractInstance.methods.approve(dexAContract, MAX_APPROVE).send({ from: account });
        } else if (allowanceBn.isLessThan(amountInInputValue)) {
          await erc20ContractInstance.methods.increaseAllowance(dexAContract, MAX_APPROVE).send({ from: account });
        }
      }

      // End approve/increase allowance
      // ------------------------------------------------------------------
      // Start Swap
      const eulerDexAggregatorContractInstance = new web3.eth.Contract(eulerDexAggregatorAbi.abi as any, dexAContract);

      const amountMinOutBN = new BigNumber(routeInfo.toTokenAmount)
        .multipliedBy(100 - slippageTolerancePercentage)
        .dividedBy(100);

      const splits = routeInfo.protocols.map((r) => ({
        path: r.pools,
        amount: web3.utils.toWei(r.amountIn.toString(), 'ether'),
      }));

      // Deadline
      const deadline = web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20);

      // Minumum amount expected to receive taking into account slippage
      const amountMinOut = web3.utils.toWei(amountMinOutBN.decimalPlaces(18).toString(), 'ether');

      // Calculate user fees
      const feesWei: string = await eulerDexAggregatorContractInstance.methods.getUserFees(account).call();

      // Value should be the amountIn + fees if we are trading the blockchain token (BNB/ETH/...)
      const value = isNetworkToken ? new BigNumber(amountIn).plus(feesWei).toString(10) : feesWei;

      // Do a call of the RPC method before actually sending it to the wallet, this way we can handle
      // the errors more gracefully
      await eulerDexAggregatorContractInstance.methods
        .swap(fromTokenAddress, toTokenAddress, splits, amountIn, amountMinOut, account, deadline)
        .call({ from: account, value });

      const response = await eulerDexAggregatorContractInstance.methods
        .swap(fromTokenAddress, toTokenAddress, splits, amountIn, amountMinOut, account, deadline)
        .send({ from: account, gasPrice: gasPrice * 1000000000, value });

      SnackbarService.success(
        `Swap executed! Transaction ID: ${response?.transactionHash || 'Error retrieving it. Check your wallet.'}`,
        {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 8000,
        },
      );
      // End Swap

      gtm.push({ event: 'swap_success', category: 'Swap', action: 'Swap executed successfully' });

      resetFormAndReload();
    } catch (error) {
      let errorMessage = error?.message || error;

      try {
        if (errorMessage.indexOf('Internal JSON-RPC error.') > -1) {
          let parsedMessage = errorMessage
            .replace('\n', '')
            .replace('Error: ', '')
            .replace('Internal JSON-RPC error.', '');
          parsedMessage = JSON.parse(parsedMessage);

          const { message } = parsedMessage;

          if (message.includes(EDEXContrarError.INSUFFICIENT_OUTPUT_AMOUNT)) {
            errorMessage = 'Swap could not be completed. Try increasing the slippage percentage.';
          } else if (message.includes(EDEXContrarError.INSUFFICIENT_LIQUIDITY)) {
            errorMessage = "Swap could not be completed. Selected pool doesn't have enough liquidity.";
          } else if (message.includes(EDEXContrarError.WRONG_INPUT_ETH)) {
            errorMessage = 'We had an issue calculating your fees, please try again.';
          } else {
            errorMessage = parsedMessage.message;
          }
        }
      } catch {
        // Swallow error
      }

      // TODO unify web3 error handling
      if (error.code === EMetamaskErrors.USER_DENIED_TRANSACTION) {
        errorMessage = 'You cancelled the swap';
      }

      SnackbarService.error(errorMessage, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 8000,
      });

      loggerError(error);

      setStatus({ success: false });
      setSubmitting(false);
    }
  }

  const closeDialog = React.useCallback(() => setRequireWallet(false), []);

  const onConnectWallet = () => {
    const connectWalletModal = showModal(ConnectYourWallet, {
      onWalletConnected: () => {
        connectWalletModal.hide();
      },
      onCancel: () => {
        connectWalletModal.hide();
      },
    });
  };

  return (
    <>
      <Dialog open={requireWallet} onClose={closeDialog}>
        <WalletRequiredGuard onCancel={closeDialog} onWalletConnected={closeDialog} />
      </Dialog>
      <Container className={classes.container} maxWidth="sm">
        <SwapperHeader />
        <Formik
          validateOnChange
          initialValues={{ fromTokenAmount: 0 } as { fromTokenAmount: number }}
          initialTouched={{
            fromTokenAmount: true,
          }}
          validationSchema={Yup.object().shape({
            fromTokenAmount: Yup.number()
              .required('Value is required')
              .min(1e-18, 'Minimum from is set to 1 wei')
              .typeError('Must be a number'),
          })}
          onSubmit={onSwap}
        >
          {({ handleSubmit, isSubmitting, values }): JSX.Element => (
            <form noValidate onSubmit={handleSubmit}>
              {/* From Card */}
              <FromTokenContainer />
              <Box className={classes.toContainer}>
                {/* Button to flip from/to */}
                <FlipTokens />
                {/* To Component */}
                <ToTokenContainer />
                {/* Routes */}
                <RoutesContainer />
              </Box>
              {account ? (
                <Button
                  fullWidth
                  color="primary"
                  disabled={!values.fromTokenAmount || !routeInfo.toTokenAmount || isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  className={classes.swapButton}
                >
                  {t('Swap Token')}
                </Button>
              ) : (
                <Button
                  fullWidth
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.swapButton}
                  onClick={onConnectWallet}
                >
                  {t('Connect your wallet')}
                </Button>
              )}
              <RouteRoad />
            </form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default SwapperContainer;
