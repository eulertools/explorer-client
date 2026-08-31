import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { fetchSettings, initialAWS, initialURLS, settingsInitialState } from 'src/slices/settings';
import { useDispatch } from 'src/store';
import { IAWS, IURLS, IChain, ISettingsDTO } from 'src/types/configuration';
import { loggerError } from 'src/utils/logger';

export interface IConfigurationContextValue {
  aws: IAWS;
  gtm: {
    id: string;
  };
  urls: IURLS;
  externalLinks: Record<string, string>;
  chain: Record<string, IChain>;
  featureFlags: Record<string, boolean>;
  loading: boolean;
  loadingError: boolean;
}

const ConfigurationContext = createContext<IConfigurationContextValue>({
  ...settingsInitialState,
  // This is to match camelCase variables since it's snake_case returned from service
  externalLinks: settingsInitialState.external_links,
  featureFlags: settingsInitialState.features,
  loading: true,
  loadingError: false,
});

export const ConfigurationProvider: FC = ({ children }) => {
  const dispatch = useDispatch();
  const [aws, setAws] = useState<IAWS>(initialAWS);
  const [gtm, setGtm] = useState<{ id: string }>({
    id: '',
  });
  const [urls, setUrls] = useState<IURLS>(initialURLS);
  const [externalLinks, setExternalLiks] = useState<Record<string, string>>({});
  const [chain, setChain] = useState<Record<string, IChain>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function initializeConfiguration() {
      try {
        const response = await dispatch<Promise<ISettingsDTO>>(fetchSettings() as any);

        setAws(response.aws);
        setGtm(response.gtm);
        setUrls(response.urls);
        setExternalLiks(response.external_links);
        setChain(response.chain);
        setFeatureFlags(response.features);
      } catch (error) {
        loggerError(error);
        setLoadingError(true);
      }
      setLoading(false);
    }
    initializeConfiguration();
  }, []);

  return (
    <ConfigurationContext.Provider
      value={{
        aws,
        gtm,
        urls,
        externalLinks,
        chain,
        featureFlags,
        loading,
        loadingError,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ConfigurationContext;
