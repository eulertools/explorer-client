import { useEffect, useState, FC } from 'react';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import useQuery from 'src/hooks/useQuery';
import axios from 'src/lib/axios';
import { TokenDetailDTO } from 'src/types/token';
import { EulerLoading } from 'src/ui/EulerLoading';
import { PageTitle } from 'src/ui/PageTitle';
import SwapperContainer from './components/Container';
import { baseTokenList } from './constants';
import { SwapperContextProvider } from './context';
import { ISwapToken } from './types';

interface ISwapperWrapperProps {
  showPageTitle?: boolean;
}

const SwapperWrapper: FC<ISwapperWrapperProps> = ({ showPageTitle = true }) => {
  const queryParams = useQuery();

  const from = queryParams.get('from');
  const to = queryParams.get('to');

  const [showLoading, setShowLoading] = useState<boolean>(!!(from || to));
  const [fromToken, setFromToken] = useState<ISwapToken>(null);
  const [toToken, setToToken] = useState<ISwapToken>(null);

  useEffect(() => {
    async function fetchTokenInformation() {
      const promises = [
        from ? axios.publicFetchClient.get<TokenDetailDTO>(`/tokens/${from}?fields[]=price_usd,name,symbol`) : null,
        to ? axios.publicFetchClient.get<TokenDetailDTO>(`/tokens/${to}?fields[]=price_usd,name,symbol`) : null,
      ];

      const [fromTokenInfoResponse, toTokenInfoResponse] = await Promise.allSettled(promises);

      if (fromTokenInfoResponse?.status === 'fulfilled' && fromTokenInfoResponse.value) {
        setFromToken({
          address: from,
          name: fromTokenInfoResponse.value.data._source.name,
          symbol: fromTokenInfoResponse.value.data._source.symbol,
        });
      }

      if (toTokenInfoResponse?.status === 'fulfilled' && toTokenInfoResponse.value) {
        setToToken({
          address: to,
          name: toTokenInfoResponse.value.data._source.name,
          symbol: toTokenInfoResponse.value.data._source.symbol,
        });
      }

      setShowLoading(false);
    }
    if (from || to) {
      fetchTokenInformation();
    }
  }, [from, to]);

  if (showLoading) {
    return <EulerLoading />;
  }

  return (
    <AppSkeleton noPadding>
      {showPageTitle ? <PageTitle pageTitle="Swap" /> : null}
      {/* Default from BNB to $EULER */}
      <SwapperContextProvider baseToken={fromToken || baseTokenList[3]} quoteToken={toToken || baseTokenList[0]}>
        <CoinDataProvider>
          <SwapperContainer />
        </CoinDataProvider>
      </SwapperContextProvider>
    </AppSkeleton>
  );
};

export default SwapperWrapper;
