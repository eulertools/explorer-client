import { getMyCollections } from '../apicalls/collection';

export const getMyNftCollection = async (network, nft_api) => {
  const myCollectionsResponse = await getMyCollections(nft_api);
  const myCollection = myCollectionsResponse.data.results;

  let myNftCollection;

  myCollection.forEach((key) => {
    if (key.kind === 'generic-managed' && key.blockchain === network) myNftCollection = key;
  });

  return myNftCollection;
};
