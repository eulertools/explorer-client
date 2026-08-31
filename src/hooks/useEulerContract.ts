/* eslint-disable import/no-extraneous-dependencies */
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import React from 'react';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { loggerException } from 'src/utils/logger';

export const SUBSCRIPTION_ABI: AbiItem[] = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const BALANCE_OF_ABI: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface TransferResponse {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  events: TransferResponse[];
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

interface useEulerContractConfig {
  autoConnect?: boolean;
}

export const useEulerContract = (config: useEulerContractConfig) => {
  const { autoConnect = false } = config;
  const { chain } = React.useContext(ConfigurationContext);

  const web3 = React.useRef<Web3 | undefined>();
  const contract = React.useRef<Contract | undefined>();
  const [error, setError] = React.useState<string | null>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tx, setTx] = React.useState<string | undefined>();

  const connect = React.useCallback(() => {
    if (!web3.current) {
      try {
        web3.current = new Web3(window.ethereum);
      } catch (e) {
        loggerException(e);
        setError('Unable to connect provider');
      }
    }
  }, []);

  React.useEffect(() => {
    if (autoConnect) connect();
  }, [autoConnect, connect]);

  /**
   * Right now this is prepare to only handle specific actions
   * of the contract. On the future we can think on connect by default the entire
   * contract actions.
   * @param abi: send the ABI that you need to use
   * @param contractAddress
   */
  const createContract = async (abi = SUBSCRIPTION_ABI, contractAddress) => {
    try {
      if (!contract.current) {
        contract.current = new web3.current.eth.Contract(abi, Web3.utils.toChecksumAddress(contractAddress));
        const [account] = await web3.current.eth.getAccounts();
        web3.current.eth.defaultAccount = account;
      }
    } catch (e) {
      loggerException(e);
      setError('Unable to connect to contract');
    }
  };

  /**
   * Transfer Euler to the company wallet
   * @param from the wallet address
   * @param amount of Euler
   * @returns
   */
  const transfer = (from, amount): Promise<TransferResponse | null> => {
    try {
      setLoading(true);
      const _to = Web3.utils.toChecksumAddress(chain.bsc.company_wallet);
      const _from = Web3.utils.toChecksumAddress(from);
      return contract.current.methods
        .transfer(_to, amount)
        .send({
          from: _from,
        })
        .then((transaction) => {
          setTx(transaction);
          setLoading(false);
          return transaction;
        })
        .catch((e) => {
          loggerException(e);
          setError('Unable to transfer to contract');
          setLoading(false);
          return '';
        });
    } catch (e) {
      loggerException(e);
      setError('Unable to transfer to contract');
      setLoading(false);
    }
    return Promise.resolve(null);
  };
  /**
   * Get amount the euler available on the user's wallet
   * @param from the wallet address
   * @param amount of Euler
   * @returns
   */
  const getEulerBalance = (address: string): Promise<any | null> => {
    try {
      setLoading(true);
      const _of = Web3.utils.toChecksumAddress(address);
      return contract.current.methods
        .balanceOf(_of)
        .call({
          from: _of,
        })
        .then((eulerBalance) => {
          setLoading(false);
          return eulerBalance;
        })
        .catch((e) => {
          loggerException(e);
          setError('Unable to  get Euler balance');
          setLoading(false);
          return '';
        });
    } catch (e) {
      loggerException(e);
      setError('Unable to get Euler balance');
      setLoading(false);
    }
    return Promise.resolve(null);
  };

  return {
    error,
    connect,
    createContract,
    loading,
    tx,
    web3: web3.current,
    // Actions
    transfer,
    getEulerBalance,
  };
};
