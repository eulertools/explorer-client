import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { FC, useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import { LoadingButton } from '@material-ui/lab';
import nftAbi from 'src/abi/nft.json';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import { NFTDialog } from 'src/components/modal/dialogs/NFTDialog';
import useModal from 'src/components/modal/useModal';
import { AppSkeleton } from 'src/components/templates';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useCoinData from 'src/hooks/useCoinData';
import useSettings from 'src/hooks/useSettings';
import useWalletConnected from 'src/hooks/useWalletConnected';
import axios from 'src/lib/axios';
import { NFTMetadata } from 'src/pages/nft/NFTMetadata';
import { selectNFTDetail } from 'src/selectors/nft';
import { getNFT } from 'src/slices/tables/nft';
import { useDispatch, useSelector } from 'src/store';
import { supportedChains } from 'src/types/blockchain';
import { INFTItem, INFTAd } from 'src/types/nft';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { EulerAlert } from 'src/ui/EulerAlert';
import { PageTitle } from 'src/ui/PageTitle';
import { BNBToken } from 'src/utils/marketplace';
import { onBuy } from 'src/utils/nft';
import { hexToRGB } from 'src/utils/stringUtils';
import NFTCosts from './NFTCosts';
import { NFTBuySuccess } from './NTFBuySuccess';

interface INFTBuyDetailProps {
  nft: INFTItem;
  identifier: string;
}

const NFTBuy: FC<INFTBuyDetailProps> = ({ nft, identifier }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();
  const { showModal } = useModal();
  const { account } = useWeb3React();
  const { urls: configurationUrls } = useContext(ConfigurationContext);
  const [nftToBuy, setNftToBuy] = useState<INFTAd | null>(null);
  const { isAuthenticated } = useAuth();
  const [gas, setGas] = useState(null);
  const { bnbData } = useCoinData();
  const [isLoading, setIsLoading] = useState(false);
  const { network: paramNetwork } = useParams();

  // TODO: Hidden Flag for editButton until functionality is implemented.
  const [editButton] = useState(false);

  const urls = useMemo(() => nft.metadata?.attributes?.filter((i) => i.display_type === 'url'), [[nft?.metadata]]);

  const network = supportedChains.find((n) => n.value === paramNetwork);

  const walletConnected = useWalletConnected(network.chainId);

  const onCardClick = () => {
    const stakeModal = showModal(NFTDialog, {
      onClose: () => {
        stakeModal.hide();
      },
      imageURL: nft?.metadata?.image,
    });
  };

  const onConnectWallet = () => {
    const connectWalletModal = showModal(ConnectYourWallet, {
      onWalletConnected: () => {
        connectWalletModal.hide();
      },
      onCancel: () => {
        connectWalletModal.hide();
      },
      propsNetwork: paramNetwork,
    });
  };

  const getNFTToBuy = async (id: string) => {
    const response = await axios.publicFetchClient.get(`/marketplace/ad/${id}/buy`, {
      baseURL: configurationUrls.nft_api,
      prefix: '',
    });
    const nftResponse = response.data;
    setNftToBuy(nftResponse.payload);
  };

  useEffect(() => {
    if (identifier) {
      getNFTToBuy(identifier);
    }
  }, [identifier]);

  const getTxGas = async () => {
    const to = account;
    const web3 = new Web3(Web3.givenProvider);
    const nftContract = new web3.eth.Contract(nftAbi.abi as any, nftToBuy.token);
    let value = '0';
    if (nftToBuy.note.buyToken === BNBToken) {
      value = nftToBuy.note.price;
    }
    const gasWei = await nftContract.methods
      .buy(nftToBuy.parameters, nftToBuy.note, nftToBuy.signatureCreate, nftToBuy.signature, to)
      .estimateGas({ value });
    web3.eth.getGasPrice().then((gasPrice) => {
      setGas(web3.utils.fromWei((Number(gasPrice) * gasWei).toString()));
    });
  };

  useEffect(() => {
    if (account && !!nftToBuy) {
      getTxGas();
    }
  }, [nftToBuy, account]);

  const handleBuy = async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      const to = account;
      const completed = await onBuy(
        nftToBuy.token,
        account,
        nftToBuy.parameters,
        nftToBuy.note,
        nftToBuy.signatureCreate,
        nftToBuy.signature,
        to,
      );
      if (completed) {
        const NFTBuySuccessModal = showModal(NFTBuySuccess, {
          onClose: () => {
            NFTBuySuccessModal.hide();
          },
          imageURL: nft?.metadata?.image,
          name: nft?.metadata?.name,
        });
      }
      setIsLoading(false);
    } else {
      const authModal = showModal(AuthDialog, {
        onClose: () => {
          authModal.hide();
        },
      });
    }
  };

  return (
    <AppSkeleton>
      <PageTitle pageTitle={t('NFT Detail')} />
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
                        overflow="hidden"
                        textOverflow="ellipsis"
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
                {walletConnected === 1 ? (
                  <Grid item xs={12}>
                    <NFTCosts
                      price={nftToBuy ? Web3.utils.fromWei(nftToBuy.note.price) : ''}
                      priceUsd={
                        nftToBuy && bnbData
                          ? (Number(Web3.utils.fromWei(nftToBuy.note.price)) * bnbData.price).toString()
                          : ''
                      }
                      gasBnb={gas}
                      gasUsd={bnbData ? gas * bnbData.price : null}
                    />
                  </Grid>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                {walletConnected === 1 ? (
                  <LoadingButton
                    loading={isLoading}
                    onClick={handleBuy}
                    sx={{
                      fontSize: '16px',
                      padding: theme.spacing(1, 1.5),
                      backgroundColor: theme.palette.primary[50],
                      color: theme.palette.primary[400],
                      borderRadius: theme.spacing(1.25),
                      boxShadow: 'none',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: theme.palette.primary[100],
                        color: theme.palette.primary[500],
                        boxShadow: 'none',
                      },
                    }}
                    disabled={!nftToBuy}
                  >
                    Buy
                  </LoadingButton>
                ) : (
                  <Button
                    onClick={onConnectWallet}
                    sx={{
                      fontSize: '16px',
                      padding: theme.spacing(1, 1.5),
                      backgroundColor: theme.palette.primary[50],
                      color: theme.palette.primary[400],
                      boxShadow: 'none',
                      borderRadius: theme.spacing(1.25),
                      width: '100%',
                      '&:hover': {
                        backgroundColor: theme.palette.primary[100],
                        color: theme.palette.primary[500],
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Connect wallet
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

const NFTBuyWrapper: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { network, address, tokenId, identifier } = useParams();

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

  return <NFTBuy nft={nft} identifier={identifier} />;
};

export default NFTBuyWrapper;
