import { capitalize } from 'lodash';
import { getCollectionQuery } from '../apicalls/bodybuildercollection';
import { createCollection, searchCollections } from '../apicalls/collection';

export const createMyNftCollection = async (network, nft_api, user_id, t) => {
  const queryDefaultCollection = getCollectionQuery({ blockchain: network });
  const defaultCollectionResponse = await searchCollections(nft_api, queryDefaultCollection);
  if (defaultCollectionResponse.data.results.length === 0)
    throw new Error(t('The default collection of the selected network does not exist'));
  const defaultCollection = defaultCollectionResponse.data.results[0];

  const body = {
    user_sub: user_id,
    kind: 'generic-managed',
    blockchain: network,
    description: `User private default collection of nfts in the ${network} blockchain`,
    name: `${capitalize(network)} user private nft collection`,
    address: defaultCollection.address,
  };
  await createCollection(nft_api, body);
};
