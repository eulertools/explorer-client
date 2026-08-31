import { EulerIconAdd, useEulerTheme } from '@eulertools/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { INFTItem } from 'src/types/nft';

interface NFTCardMiniProps {
  nft?: INFTItem;
  isToCreate?: any;
  onClick?: () => void;
  value?: any;
}

export const NFTCardMini: FC<NFTCardMiniProps> = (props: NFTCardMiniProps) => {
  const { t } = useTranslation();
  const theme: any = useEulerTheme();
  const isSelected =
    props.value &&
    props.value.token_id === props.nft.token_id &&
    props.value.address === props.nft.address &&
    props.value.blockchain === props.nft.blockchain;
  return (
    <Card
      sx={{
        height: 200,
        outline: isSelected ? `2px solid ${theme.palette.primary.main}` : '0px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[13],
          cursor: 'pointer',
        },
        '& .MuiCardActionArea-focusHighlight': {
          background: 'transparent',
        },
      }}
      onClick={props.onClick}
    >
      {props.isToCreate ? (
        <>
          <Box
            height="60%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={theme.palette.primary[50]}
          >
            <EulerIconAdd size="m" colorLight={theme.palette.primary[400]} colorDark={theme.palette.primary[400]} />
          </Box>
          <CardContent sx={{ height: '40%' }}>
            <Typography gutterBottom fontSize={13} fontWeight={600} component="div">
              {t('Create NFT')}
            </Typography>
          </CardContent>
        </>
      ) : (
        <>
          <CardMedia component="img" height="60%" image={props.nft?.metadata.image} alt={t('Nft image')} />
          <CardContent sx={{ height: '40%' }}>
            <Typography gutterBottom fontSize={13} fontWeight={600} component="div">
              #{props.nft?.token_id?.slice(0, 7)}
              {props.nft?.token_id?.length > 7 ? '...' : ''}
            </Typography>
            <Typography variant="body2" fontSize={11} color="text.secondary">
              {props.nft?.metadata.name}
            </Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
};
