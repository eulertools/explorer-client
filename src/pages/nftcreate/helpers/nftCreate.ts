import { newNft } from '../apicalls/nft';

export const nftCreate = async (idImage, values, myNftCollection, nft_api) => {
  const { kind, address, identifier } = myNftCollection;
  const body = {
    blockchain: values.network,
    address,
    kind,
    collection: identifier,
    metadata: {
      name: values.name,
      description: values.description,
      image: idImage,
      settings: {
        max_total_supply: values.supply,
      },
    },
  };
  return newNft(body, nft_api);
};
