import PropTypes from 'prop-types';
import { FC, ReactNode, createContext, useEffect, useState, useContext } from 'react';
import {
  defaultBNBData,
  defaultCoinData,
  defaultPoolData,
  defaultPoolDataBUSD,
  defaultTokenPriceData,
  defaultBTCData,
  defaultWETHData,
} from 'src/slices/coindata';
import { useSelector } from 'src/store';
import ConfigurationContext from './ConfigurationContext';

interface CoinDataModel {
  mainValue: number;
  change: number;
  lastDayChange: number;
  lastDayChangeValue: number;
  lastDayVolume: number;
  indexPrice: number;
  fundingPrice: number;
  markPrice: number;
  lastPrice: number;
  token: string;
  tokenLink: string;
}

export interface PoolDataModel {
  eulerBalance: number;
  bnbBalance: number;
  LPBalance: number;
}

export interface PoolDataBUSDModel {
  eulerBalance: number;
  busdBalance: number;
  LPBalance: number;
  price: number;
}

export interface BnbUSDModel {
  price: number;
}

interface TokenPriceModel {
  [key: string]: {
    price: number;
    symbol: string;
  };
}

interface BTCUSDModel {
  price: number;
}

interface WETHModel {
  price: number;
}

export interface CoinDataContextValue {
  coinData: CoinDataModel;
  bnbData: BnbUSDModel;
  poolDatav2: PoolDataModel;
  poolDataBUSD: PoolDataBUSDModel;
  tokenPriceData: TokenPriceModel;
  btcPriceData: BTCUSDModel;
  wethPriceData: WETHModel;
}

interface CoinDataProviderProps {
  children?: ReactNode;
}

const CoinDataContext = createContext<CoinDataContextValue>({
  coinData: null,
  bnbData: null,
  poolDatav2: null,
  poolDataBUSD: null,
  tokenPriceData: {},
  btcPriceData: null,
  wethPriceData: null,
});

export const CoinDataProvider: FC<CoinDataProviderProps> = (props) => {
  const { children } = props;
  const { chain } = useContext(ConfigurationContext);
  const [coinData, setCoinData] = useState<CoinDataModel>({
    ...defaultCoinData,
    token: chain.bsc.tokens.euler.address,
  });
  const [poolDatav2, setPoolDatav2] = useState<PoolDataModel>(defaultPoolData);
  const [poolDataBUSD, setPoolDataBUSD] = useState<PoolDataBUSDModel>(defaultPoolDataBUSD);
  const [bnbData, setBNBData] = useState<BnbUSDModel>(defaultBNBData);
  const [tokenPriceData, setTokenPriceData] = useState<TokenPriceModel>(defaultTokenPriceData);
  const [btcPriceData, setBTCPriceData] = useState<BTCUSDModel>(defaultBTCData);
  const [wethPriceData, setWETHPriceData] = useState<WETHModel>(defaultWETHData);
  const {
    coinData: coinDataStore,
    poolDatav2: poolDatav2Store,
    poolDataBUSD: poolDataBUSDStore,
    bnbData: bnbDataStore,
    tokenPriceData: tokenPriceDataStore,
    btcData: btcDataStore,
    wethData: wethDataStore,
  } = useSelector((state) => state.coindata);

  useEffect(() => setCoinData({ ...coinDataStore, token: chain.bsc.tokens.euler.address }), [coinDataStore]);
  useEffect(() => setPoolDatav2(poolDatav2Store), [poolDatav2Store]);
  useEffect(() => setPoolDataBUSD(poolDataBUSDStore), [poolDataBUSDStore]);
  useEffect(() => setBNBData(bnbDataStore), [bnbDataStore]);
  useEffect(() => setTokenPriceData(tokenPriceDataStore), [tokenPriceDataStore]);
  useEffect(() => setBTCPriceData(btcDataStore), [btcDataStore]);
  useEffect(() => setWETHPriceData(wethDataStore), [wethDataStore]);

  return (
    <CoinDataContext.Provider
      value={{
        bnbData,
        coinData,
        poolDatav2,
        poolDataBUSD,
        tokenPriceData,
        btcPriceData,
        wethPriceData,
      }}
    >
      {children}
    </CoinDataContext.Provider>
  );
};

CoinDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CoinDataConsumer = CoinDataContext.Consumer;

export default CoinDataContext;
