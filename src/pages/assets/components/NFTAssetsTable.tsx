import { FC, useMemo } from 'react';
import { useTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { IAssetNFT } from 'src/types/nft';

interface INFTAssetsCardProps {
  nft: IAssetNFT;
}

export const NFTAssetsCard: FC<INFTAssetsCardProps> = ({ nft }) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down(675));

  const nameLength = useMemo(() => {
    if (smallScreen) return 50;
    return 15;
  }, [smallScreen]);

  const metadataName = useMemo(() => {
    if (nft?.metadata?.name?.length > nameLength) return `${nft?.metadata?.name.slice(0, nameLength)}...`;
    return nft?.metadata?.name;
  }, [nft?.metadata?.name, smallScreen]);

  return (
    <Grid item display="flex">
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="img"
          image={nft?.metadata?.image}
          sx={{
            width: '100%',
            height: '100%',
            margin: '0',
            maxHeight: '234px',
          }}
        />
        <CardContent>
          <Grid container display="flex" flexDirection="row" spacing={0.5}>
            <Grid item xs={12} display="flex" flexDirection="column" gap={1}>
              <Typography color="textPrimary" fontSize={18} fontWeight="bold">
                NFT #{nft?.token_id.length > 15 ? `${nft.token_id.substring(0, 15)}...` : nft.token_id}
              </Typography>
              <Tooltip title={nft?.metadata?.name || ''} disableHoverListener={nft?.metadata?.name.length < nameLength}>
                <Typography variant="body1">{metadataName}</Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface INFTAssetsTableProps {
  assets: IAssetNFT[];
}

export const NFTAssetsTable: FC<INFTAssetsTableProps> = ({ assets }) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down(675));

  return (
    <Grid
      container
      display="grid"
      gridTemplateColumns={!smallScreen ? '1fr 1fr 1fr 1fr' : '1fr'}
      pb={2}
      pt={1}
      sx={{ gridGap: '16px' }}
    >
      {assets.map((nft) => (
        <NFTAssetsCard key={`${nft.token_id}~${nft.token_address}`} nft={nft} />
      ))}
    </Grid>
  );
};
