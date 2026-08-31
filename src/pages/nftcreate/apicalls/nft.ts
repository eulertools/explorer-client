import axios from 'src/lib/axios';

export const newNft = async (nft: {}, url) => axios.privateFetchClient.post('', nft, { baseURL: url, prefix: 'nft' });

export const putImage = async (image, urlImage) =>
  axios.baseFetchClient.put('', image, { baseURL: urlImage, prefix: '', timeout: 0 });
