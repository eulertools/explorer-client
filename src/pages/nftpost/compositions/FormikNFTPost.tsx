import { useEulerTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Form, Formik } from 'formik';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { ButtonSecondary } from 'src/pages/nftcreate/components/ButtonSecondary';
import { InputFormik } from 'src/pages/nftcreate/components/InputFormik';
import TokenSelector from 'src/pages/swapper/components/TokenSelector';
import { baseTokenList } from 'src/pages/swapper/constants';
import { ISwapToken } from 'src/pages/swapper/types';
import { getTokenData } from 'src/slices/tables/tokens';
import { openModal, UIModal } from 'src/slices/ui/globalModal';
import { metamaskWallet } from 'src/utils/connectWallet';
import { setNetwork } from 'src/utils/network';
import { postNft } from '../helpers/postNft';
import { NftSelectorFormik } from './NftSelectorFormik';

const initialValues = {
  nft: null,
  terms: '',
  token: '',
  amount: 1,
};
export const FormikNFTPost: FC = () => {
  const { settings } = useSettings();
  const {
    urls: { nft_api },
  } = useContext(ConfigurationContext);
  const theme: any = useEulerTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { account, activate } = useWeb3React();
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nftNetwork, setNftNetwork] = useState(null);

  const handleSetNetwork = (nft, setFieldValue) => {
    setNftNetwork(nft.blockchain);
    if (nft.blockchain === 'bsctest') {
      initialValues.token = (baseTokenList[3] as unknown) as string;
      setFieldValue('token', baseTokenList[3]);
    }
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        nft: Yup.mixed().required(t('You have to select an NFT to post')),
        terms: Yup.string().required(t('You have to put the terms of the sell')),
        token: Yup.mixed().required(t('You have to pick a token')),
        amount: Yup.number()
          .typeError(t('You have to put a number'))
          .moreThan(0, t('The amount must be higher than 0')),
      }),
    [settings.language],
  );
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!account) {
        if (!window.ethereum) {
          throw new Error(t('You have to install metamask'));
        }
        await metamaskWallet(activate, null, (e) => {
          throw new Error(t(e.message));
        });
      }
      await setNetwork(values.nft.blockchain);
      const res = await getTokenData(values.token.address, values.nft.blockchain);
      const decimals = (res && res.decimals) || 18;

      const amountFormatted = ethers.utils.parseUnits(values.amount.toString(), decimals);

      await postNft(values, nft_api, auth.user.id, amountFormatted);

      enqueueSnackbar(t('Your NFT has been published successfully'), {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'success',
      });

      const props = {
        type: 'post',
        token_id: values.nft.token_id,
        address: values.nft.address,
        file: values.nft.metadata.image,
        network: values.nft.blockchain,
        onClose: () => {
          navigate(`/${values.nft.blockchain}/marketplace`);
        },
      };

      dispatch(
        openModal({
          type: UIModal.nft,
          identifier: 'NftPostModal',
          config: props,
        }),
      );
      resetForm();
    } catch (e) {
      let message = !e.message ? e.description : e.message;
      if (e.status === 500 || (e.response && e.response.status === 0)) {
        message = 'Something went wrong, please try again later';
      }
      enqueueSnackbar(t(message), {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, values, handleBlur, isSubmitting, resetForm, setFieldValue, handleChange }) => (
        <Form>
          <Box display="flex" flexDirection="column" width="100%" mt="24px" gap="24px">
            <NftSelectorFormik
              name="nft"
              onBlur={handleBlur}
              errors={errors.nft}
              value={values.nft}
              setFieldValue={setFieldValue}
              helpertext={errors.nft ? `${errors.nft}` : null}
              onChange={handleSetNetwork}
            />
            <InputFormik
              label={t('Terms')}
              placeholder={t('Enter your terms and conditions here')}
              multiline
              fullWidth
              rows={8}
              name="terms"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.terms && errors.terms)}
              value={values.terms}
              helperText={errors.terms && touched.terms ? `${errors.terms}` : null}
            />
            <Box>
              <Typography
                mb={1}
                fontSize={13}
                fontWeight={600}
                color={settings.theme === 'light' ? theme.palette.neutral[600] : theme.palette.text.secondary}
              >
                {t('Price')}
              </Typography>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Box display="flex" justifyContent="center" flexDirection="column" width="30%">
                  <Box
                    key={nftNetwork}
                    sx={{
                      border: `1px solid ${theme.palette.grey[400]}`,
                      borderRadius: '12px',
                      backgroundColor: theme.palette.background.paper,
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    }}
                  >
                    <TokenSelector
                      initialValue={(initialValues.token as unknown) as ISwapToken}
                      onValueChange={(newValue: ISwapToken) => setFieldValue('token', newValue)}
                      label=""
                      error={Boolean(touched.token && errors.token)}
                      networkFilter={nftNetwork}
                    />
                  </Box>
                  {errors.token && touched.token ? (
                    <Typography variant="caption" color={theme.palette.error.main}>
                      {errors.token}{' '}
                    </Typography>
                  ) : null}
                </Box>
                <Box width="70%">
                  <InputFormik
                    fullWidth
                    label={t('Amount')}
                    type="text"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9.]*' }}
                    name="amount"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    error={Boolean(touched.amount && errors.amount)}
                    value={values.amount}
                    helperText={errors.amount && touched.amount ? `${errors.amount}` : null}
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" gap={2} alignSelf="flex-end">
              <ButtonSecondary disabled={isSubmitting} onClick={() => resetForm()}>
                {t('Discard')}
              </ButtonSecondary>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit" color="primary">
                {t('Post NFT')}
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
