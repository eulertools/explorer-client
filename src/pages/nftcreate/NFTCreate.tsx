import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LoginRequired from 'src/components/templates/LoginRequired';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import NetworkRedirect from '../NetworkRedirect';
import { TitleForm } from './components/TitleForm';
import { FormikNFT } from './compositions/FormikNFT';

const NFTCreate: FC = () => {
  const { featureFlags } = useContext(ConfigurationContext);
  const { t } = useTranslation();
  return (
    <>
      {featureFlags.nftDisabled ? (
        <NetworkRedirect />
      ) : (
        <LoginRequired
          sections={[t('My Profile'), t('Create NFT')]}
          sx={{
            '@media (max-width: 900px)': {
              width: '100%',
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            m: 'auto',
            width: '50%',
            mt: 2,
          }}
        >
          <TitleForm title={t('Create NFT')} description={t('Import an image *')} />
          <FormikNFT />
        </LoginRequired>
      )}
    </>
  );
};

export default NFTCreate;
