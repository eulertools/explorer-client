import bodybuilder from 'bodybuilder';
import axios from 'src/lib/axios';

const getUserNftQuery = (user_sub) => {
  const queryObj = bodybuilder();

  queryObj.query('match', 'kind', 'generic-managed');
  queryObj.query('match', 'user_sub', user_sub);

  const qBuilt: any = queryObj.build();
  const q = qBuilt.query;

  const body = {
    query: q,
  };

  return body;
};

export const getMyNfts = async (url, from, limit, size, user_sub) => {
  const query = getUserNftQuery(user_sub);
  const body = { query, from, limit, size };
  const response = axios.privateFetchClient.post('/search', body, {
    baseURL: url,
    prefix: 'nft',
    timeout: 40000,
  });
  return (await response).data;
};
