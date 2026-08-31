import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useEffect, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Alert from '@material-ui/core/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { useModal } from 'src/components/modal';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import useWalletConnected from 'src/hooks/useWalletConnected';
import { selectRequestNFTDetail } from 'src/selectors/nft';
import { createRequestNFT, getRequestNFT } from 'src/slices/tables/nft';
import { useDispatch, useSelector } from 'src/store';
import { networkToChainIdMap } from 'src/types/blockchain';
import { EMarketContractSteps, marketContractStepOptions } from 'src/types/marketplace';
import { INFTItem } from 'src/types/nft';
import { EulerAlert } from 'src/ui/EulerAlert';
import FormikPasswordInput from 'src/ui/FormikPasswordInput';
import { isOwner, onMint } from 'src/utils/nft';

interface NFTActionProps {
  nft: INFTItem;
}

export const NFTAction: FC<NFTActionProps> = ({ nft }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { account } = useWeb3React();
  const { showModal } = useModal();
  const { enqueueSnackbar } = useSnackbar();
  const { requestNFT, loading } = useSelector(selectRequestNFTDetail);
  const dispatch = useDispatch();
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimStep, setClaimStep] = useState(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const { network } = useParams();

  const walletConnected = useWalletConnected(networkToChainIdMap[network]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const contractStep = useMemo(() => marketContractStepOptions.find((i) => i.key === claimStep)?.label, [claimStep]);

  const initialValues = {
    password: '',
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(7).max(255).required(t('Password is required.')),
  });

  const checkIfOwned = async () => {
    const owned = await isOwner(nft.address, account, nft.token_id);
    setAlreadyOwned(owned);
  };

  const onConnectWallet = () => {
    const connectWalletModal = showModal(ConnectYourWallet, {
      onWalletConnected: () => {
        connectWalletModal.hide();
      },
      onCancel: () => {
        connectWalletModal.hide();
      },
    });
  };

  const onSendPassword = useCallback(
    async (values, { setErrors, setStatus, setSubmitting, setFieldValue }): Promise<void> => {
      try {
        setStatus({ success: true });

        dispatch(createRequestNFT(nft.address, nft.token_id, account, values.password, network));

        setSubmitting(false);
      } catch (err) {
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setFieldValue('password', '');
        setSubmitting(false);

        enqueueSnackbar('Invalid Password.', {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 2500,
          variant: 'error',
        });
      }
    },
    [],
  );

  const onClaimButtonClick = async () => {
    if (walletConnected === 0) {
      enqueueSnackbar('Switch to correct network to continue.', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'error',
      });
      return;
    }

    setClaimLoading(true);
    setClaimStep(EMarketContractSteps.WAITING_CONFIRMATION);

    const signature = {
      r: requestNFT.signature.r,
      s: requestNFT.signature.s,
      v: requestNFT.signature.v,
      value: requestNFT.signature.value,
    };

    const completed = await onMint(nft.address, account, requestNFT.data, signature, requestNFT.position);

    if (completed) {
      setClaimStep(EMarketContractSteps.CONFIRMED);
    } else {
      setClaimStep(EMarketContractSteps.REJECTED_CONFIRMATION);
    }
    checkIfOwned();
    setClaimLoading(false);
  };

  useEffect(() => {
    if (account) {
      dispatch(getRequestNFT(nft.address, nft.token_id, account, network));
    }
  }, [account]);

  useEffect(() => {
    if (walletConnected === 1) {
      checkIfOwned();
    }
  }, [walletConnected]);

  if (!account) {
    return (
      <Button
        fullWidth
        variant="contained"
        onClick={onConnectWallet}
        sx={{
          padding: theme.spacing(0.75, 3),
          backgroundColor: theme.palette.primary[50],
          color: theme.palette.primary[400],
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary[100],
            color: theme.palette.primary[500],
            boxShadow: 'none',
          },
        }}
      >
        {t('Connect your wallet')}
      </Button>
    );
  }

  if (loading) {
    return (
      <LoadingButton
        loading={loading}
        loadingPosition="end"
        endIcon={<></>}
        fullWidth
        color="primary"
        size="large"
        variant="contained"
        disabled
        sx={{
          padding: theme.spacing(0.75, 3),
          backgroundColor: theme.palette.primary[50],
          color: theme.palette.primary[400],
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary[100],
            color: theme.palette.primary[500],
            boxShadow: 'none',
          },
        }}
      >
        {t('Loading')}
      </LoadingButton>
    );
  }

  if (nft.kind === 'event' && alreadyOwned) {
    return (
      <Alert severity="success" variant="filled">
        {t('NFT.IS_OWNER')}
      </Alert>
    );
  }

  if (nft.claim_words === 'ENABLED' && requestNFT === null) {
    return (
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSendPassword}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
          <form noValidate onSubmit={handleSubmit}>
            {isMobile ? (
              <Box>
                <EulerAlert message="Metamask support is limited, try refreshing if the password fails." type="info" />
              </Box>
            ) : null}
            <FormikPasswordInput
              required
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              label={t('Password')}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
            />
            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box mt={1}>
              <LoadingButton
                loading={isSubmitting}
                loadingPosition="end"
                endIcon={<></>}
                fullWidth
                color="primary"
                type="submit"
                size="large"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  padding: theme.spacing(0.75, 3),
                  backgroundColor: theme.palette.primary[50],
                  color: theme.palette.primary[400],
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary[100],
                    color: theme.palette.primary[500],
                    boxShadow: 'none',
                  },
                }}
              >
                {t('Request')}
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    );
  }

  if (nft.claim_words === 'ENABLED' && requestNFT) {
    return (
      <LoadingButton
        loading={claimLoading}
        loadingPosition="end"
        endIcon={<></>}
        fullWidth
        onClick={onClaimButtonClick}
        color="primary"
        size="large"
        variant="contained"
        disabled={claimLoading}
        sx={{
          padding: theme.spacing(0.75, 3),
          backgroundColor: theme.palette.primary[50],
          color: theme.palette.primary[400],
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary[100],
            color: theme.palette.primary[500],
            boxShadow: 'none',
          },
        }}
      >
        {!claimLoading ? t('Claim') : `${contractStep}`}
      </LoadingButton>
    );
  }

  return null;
};
