import React, { FunctionComponent, useState } from 'react';
import { ILiquiditySourceProtocol } from '../components/Settings/types';
import { ISwapRoute, ISwapToken } from '../types';

interface ISwapSettings {
  excludedLiquiditySources: string[];
  liquiditySourcesList: ILiquiditySourceProtocol[];
  slippageTolerancePercentage: number;
  gasPrice: number;
  isCustomGasPrice: boolean;
  isCustomTxPercentage: boolean;
}

interface IRoutesInfo {
  toTokenAmount: number;
  protocols: ISwapRoute[];
}

export interface ISwapperContentContextProps {
  fromToken: ISwapToken;
  toToken: ISwapToken;
  updateFromToken: React.Dispatch<React.SetStateAction<ISwapToken>>;
  updateToToken: React.Dispatch<React.SetStateAction<ISwapToken>>;
  reloadCount: number;
  updateReloadCount: () => void;
  settings: ISwapSettings;
  updateSettings: (s: Partial<ISwapSettings>) => void;
  routeInfo: IRoutesInfo;
  updateRouteInfo: React.Dispatch<React.SetStateAction<IRoutesInfo>>;
}

export const SwapperContext = React.createContext<ISwapperContentContextProps>({
  fromToken: null,
  toToken: null,
  updateFromToken: () => {},
  updateToToken: () => {},
  reloadCount: 0,
  updateReloadCount: () => {},
  settings: {
    excludedLiquiditySources: [],
    liquiditySourcesList: [],
    slippageTolerancePercentage: 1.5,
    gasPrice: 6,
    isCustomGasPrice: false,
    isCustomTxPercentage: false,
  },
  updateSettings: () => {},
  routeInfo: { toTokenAmount: null, protocols: null },
  updateRouteInfo: () => {},
});

export const SwapperContextProvider: FunctionComponent<{ baseToken: ISwapToken; quoteToken: ISwapToken }> = ({
  children,
  baseToken,
  quoteToken,
}) => {
  const [fromToken, setFromToken] = useState<ISwapToken>(baseToken);
  const [toToken, setToToken] = useState<ISwapToken>(quoteToken);
  const [reloadCount, setReloadCount] = useState<number>(0);
  const [settings, setSettings] = useState<ISwapSettings>({
    excludedLiquiditySources: [],
    liquiditySourcesList: [],
    slippageTolerancePercentage: 1.5,
    gasPrice: 6,
    isCustomGasPrice: false,
    isCustomTxPercentage: false,
  });
  const [routeInfo, setRouteInfo] = useState<IRoutesInfo>({ toTokenAmount: null, protocols: null });

  function onUpdateSettings(s: Partial<ISwapSettings>) {
    setSettings((cur) => ({ ...cur, ...s }));
  }

  function updateReloadCount() {
    setReloadCount((cur) => cur + 1);
  }

  return (
    <SwapperContext.Provider
      value={{
        fromToken,
        updateFromToken: setFromToken,
        toToken,
        updateToToken: setToToken,
        reloadCount,
        updateReloadCount,
        settings,
        updateSettings: onUpdateSettings,
        routeInfo,
        updateRouteInfo: setRouteInfo,
      }}
    >
      {children}
    </SwapperContext.Provider>
  );
};
