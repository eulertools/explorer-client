import { web3Methods } from './web3';

const sign = async (provider: any, hash: string) => {
  const web3 = web3Methods(provider);

  const account = await web3.ext.currentAccount();

  let signature = await web3.eth.personal.sign(hash, account);

  signature = signature.replace('0x', '');

  const r = `0x${signature.substring(0, 64)}`;

  const s = `0x${signature.substring(64, 128)}`;

  let v = `0x${signature.substring(128, signature.length)}`;

  if (v === '0x00' || v === '0x01') v = web3.utils.toHex(27 + web3.utils.toNumber(v)); // development

  signature = `${r}${s.replace('0x', '')}${v.replace('0x', '')}`;

  return {
    value: hash,
    signature,
    v,
    r,
    s,
  };
};

export default {
  sign,
};
