import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import erc20Abi from 'src/abi/erc20.json';
import lockerAbi from 'src/abi/locker.json';
import taxManager from 'src/abi/tax.json';
import { LockContractResponse } from 'src/types/locker';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { isBNBToken } from 'src/utils/marketplace';
import SnackbarService from 'src/utils/snackbar';
import { isAddress } from 'src/utils/stringUtils';

export const MAX_APPROVE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * Check whether the locker product should be enabled as well as buttons and functions.
 *
 * @param lockerContractAddress Locker product address in the bsc network.
 * @returns Whether the locker product should be enabled or not.
 */
export const checkLockerEnabled = (lockerContractAddress: string) => isAddress(lockerContractAddress);

/**
 * Obtain locked amount and deadline required using lockerContract.
 *
 * @param tokenAddress Token address to obtain data from.
 * @param lockerAddress Contract address for euler locker product.
 * @param account Connected web3 user account.
 * @param web3 web3 object for contract application.
 */
export const getData = async (
  tokenAddress: string,
  lockerAddress: string,
  account: string,
  web3: any,
): Promise<LockContractResponse> => {
  try {
    const lockerContract = new web3.eth.Contract(lockerAbi.abi as any, lockerAddress);
    const response = await lockerContract.methods.data(account, tokenAddress).call();
    return response;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return { 0: '', 1: '', amount: '', deadline: '' };
  }
};

/**
 * General balance method for erc20 contract.
 *
 * @param tokenAddress Token address to obtain balance from.
 * @param account Connected web3 user account.
 * @param web3 web3 object for erc20 contract application.
 */
export const getBalance = async (tokenAddress: string, account: string, web3: any): Promise<string> => {
  try {
    if (isBNBToken(tokenAddress)) {
      const response = await web3.eth.getBalance(account);
      const balance = Web3.utils.fromWei(response);
      return balance;
    }

    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenAddress);

    const response = await erc20ContractInstance?.methods.balanceOf(account).call({ from: account });
    const balance = Web3.utils.fromWei(response);

    return balance;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return null;
  }
};

/**
 * General approve method for erc20 contract. Approves MAX possible amount of Tokens after checking if it's needed.
 *
 * @param tokenAddress Token address to be approved.
 * @param lockerAddress Contract address for euler locker product.
 * @param account Connected web3 user account.
 * @param amount Token amount to be approved.
 * @param web3 web3 object for contract application.
 */
export const approve = async (
  tokenAddress: string,
  lockerAddress: string,
  account: string,
  amount: string,
  web3: any,
): Promise<void> => {
  try {
    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenAddress);

    const allowanceResponse = await erc20ContractInstance.methods
      .allowance(account, lockerAddress)
      .call({ from: account });

    const amountFromWei = Web3.utils.fromWei(amount, 'ether');
    const allowanceFromWei = Web3.utils.fromWei(allowanceResponse, 'ether');

    const amountBn = uint256ToDecimalBn(amountFromWei);
    const allowanceBn = uint256ToDecimalBn(allowanceFromWei);

    if (allowanceBn.isZero()) {
      await erc20ContractInstance.methods.approve(lockerAddress, MAX_APPROVE).send({ from: account });
    } else if (allowanceBn.isLessThan(amountBn)) {
      await erc20ContractInstance.methods.increaseAllowance(lockerAddress, MAX_APPROVE).send({ from: account });
    }
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
  }
};

/**
 * Proceeds to lock user tokens.
 *
 * @param tokenAddress Token address to be locked.
 * @param lockerAddress Contract address for euler locker product.
 * @param taxAddress Contract address for euler tax_manager product.
 * @param account Connected web3 user account.
 * @param amount Token amount to be locked.
 * @param deadline Deadline date for unlock.
 * @param web3 web3 object for contract application.
 */
export const onLock = async (
  tokenAddress: string,
  lockerAddress: string,
  taxAddress: string,
  account: string,
  amount: string,
  deadline: Date,
  web3: any,
): Promise<void> => {
  try {
    const lockerContract = new web3.eth.Contract(lockerAbi.abi as any, lockerAddress);
    const taxContract = new web3.eth.Contract(taxManager.abi as any, taxAddress);
    /**
     * Use Deadline as a timestamp in the future for Unlocks
     * Always use timestamp in seconds, so remove 3 last digits to the input
     */
    const deadlineTime = new Date(deadline).getTime().toString().slice(0, 10);

    const methodContract: any = web3.eth.abi.encodeFunctionSignature(
      lockerAbi.abi.find((method: any) => method.name === 'lock'),
    );
    const { _tax } = await taxContract.methods.tax(lockerAddress, methodContract, account).call();

    if (isBNBToken(tokenAddress)) {
      const numTax = Web3.utils.fromWei(_tax);
      const BNTotalTax = new BigNumber(+amount).plus(+numTax);
      const WeiTotalTax = Web3.utils.toWei(BNTotalTax.toString());

      await lockerContract.methods
        .lock(tokenAddress, +deadlineTime, Web3.utils.toWei(amount))
        .send({ from: account, value: WeiTotalTax });
      return;
    }

    await lockerContract.methods
      .lock(tokenAddress, +deadlineTime, Web3.utils.toWei(amount))
      .send({ from: account, value: _tax });
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
  }
};

/**
 * Proceeds to unlock user tokens. Can only be executed once deadline date has passed.
 *
 * @param tokenAddress Token address to be locked.
 * @param lockerAddress Contract address for euler locker product.
 * @param taxAddress Contract address for euler tax_manager product.
 * @param account Connected web3 user account.
 * @param web3 web3 object for contract application.
 */
export const onUnlock = async (
  tokenAddress: string,
  lockerAddress: string,
  taxAddress: string,
  account: string,
  web3: any,
) => {
  try {
    const lockerContract = new web3.eth.Contract(lockerAbi.abi as any, lockerAddress);
    const taxContract = new web3.eth.Contract(taxManager.abi as any, taxAddress);

    const methodContract: any = web3.eth.abi.encodeFunctionSignature(
      lockerAbi.abi.find((method: any) => method.name === 'withdraw'),
    );
    const { _tax } = await taxContract.methods.tax(lockerAddress, methodContract, account).call();

    await lockerContract.methods.withdraw(tokenAddress).send({ from: account, value: _tax });
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
  }
};
