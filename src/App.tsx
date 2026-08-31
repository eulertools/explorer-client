import { Web3Provider } from '@ethersproject/providers';
import { createEulerTheme, EulerThemeProvider } from '@eulertools/ui';
import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { useEffect, FC, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import RTL from 'src/components/RTL';
import ModalProvider from 'src/components/modal/ModalProvider';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useScrollReset from 'src/hooks/useScrollReset';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import routes from 'src/routes';
import { initiatePoll, stopPoll } from 'src/slices/coindata';
import { useDispatch } from 'src/store';
import 'src/translations';
import { EulerModal } from 'src/ui/eulerModal/EulerModal';
import { SnackbarUtilsConfigurator } from 'src/utils/snackbar';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App: FC = () => {
  const dispatch = useDispatch();
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const { gtm: gtmConfig, chain } = useContext(ConfigurationContext);

  useScrollReset();

  useEffect(() => {
    function cancelPolling() {
      dispatch(stopPoll());
    }

    dispatch(initiatePoll(chain));

    return () => cancelPolling();
  }, []);

  useEffect(() => {
    if (gtmConfig?.id) {
      gtm.initialize({ containerId: gtmConfig.id });
    }
  }, [gtmConfig.id]);

  const theme = createEulerTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <>
      {/* Avoid indexing in development */}
      {process.env.NODE_ENV === 'development' ? (
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </Helmet>
      ) : null}
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <EulerThemeProvider theme={theme}>
            <RTL direction={settings.direction}>
              <SnackbarProvider dense maxSnack={3}>
                <SnackbarUtilsConfigurator />
                <ModalProvider>
                  <GlobalStyles />
                  {content}
                  <EulerModal />
                </ModalProvider>
              </SnackbarProvider>
            </RTL>
          </EulerThemeProvider>
        </ThemeProvider>
      </Web3ReactProvider>
    </>
  );
};

export default App;
