import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import { PrivateSection } from 'src/ui/PrivateSection';
import { logger } from 'src/utils/logger';
import { WalletsFacade } from './WalletsFacade';

export default function Wallets(): JSX.Element {
  logger('wallets loaded');
  return (
    <CoinDataProvider>
      <AppSkeleton>
        <PrivateSection>
          <WalletsFacade />
        </PrivateSection>
      </AppSkeleton>
    </CoinDataProvider>
  );
}
