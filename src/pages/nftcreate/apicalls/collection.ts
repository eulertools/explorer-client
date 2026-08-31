import axios from 'src/lib/axios';

export const searchCollections = async (url, bodyBuilder) => {
  const body = { query: bodyBuilder };
  return axios.publicFetchClient.post('/search', body, { baseURL: url, prefix: 'collection' });
};

export const createCollection = async (url, body) =>
  axios.privateFetchClient.post('', body, { baseURL: url, prefix: 'collection' });

export const getMyCollections = async (url) =>
  axios.privateFetchClient.get('/me', { baseURL: url, prefix: 'collection' });
