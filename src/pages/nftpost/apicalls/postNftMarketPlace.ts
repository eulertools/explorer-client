import axios from 'src/lib/axios';

export const postNftMarketPlace = async (body, url) =>
  axios.privateFetchClient.post('/ad', body, { baseURL: url, prefix: 'marketplace', timeout: 0 });
