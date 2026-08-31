import { ExtendedTheme } from '@eulertools/ui';
import Web3 from 'web3';
import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import axios from 'src/lib/axios';
import { EulerLoading } from 'src/ui/EulerLoading';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface NFTsCardProps {
  name: string;
  id: string;
  address: string;
  identifier: string;
  network: string;
}

const NFTsCard: FC<NFTsCardProps> = ({ name, id, address, identifier, network }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { urls: configurationUrls } = useContext(ConfigurationContext);
  const [price, setPrice] = useState(null);
  const [priceUSD, setPriceUSD] = useState(null);
  const [imgURL, setImgURL] = useState('');
  const [imgLoading, setImgLoading] = useState(true);
  const { bnbData } = useCoinData();

  const path = `/${network}/nft/ad/${address}/${id}/${identifier} `;

  useEffect(() => {
    async function getNFTPrice(nftId: string) {
      const response = await axios.publicFetchClient.get(`/marketplace/ad/${nftId}/buy`, {
        baseURL: configurationUrls.nft_api,
        prefix: '',
      });
      const nftResponse = response.data;
      setPrice(Web3.utils.fromWei(nftResponse.payload.note.price));
    }
    async function getNFTImg(nftAddress: string, nftId: string) {
      const response = await axios.publicFetchClient.get(`/${network}/nft/${nftAddress}/${nftId}`, {
        baseURL: configurationUrls.nft_api,
        prefix: '',
      });
      const nftResponse = response.data;
      setImgURL(nftResponse.metadata.image);
      setImgLoading(false);
    }
    getNFTPrice(identifier);
    getNFTImg(address, id);
  }, []);

  useEffect(() => {
    if (bnbData?.price && price) {
      setPriceUSD(Number(price) * bnbData.price);
    }
  }, [price, bnbData]);

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card
      sx={{
        maxWidth: '290px',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
      }}
    >
      {imgLoading ? <EulerLoading /> : <img src={imgURL} alt="nft" width="100%" height="250px" />}
      <Box p={2}>
        <Typography fontSize={18} fontWeight={600} color="terciary.800">
          {name}
        </Typography>
        <Typography fontSize={18} fontWeight={600} color="terciary.800" overflow="hidden" textOverflow="ellipsis">
          #{id}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography fontSize={13} fontWeight={600} color="terciary.800">
            Price
          </Typography>
          <Typography fontSize={16} fontWeight={600} color="terciary.800">
            {`${getBigNumberCurrencyLabel(price, false, 2)} BNB`}
          </Typography>
        </Box>
        <Typography fontSize={13} fontWeight={500} color="terciary.500" textAlign="right" mb={1}>
          {`$${getBigNumberCurrencyLabel(priceUSD, false, 2)}`}
        </Typography>
        <LoadingButton
          fullWidth
          size="large"
          variant="text"
          sx={{
            backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
            borderRadius: '10px',
            padding: theme.spacing(1),
            fontSize: '16px',
            color: 'primary.400',
          }}
          onClick={handleClick}
        >
          Buy
        </LoadingButton>
      </Box>
    </Card>
  );
};

export default NFTsCard;
