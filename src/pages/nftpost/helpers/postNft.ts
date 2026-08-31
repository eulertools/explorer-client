import { supportedChains } from 'src/types/blockchain';
import { web3Methods } from 'src/utils/web3';
import { postNftMarketPlace } from '../apicalls/postNftMarketPlace';
import { getSignature } from './signPost';

export const postNft = async (values, nft_api, user_sub, amountFormatted) => {
  const { chainId } = supportedChains.find((item) => item.value === values.nft.blockchain);

  const data: any = {
    token: values.nft.address,
    token_id: values.nft.token_id,
    price: amountFormatted.toString(),
    buyToken: values.token.address,
    amount: 1,
    expirationDate: 0,
  };

  const { signature } = await getSignature(data);

  const web3 = web3Methods(window.ethereum);

  const body = {
    user_sub,
    signature,
    base_token_name: values.nft.metadata.name,
    base_token_address: values.nft.address,
    base_token_id: values.nft.token_id,
    base_token_quantity: data.amount,
    quote_token_name: values.token.name,
    quote_token_symbol: values.token.symbol,
    quote_token_address: values.token.address,
    quote_token_quantity: values.amount,
    close_date: data.expirationDate,
    blockchain_name: values.nft.blockchain,
    blockchain_id: chainId,
    terms: values.terms,
    seller_wallet: await web3.ext.currentAccount(),
  };
  return postNftMarketPlace(body, nft_api);
};
