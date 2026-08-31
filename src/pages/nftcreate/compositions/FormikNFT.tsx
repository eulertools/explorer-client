import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { openModal, UIModal } from 'src/slices/ui/globalModal';
import { getCollectionQuery } from '../apicalls/bodybuildercollection';
import { searchCollections } from '../apicalls/collection';
import { ButtonSecondary } from '../components/ButtonSecondary';
import { InputFileFormik } from '../components/InputFileFormik';
import { InputFormik } from '../components/InputFormik';
import { NetworkSelectorFormik } from '../components/NetworkSelectorFormik';
import { checkImage } from '../helpers/checkImage';
import { createMyNftCollection } from '../helpers/createMyNftCollection';
import { getMyNftCollection } from '../helpers/getMyNftCollection';
import { nftCreate } from '../helpers/nftCreate';

const initialValues = {
  file: null,
  name: '',
  description: '',
  network: '',
  supply: 0,
};

export const FormikNFT: FC = () => {
  const {
    settings: { language },
  } = useSettings();
  const { t } = useTranslation();
  const {
    urls: { nft_api },
  } = useContext(ConfigurationContext);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const dispatch = useDispatch();

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Check if the user has his NftCollection based on the network and the default collection provided
      const queryCollection = getCollectionQuery({ blockchain: values.network, user_sub: user.id });
      const userCollectionResponse = await searchCollections(nft_api, queryCollection);
      const hasCollectionCreated = userCollectionResponse.data.results.length > 0;

      if (!hasCollectionCreated) {
        await createMyNftCollection(values.network, nft_api, user.id, t);
      }

      const myNftCollection = await getMyNftCollection(values.network, nft_api);

      const identifier = await checkImage(values.file, nft_api);

      const nftResponse = await nftCreate(identifier, values, myNftCollection, nft_api);

      values.address = nftResponse.data.payload.address;
      values.token_id = nftResponse.data.payload.token_id;

      enqueueSnackbar(t('The NFT has been created!'), {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'success',
      });

      const props = {
        type: 'create',
        token_id: values.token_id,
        address: values.address,
        name: values.name,
        file: URL.createObjectURL(values.file),
        network: values.network,
      };
      dispatch(
        openModal({
          type: UIModal.nft,
          identifier: 'NftCreatedModal',
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

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        file: Yup.mixed()
          .nullable()
          .required(t('File is required'))
          .test('FILE_SIZE', t('Uploaded file is too big'), (value) => !value || (value && value.size <= 100000000)) // 100 MB
          .test(
            'FILE_FORMAT',
            t('The uploaded file has an unsupported format'),
            (value) => value && value.type.includes('image'),
          ),
        name: Yup.string().min(7, t('The name must contain at least 7 characters')).required(t('Name is required')),
        description: Yup.string().required(t('Description is required')),
        network: Yup.string().required(t('You must pick a network')),
        supply: Yup.number().moreThan(0, t('The supply must be higher than 0')).required(t('Supply is required')),
      }),
    [language],
  );

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        resetForm,
      }) => (
        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box display="flex" flexDirection="column" width="100%" my={2} gap={3}>
            <InputFileFormik
              name="file"
              onBlur={handleBlur}
              setFieldValue={setFieldValue}
              errors={errors.file}
              touched={touched.file}
              value={values.file}
            />
            <InputFormik
              label={t('Name')}
              placeholder={t('E g My first NFT')}
              fullWidth
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.name && errors.name)}
              value={values.name}
              helperText={errors.name && touched.name ? `${errors.name}` : null}
            />
            <InputFormik
              label={t('Description')}
              placeholder={t('Enter a description here')}
              multiline
              fullWidth
              rows={7}
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.description && errors.description)}
              value={values.description}
              helperText={errors.description && touched.description ? `${errors.description}` : null}
            />
            <NetworkSelectorFormik
              name="network"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.network && errors.network)}
              helpertext={errors.network && touched.network ? `${errors.network}` : null}
              value={values.network}
            />
            <InputFormik
              label={t('Supply')}
              type="number"
              name="supply"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.supply && errors.supply)}
              value={values.supply}
              helperText={errors.supply && touched.supply ? `${errors.supply}` : null}
            />
            <Box display="flex" gap={2} alignSelf="flex-end">
              <ButtonSecondary disabled={isSubmitting} onClick={() => resetForm()}>
                {t('Discard')}
              </ButtonSecondary>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit" color="primary">
                {t('Create NFT')}
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
