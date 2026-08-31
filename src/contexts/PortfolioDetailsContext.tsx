import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';

export interface IPortoflioDetailsContext {
  account: string;
  portfolioId: string;
  updateCurrentPortfolio: React.Dispatch<React.SetStateAction<string>>;
}

export const PortfolioDetailsContext = React.createContext<IPortoflioDetailsContext>({
  account: undefined,
  portfolioId: undefined,
  updateCurrentPortfolio: () => {},
});

interface IPortoflioDetailsContextProviderProps {
  account: string;
  currentPortfolio?: string;
}

export const PortfolioDetailsContextProvider: FunctionComponent<IPortoflioDetailsContextProviderProps> = ({
  children,
  account,
  currentPortfolio,
}) => {
  const { hashKey } = useParams();
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string>(hashKey || currentPortfolio);

  useEffect(() => {
    if (currentPortfolio) {
      setCurrentPortfolioId(currentPortfolio);
    }
  }, [currentPortfolio]);

  return (
    <PortfolioDetailsContext.Provider
      value={{ account, portfolioId: currentPortfolioId, updateCurrentPortfolio: setCurrentPortfolioId }}
    >
      {children}
    </PortfolioDetailsContext.Provider>
  );
};
