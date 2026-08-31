import { FC, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import { NFTDialog } from 'src/components/modal/dialogs/NFTDialog';
import useModal from 'src/components/modal/useModal';
import { AppSkeleton } from 'src/components/templates';
import useSettings from 'src/hooks/useSettings';
import { NFTMetadata } from 'src/pages/nft/NFTMetadata';
import { NFTAction } from 'src/pages/nft/components/NFT/NFTAction';
import { selectNFTDetail } from 'src/selectors/nft';
import { getNFT } from 'src/slices/tables/nft';
import { useDispatch, useSelector } from 'src/store';
import { INFTItem } from 'src/types/nft';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { EulerAlert } from 'src/ui/EulerAlert';
import { PageTitle } from 'src/ui/PageTitle';
import { hexToRGB } from 'src/utils/stringUtils';

interface INFTDetailProps {
  nft: INFTItem;
}

const NFTDetail: FC<INFTDetailProps> = ({ nft }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();
  const { showModal } = useModal();

  // TODO: Hidden Flag for editButton until functionality is implemented.
  const [editButton] = useState(false);

  const onCardClick = () => {
    const stakeModal = showModal(NFTDialog, {
      onClose: () => {
        stakeModal.hide();
      },
      imageURL: nft?.metadata?.image,
    });
  };

  const urls = useMemo(() => nft.metadata?.attributes?.filter((i) => i.display_type === 'url'), [[nft?.metadata]]);

  return (
    <AppSkeleton>
      <PageTitle pageTitle={t('NFT Detail')} />
      <Box mb={2}>
        <EulerAlert message="If you are on a mobile metamask browser, try refreshing the site." type="info" />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: theme.palette.background.paper,
              padding: theme.spacing(3),
              boxShadow: 'none',
            }}
          >
            <CardMedia
              component="img"
              image={nft?.metadata?.image}
              onClick={onCardClick}
              sx={{
                borderRadius: theme.spacing(2),
                objectFit: 'contain',
                cursor: 'zoom-in',
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: theme.palette.background.paper,
              padding: theme.spacing(3),
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Grid container display="flex" flexDirection="column" minHeight="100%" gap={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  sx={{
                    color: (theme as any).palette.terciary[700],
                    fontSize: '18px !important',
                    lineHeight: '22px',
                    fontWeight: '600',
                  }}
                >
                  #{nft?.token_id}
                </Typography>
                {urls?.map((u) => (
                  <Tooltip key={u.value} title={u.value}>
                    <IconButton aria-label="Website" onClick={() => window.open(u.value, '_blank')}>
                      <LinkOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                ))}
                {editButton ? (
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="Edit"
                      onClick={() => null}
                      sx={{
                        marginRight: `10px`,
                        marginLeft: `10px`,
                        padding: `10px ${theme.spacing(3)}`,
                        color: theme.palette.primary.main,
                        fontSize: theme.spacing(2),
                        fontWeight: 600,
                        borderRadius: '10px',
                        boxShadow: 'none',
                        background:
                          settings.theme === 'DARK' ? theme.palette.background.paper : 'rgba(232, 234, 254, 1)',
                        '&:hover': {
                          background:
                            settings.theme === 'DARK'
                              ? hexToRGB(theme.palette.background.paper, 0.5)
                              : 'rgba(232, 234, 254, 0.75)',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      <BorderColorIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={0.5}>
                  {nft?.metadata?.name ? (
                    <>
                      <Grid item xs={12} pb={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: (theme as any).palette.terciary[700],
                            fontSize: '13px !important',
                            lineHeight: '17px',
                            fontWeight: '600',
                          }}
                        >
                          {t('Name')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} pb={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: (theme as any).palette.terciary[600],
                            fontSize: '13px!important',
                            lineHeight: '17px',
                            fontWeight: '500',
                          }}
                        >
                          {nft?.metadata.name}
                        </Typography>
                      </Grid>
                    </>
                  ) : null}
                  {nft?.metadata?.description ? (
                    <>
                      <Grid item xs={12} pb={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: (theme as any).palette.terciary[700],
                            fontSize: '13px !important',
                            lineHeight: '17px',
                            fontWeight: '600',
                          }}
                        >
                          {t('Description')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} pb={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: (theme as any).palette.terciary[600],
                            fontSize: '13px!important',
                            lineHeight: '17px',
                            fontWeight: '500',
                          }}
                        >
                          {nft?.metadata?.description}
                        </Typography>
                      </Grid>
                    </>
                  ) : null}
                  <Grid item xs={12} pb={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[700],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '600',
                      }}
                    >
                      {t('Contract Address')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} pb={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        '& > div > span': {
                          color: (theme as any).palette.terciary[600],
                          fontSize: '13px !important',
                          lineHeight: '17px',
                          fontWeight: '500',
                        },
                      }}
                    >
                      <EulerAddress
                        address={nft?.address}
                        addressRender={EulerAddressRenderTypes.truncate_right}
                        showSeeDetailLink={false}
                        hashColor={theme.palette.text.primary}
                        hashIconColor={theme.palette.primary.main}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} pb={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[700],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '600',
                      }}
                    >
                      {t('Token ID')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} pb={1}>
                    <Box display="flex">
                      <Typography
                        variant="h6"
                        sx={{
                          color: (theme as any).palette.terciary[600],
                          fontSize: '13px!important',
                          lineHeight: '17px',
                          fontWeight: '500',
                        }}
                      >
                        {nft?.token_id}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} pb={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[700],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '600',
                      }}
                    >
                      {t('Blockchain')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} pb={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[600],
                        fontSize: '13px!important',
                        lineHeight: '17px',
                        fontWeight: '500',
                      }}
                    >
                      {nft?.blockchain?.toUpperCase()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} flexGrow={1}>
                <NFTMetadata nft={nft} />
              </Grid>
              <Grid item xs={12}>
                <NFTAction nft={nft} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

const NFTDetailWrapper: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { network, address, tokenId } = useParams();

  const { nft, loading, error } = useSelector(selectNFTDetail);

  useEffect(() => {
    if (address && tokenId) {
      dispatch(getNFT(address, tokenId, network));
    }
  }, [network, address, tokenId]);

  if (loading) return <ScreenSpinner />;

  if (error || !nft)
    return (
      <Box pt={2} pb={8} px={2}>
        <EulerAlert type="info" message={t('NFT.NOT_FOUND')} customIcon />
      </Box>
    );

  return <NFTDetail nft={nft} />;
};

export default NFTDetailWrapper;
