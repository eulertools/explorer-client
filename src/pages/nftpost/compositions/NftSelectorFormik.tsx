import { useEulerTheme } from '@eulertools/ui';
import { FormikValues } from 'formik';
import { useSnackbar } from 'notistack';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, CircularProgress, Grid, Pagination, Typography } from '@material-ui/core';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import { EulerAlert } from 'src/ui/EulerAlert';
import { getMyNfts } from '../apicalls/getMyNfts';
import { NFTCardMini } from '../components/NFTCardMini';

interface NftSelectorFormikProps extends FormikValues {
  name: string;
  onChange: (nft: any, setFieldValue: any) => void;
}
export const NftSelectorFormik: FC<NftSelectorFormikProps> = (props) => {
  const {
    urls: { nft_api },
  } = useContext(ConfigurationContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const theme: any = useEulerTheme();

  const [myNfts, setMyNfts] = useState([]);
  const [nftsLoaded, setNftsLoaded] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleOnClick = (nft) => {
    props.setFieldValue(props.name, nft);
    props.onChange(nft, props.setFieldValue);
  };

  const myNftsApiCall = async (from, limit) => {
    try {
      const { results, total } = await getMyNfts(nft_api, from, limit, itemsPerPage, user.id);
      setMyNfts(results);
      setTotalItems(total);
    } catch (e) {
      enqueueSnackbar(t('Your NFTs could not be loaded, please try again later'), {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'error',
      });
    }
    setNftsLoaded(true);
  };
  useEffect(() => {
    myNftsApiCall(0, itemsPerPage);
  }, []);

  const onPageChange = async (event, value) => {
    setNftsLoaded(false);
    await myNftsApiCall((value - 1) * itemsPerPage, value * itemsPerPage);
    setPage(value);
  };
  return (
    <Box>
      <Grid
        container
        spacing={2}
        columns={10}
        sx={{
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}
      >
        {!nftsLoaded ? (
          <Grid item xs={5} sm={3} md={2} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            {myNfts.map((nft) => (
              <Grid item xs={5} sm={3} md={2} key={nft.address + nft.blockchain + nft.token_id}>
                <NFTCardMini isToCreate={false} onClick={() => handleOnClick(nft)} nft={nft} value={props.value} />
              </Grid>
            ))}
          </>
        )}
        <Grid item xs={5} sm={3} md={2}>
          <NFTCardMini isToCreate onClick={() => navigate('/nft/new')} />
        </Grid>
      </Grid>
      {totalItems > itemsPerPage ? (
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} mt={3}>
          <Typography variant="overline" color={theme.palette.text.secondary}>
            Page {page}/{totalPages}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            sx={{
              '& .MuiPaginationItem-page': {
                display: 'none',
              },
            }}
          />
        </Box>
      ) : null}
      <Box mt={2}>{props.errors && !props.value ? <EulerAlert message={props.helpertext} type="error" /> : null}</Box>
    </Box>
  );
};
