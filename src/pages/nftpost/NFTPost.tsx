import { t } from 'i18next';
import { FC, useContext } from 'react';
import LoginRequired from 'src/components/templates/LoginRequired';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import NetworkRedirect from '../NetworkRedirect';
import { TitleForm } from '../nftcreate/components/TitleForm';
import { FormikNFTPost } from './compositions/FormikNFTPost';

const NFTPost: FC = () => {
  const { featureFlags } = useContext(ConfigurationContext);

  return (
    <>
      {featureFlags.nftDisabled ? (
        <NetworkRedirect />
      ) : (
        <LoginRequired
          sections={[t('Marketplace'), t('Post NFT')]}
          sx={{
            margin: 'auto',
            width: '60%',
            marginTop: 2,
            '@media (max-width: 1600px)': {
              width: '80%',
            },
            '@media (max-width: 1400px)': {
              width: '90%',
            },
            '@media (max-width: 1200px)': {
              width: '100%',
            },
          }}
        >
          <TitleForm title={t('Post NFT')} description={t('Select an NFT or create one')} />
          <FormikNFTPost />
        </LoginRequired>
      )}
    </>
  );
};

export default NFTPost;
