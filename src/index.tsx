// This lib will be shipped along react-time-ago
// eslint-disable-next-line import/no-extraneous-dependencies
import TimeAgo from 'javascript-time-ago';
// eslint-disable-next-line import/no-extraneous-dependencies
import en from 'javascript-time-ago/locale/en';
import 'nprogress/nprogress.css';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import App from './App';
import ContextGuard from './components/ContextGuard';
import { AuthProvider } from './contexts/AmplifyContext';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import reportWebVitals from './reportWebVitals';
import './sentry';
import * as serviceWorker from './serviceWorker';
import store from './store';

TimeAgo.addDefaultLocale(en);

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <ConfigurationProvider>
          <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <BrowserRouter>
                  <ContextGuard>
                    <AuthProvider>
                      <App />
                    </AuthProvider>
                  </ContextGuard>
                </BrowserRouter>
              </SettingsProvider>
            </LocalizationProvider>
          </StyledEngineProvider>
        </ConfigurationProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root'),
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
