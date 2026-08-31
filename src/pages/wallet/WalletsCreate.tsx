import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { PortfolioCreateIcon } from 'src/icons/PortfolioCreate';
import { WalletsFormModal } from 'src/pages/wallet/components/WalletsFormModal';
import { logger } from 'src/utils/logger';

export function WalletCreate(): JSX.Element {
  const { t } = useTranslation();
  logger('WalletCreate loaded');
  return (
    <Box display="grid" justifyContent="center" alignItems="center" minHeight="600px" height="100%">
      <Box>
        <PortfolioCreateIcon />
        <Box display="grid" justifyContent="center">
          <Typography color="textPrimary" fontWeight={600}>
            {t('WALLETS.NO_WALLET')}
          </Typography>
          <Box display="grid" justifyContent="center" pt={3}>
            <WalletsFormModal />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
