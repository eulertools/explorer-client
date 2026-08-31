import Web3 from 'web3';
import erc20Abi from 'src/abi/erc20.json';
import migrate from 'src/abi/migrate.json';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { isBNBToken, MAX_APPROVE } from 'src/utils/marketplace';
import SnackbarService from 'src/utils/snackbar';

/**
 * General approve method for erc20 contract. Approves MAX possible amount of Tokens after checking if it's needed.
 *
 * @param eulerAddress Euler address to be approved.
 * @param migrateAddress Migrate contract address to be approved.
 * @param amount Amount to be migrated.
 * @param account Connected web3 user account.
 * @param web3 web3 object for erc20 contract application.
 */
export const approve = async (
  eulerAddress: string,
  migrateAddress: string,
  amount: string,
  account: string,
  web3: any,
): Promise<void> => {
  try {
    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, eulerAddress);

    const allowanceResponse = await erc20ContractInstance.methods
      .allowance(account, migrateAddress)
      .call({ from: account });

    const allowanceFromWei = Web3.utils.fromWei(allowanceResponse, 'ether');

    const amountBn = uint256ToDecimalBn(amount);
    const allowanceBn = uint256ToDecimalBn(allowanceFromWei);

    if (allowanceBn.isZero()) {
      await erc20ContractInstance.methods.approve(migrateAddress, MAX_APPROVE).send({ from: account });
    } else if (allowanceBn.isLessThan(amountBn)) {
      await erc20ContractInstance.methods.increaseAllowance(migrateAddress, MAX_APPROVE).send({ from: account });
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
 * General balance method for erc20 contract.
 *
 * @param tokenAddress Token address to obtain balance.
 * @param address Address to obtain balance from.
 * @param web3 web3 object for erc20 contract application.
 */
export const getBalance = async (tokenAddress: string, address: string, web3: any): Promise<string> => {
  try {
    if (isBNBToken(tokenAddress)) {
      const response = await web3.eth.getBalance(address);
      const balance = Web3.utils.fromWei(response);
      return balance;
    }

    const erc20ContractInstance = new web3.eth.Contract(erc20Abi.abi as any, tokenAddress);

    const response = await erc20ContractInstance?.methods.balanceOf(address).call();
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
 * Obtain total Migrated balance of EULER Tokens.
 *
 * @param migrateAddress Migrate contract address to instantiate web3 Contract.
 * @param account Connected web3 user account.
 * @param web3 web3 object for erc20 contract application.
 */
export const getMigrated = async (migrateAddress: string, account: string, web3: any): Promise<any> => {
  try {
    const migrateContractInstance = new web3.eth.Contract(migrate.abi as any, migrateAddress);

    const migrated = await migrateContractInstance.methods.migratedTokens(account).call();

    return migrated;
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
 * Proceeds to migrate euler tokens.
 *
 * @param migrateAddress Migrate contract address to instantiate web3 Contract.
 * @param amount Token amount to be migrated.
 * @param account Connected web3 user account.
 * @param web3 web3 object for contract application.
 *
 * @return Returns true if successful.
 */
export const onMigrate = async (
  migrateAddress: string,
  account: string,
  amount: string,
  web3: any,
): Promise<boolean> => {
  try {
    const migrateContractInstance = new web3.eth.Contract(migrate.abi as any, migrateAddress);

    const response = await migrateContractInstance.methods.migrate(Web3.utils.toWei(amount)).send({ from: account });
    return response.status;
  } catch (error) {
    SnackbarService.error(error?.message || error, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 5000,
    });
    return false;
  }
};
