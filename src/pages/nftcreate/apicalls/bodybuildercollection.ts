import bodybuilder from 'bodybuilder';

export const getCollectionQuery = (filter) => {
  const queryObj = bodybuilder();
  const { kind, user_sub, blockchain } = filter;
  if (kind) queryObj.query('match', 'kind', kind);
  if (user_sub) queryObj.query('match', 'user_sub', user_sub);
  if (blockchain) queryObj.filter('term', 'blockchain', blockchain);

  const qBuilt: any = queryObj.build();
  const q = qBuilt.query;

  const body = {
    query: q,
  };

  return body;
};
