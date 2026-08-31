import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { useState, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import erc20Abi from 'src/abi/erc20.json';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import gtm from 'src/lib/gtm';
import {
  MarketplaceContext,
  initialPurchaseObject,
  initialSaleSettings,
} from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { PurchaseActions } from 'src/pages/marketplace/components/Purchase/PurchaseActions';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import slice, { getSales } from 'src/slices/tables/marketplace';
import { useDispatch, useSelector } from 'src/store';
import { EMarketContractSteps } from 'src/types/marketplace';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { MAX_APPROVE, isBNBToken, isFinished, isLockedSale } from 'src/utils/marketplace';
import { getAge, localeDate } from 'src/utils/moment';
import SnackbarService from 'src/utils/snackbar';

const useStyles = makeStyles(() => ({
  itemGrid: {
    paddingTop: '0 !important',
  },
}));

export const PurchaseSummary = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const {
    marketContractInstance,
    updateModal,
    purchase,
    updatePurchase,
    purchaseState,
    updateTab,
    updateSaleTab,
    updateSaleSettings,
  } = useContext(MarketplaceContext);
  const { chain } = useContext(ConfigurationContext);

  const mySalesTableId = UITableID.marketplace_my_sale_list;
  const mySalesFilter = useSelector(selectFilterState(mySalesTableId));

  const [displayAge, setDisplayAge] = useState(false);
  const readableCloseDate = new Date(purchase.close_date).toISOString();

  const lockedSale = isLockedSale(+purchase?.kind);
  const finishedSale = lockedSale ? isFinished(purchaseState.isOpen, purchaseState.allClaimed) : !purchaseState.isOpen;

  const handleViewPurchase = () => {
    updatePurchase(initialPurchaseObject);
    updateSaleSettings(initialSaleSettings);
    updateTab(1);
    updateSaleTab(0);
    dispatch(slice.actions.setSale(initialPurchaseObject));
    dispatch(getSales(mySalesFilter.filter, mySalesTableId));
  };

  const approveToken = useCallback(async (tokenContract: string, amount: string): Promise<void> => {
    const web3 = new Web3(library?.provider);
    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenContract);

    const allowance = await erc20ContractInstance.methods
      .allowance(account, chain.bsc.products.marketplace)
      .call({ from: account });

    const amountFromWei = Web3.utils.fromWei(amount, 'ether');
    const allowanceFromWei = Web3.utils.fromWei(allowance, 'ether');

    const amountBn = uint256ToDecimalBn(amountFromWei);
    const allowanceBn = uint256ToDecimalBn(allowanceFromWei);

    if (allowanceBn.isZero()) {
      await erc20ContractInstance.methods.approve(chain.bsc.products.marketplace, MAX_APPROVE).send({ from: account });
    } else if (allowanceBn.isLessThan(amountBn)) {
      await erc20ContractInstance.methods
        .increaseAllowance(chain.bsc.products.marketplace, MAX_APPROVE)
        .send({ from: account });
    }
  }, []);

  const handleTrade = useCallback(async (): Promise<void> => {
    try {
      updateModal((prev) => ({
        ...prev,
        showModal: true,
        loading: true,
        activeModal: 'purchase',
        kind: +purchase.kind,
        step: EMarketContractSteps.WAITING_APPROVAL,
      }));

      const fees = await marketContractInstance.methods.getBuyFees(+purchase.kind, account).call();
      const feeWei = Web3.utils.fromWei(fees);
      let value = new BigNumber(feeWei);

      const weiAmount = Web3.utils.toWei(new BigNumber(purchase.quote_token_quantity).toString(), 'ether');

      /**
       * We use this address to represent BNB in Testnet
       * therefore we don't need to approve a Sale
       * when an user wants to use BNB.
       */
      if (!isBNBToken(purchase.quote_token_address.toLowerCase())) {
        await approveToken(purchase.quote_token_address.toLowerCase(), weiAmount);
      } else {
        value = value.plus(new BigNumber(purchase.quote_token_quantity));
      }

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.WAITING_CONFIRMATION }));

      await marketContractInstance.methods
        .buy(+purchase.kind, +purchase.identifier)
        .send({ from: account, value: Web3.utils.toWei(value.toString()) });

      // Send analytics for purchase confirmed
      gtm.push({ event: 'purchase_confirmed', category: 'Marketplace', action: 'Purchase confirmed' });

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.CONFIRMED, loading: false }));
      handleViewPurchase();
    } catch (error) {
      SnackbarService.error(error?.message || error, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 5000,
      });

      updateModal((prev) => ({
        ...prev,
        step: EMarketContractSteps.REJECTED_CONFIRMATION,
        loading: false,
        error: error?.message,
      }));
    }
  }, []);

  const handleClaim = useCallback(async (): Promise<void> => {
    try {
      const fees = await marketContractInstance.methods.getClaimFees(+purchase.kind, account).call();

      updateModal((prev) => ({ ...prev, loading: true, step: EMarketContractSteps.WAITING_CONFIRMATION }));

      const numberPackage = purchase.next_claim[account.toLowerCase()].currentPackage;

      await marketContractInstance.methods
        .claim(+purchase.kind, +purchase.identifier, numberPackage)
        .send({ from: account, value: fees });

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.CONFIRMED, loading: false, showModal: false }));
      handleViewPurchase();
    } catch (error) {
      SnackbarService.error(error?.message || error, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 5000,
      });

      updateModal((prev) => ({
        ...prev,
        step: EMarketContractSteps.REJECTED_CONFIRMATION,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  const handleCancel = useCallback(async (): Promise<void> => {
    try {
      updateModal((prev) => ({ ...prev, loading: true, step: EMarketContractSteps.WAITING_CONFIRMATION }));

      await marketContractInstance.methods.cancel(+purchase.kind, +purchase.identifier).send({ from: account });

      updateModal((prev) => ({ ...prev, step: EMarketContractSteps.CONFIRMED, loading: false, showModal: false }));
      handleViewPurchase();
    } catch (error) {
      updateModal((prev) => ({
        ...prev,
        step: EMarketContractSteps.REJECTED_CONFIRMATION,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  const [handleAction, getButtonText] = useMemo(() => {
    if (purchaseState.canCancel) {
      return [handleCancel, 'CANCEL'];
    }

    if (purchaseState.canClaim || (lockedSale && !purchaseState.allClaimed && !purchaseState.canBuy)) {
      return [handleClaim, 'CLAIM'];
    }
    return [handleTrade, 'TRADE'];
  }, [purchaseState]);

  return (
    <Grid item xs={12} md={2} display="flex" flexDirection="column" justifyContent="center">
      <Hidden mdUp>
        <Box mb={2}>
          <Divider flexItem />
        </Box>
      </Hidden>
      <Grid container spacing={3} display="flex" alignItems="center" marginTop={1}>
        <Grid className={classes.itemGrid} item xs={12} display="flex" justifyContent="center" pt={0}>
          {finishedSale ? (
            <Box>
              <Typography textAlign="center" color="textPrimary" variant="h6" marginBottom={1}>
                {t('FINISHED')}
              </Typography>
              <Typography
                onClick={() => setDisplayAge((prev) => !prev)}
                textAlign="center"
                color="textPrimary"
                variant="h5"
                fontWeight="bold"
              >
                {readableCloseDate
                  ? `${displayAge ? getAge(`${readableCloseDate}`) : localeDate(`${readableCloseDate}`)}`
                  : 'N/A'}
              </Typography>
            </Box>
          ) : (
            <PurchaseActions callToAction={handleAction} buttonText={getButtonText} />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
