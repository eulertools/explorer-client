import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { selectNFTList } from 'src/selectors/nft';
import { getNFTList } from 'src/slices/tables/nft';
import { useDispatch, useSelector } from 'src/store';
import NFTsCard from './NFTsCard';

const NFTsList = () => {
  const dispatch = useDispatch();
  const { nfts } = useSelector(selectNFTList);

  useEffect(() => {
    dispatch(getNFTList());
  }, []);

  return (
    <Box display="flex" flexWrap="wrap">
      {nfts.map((item) => (
        <NFTsCard
          key={item.base_token_id}
          name={item.quote_token_name}
          id={item.base_token_id}
          address={item.base_token_address}
          identifier={item.identifier}
          network={item.blockchain_name}
        />
      ))}
    </Box>
  );
};

export default NFTsList;
