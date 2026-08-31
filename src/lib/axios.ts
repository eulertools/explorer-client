import { Auth } from 'aws-amplify';
import axios, { AxiosRequestConfig } from 'axios';
import { ESupportedNetworks } from 'src/types/blockchain';
import { logger } from 'src/utils/logger';
import { pathJoin } from 'src/utils/stringUtils';

// TODO in config maybe?
const AUTH_APP_TOKEN = '234FFnnweo$as';
const BASE_TIMEOUT = 20000;

export function getSelectedNetworkFromLocalstorage() {
  const storedData: string | null = window.localStorage.getItem('settings');

  let network = ESupportedNetworks.BNB;

  if (storedData) {
    try {
      const storedSettings = JSON.parse(storedData);

      if (Object.values(ESupportedNetworks).includes(storedSettings.network)) {
        network = storedSettings.network;
      }
    } catch {
      // Swallow error
      network = ESupportedNetworks.BNB;
    }
  }
  return network;
}

function interceptRequesURL(config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  const prefix = config.prefix === '' ? '' : config.prefix || getSelectedNetworkFromLocalstorage();
  config.url = pathJoin([prefix, config.url]);
  return config;
}

// 🚀 -----------------------------------------
// 🚀 BASE UNCONFIGURED FETCH CLIENT
// 🚀 -----------------------------------------
const baseFetchClient = axios.create({
  timeout: BASE_TIMEOUT,
});

// 🚀 -----------------------------------------
// 🚀 BASE PUBLIC FETCH CLIENT
// 🚀 -----------------------------------------
const publicFetchClient = axios.create({
  timeout: BASE_TIMEOUT,
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Authorization: AUTH_APP_TOKEN, 'Content-Type': 'application/json' },
});

publicFetchClient.interceptors.request.use(interceptRequesURL);

publicFetchClient.interceptors.response.use(
  (response) => response,
  // (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
  (error) => Promise.reject((error.response && error.response.data) || error),
);

// 🚀 -----------------------------------------
// 🚀 BASE PRIVATE FETCH CLIENT
// 🚀 -----------------------------------------
const privateFetchClient = axios.create({
  timeout: BASE_TIMEOUT,
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Append token on each request
privateFetchClient.interceptors.request.use(async (config) => {
  const session = await Auth.currentSession();
  const cognitoIdToken = session.getIdToken();

  if (cognitoIdToken) {
    const jwtToken = cognitoIdToken.getJwtToken();

    const newConfig = await interceptRequesURL(config);

    newConfig.headers.Authorization = `Bearer ${jwtToken}`;

    return newConfig;
  }

  throw new Error('User should be connected to their wallet to make this request');
});

privateFetchClient.interceptors.response.use(
  (response) => response,
  // (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
  (error) => Promise.reject((error.response && error.response.data) || error),
);

class CancelManager {
  private requests = {};

  private static instance = null;

  private constructor() {
    logger('New Cancel manager');
  }

  static getInstance(): CancelManager {
    if (CancelManager.instance) return CancelManager.instance;
    CancelManager.instance = new CancelManager();
    return CancelManager.instance;
  }

  autoAbort(key) {
    if (this.requests[key]) {
      this.requests[`${key}_cancel`]('pre-cancel-request');
    }
    this.requests[key] = new axios.CancelToken((c) => {
      this.requests[`${key}_cancel`] = c;
    });
    return this.requests[key];
  }

  clear(key) {
    this.requests[key] = undefined;
    this.requests[`${key}_cancel`] = undefined;
  }
}

export default {
  baseFetchClient,
  publicFetchClient,
  privateFetchClient,
  cancelToken: CancelManager.getInstance(),
};
