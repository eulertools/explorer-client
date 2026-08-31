// eslint-disable-next-line import/no-extraneous-dependencies
import utils from 'web3-utils';
import SignSDK from 'src/utils/signature';

const generateHash = (data: any) =>
  utils.sha3(
    utils.encodePacked(
      { value: '0x19', type: 'bytes1' },
      { value: '0x0', type: 'bytes1' },
      { value: data.token, type: 'address' },
      { value: data.token_id, type: 'uint256' },
      { value: data.price, type: 'uint112' },
      { value: data.buyToken, type: 'address' },
      { value: data.amount, type: 'uint112' },
      { value: data.expirationDate, type: 'uint32' },
    ) as string,
  );

export const getSignature = async (data) => {
  const provider = window.ethereum;

  const hash = generateHash(data);

  const signature = await SignSDK.sign(provider, hash);

  return { signature };
};
