import Web3 from 'web3';

const writeContract = async (
  web3: Web3,
  address: string,
  abi: any,
  methodName: string,
  parameterCall: any,
  ...args: any[]
) => {
  const methods = abi.filter((method: { name: string }) => method.name === methodName);

  const contract = new web3.eth.Contract(methods, address);

  return contract.methods[methods[0].name](...args).send(parameterCall);
};

const readContract = async (web3: Web3, address: string, abi: any, methodName: string, ...args: any[]) => {
  const methods = abi.filter((method: { name: string }) => method.name === methodName);

  const contract = new web3.eth.Contract(methods, address);

  return contract.methods[methods[0].name](...args).call();
};

export const web3Methods = (provider) => {
  const web3: any = new Web3(provider);

  web3.ext = {
    currentAccount: async () => (await web3.eth.getAccounts())[0],

    writeContract: async (address: string, abi: any, methodName: string, parameterCall: any, ...args: any) =>
      writeContract(web3, address, abi, methodName, parameterCall, ...args),

    readContract: async (address: string, abi: any, methodName: string, ...args: any) =>
      readContract(web3, address, abi, methodName, ...args),

    balanceOf: async (account: string) => web3.utils.fromWei(await web3.eth.getBalance(account)),

    transfer: async (to: string, amount: string) => {
      const from = await provider.currentAccount();

      return web3.eth.sendTransaction({ from, to, value: amount });
    },
  };

  return web3;
};
