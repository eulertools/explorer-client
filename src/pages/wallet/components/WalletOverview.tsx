import { useMemo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { WalletsFormModal } from 'src/pages/wallet/components/WalletsFormModal';
import { WalletItem } from 'src/slices/user/wallet';
import DashboardCard from 'src/ui/DashboardCard';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { currencyformatter } from 'src/utils/currencyHelpers';

interface WalletOverviewProps {
  wallet: WalletItem;
  balance: number;
  bnbValue: number;
  editWalletIcon?: boolean;
  lockButton?: ReactNode;
}
export const WalletOverview = ({
  balance,
  bnbValue,
  wallet,
  editWalletIcon = true,
  lockButton,
}: WalletOverviewProps) => {
  const { t } = useTranslation();
  const pureContent = useMemo(
    () => (
      <>
        <DashboardCard
          title={wallet.name.toUpperCase()}
          actionLogo={editWalletIcon ? <WalletsFormModal currentWallet={wallet} /> : null}
        >
          <Box mt={2} mb={1} display="flex" alignItems="center" justifyContent="center">
            <EulerAddress
              address={wallet.address}
              addressRender={EulerAddressRenderTypes.truncate_right}
              showSeeDetailLink={false}
            />
          </Box>
        </DashboardCard>
        <DashboardCard title={t('BALANCE')}>
          <Box mt={1} mb={1} display="flex" alignItems="center" justifyContent="center">
            <Typography marginLeft={1} color="textPrimary" fontSize="30px">
              {balance ? `USD $${currencyformatter.format(balance)}` : '--'}
            </Typography>
          </Box>
        </DashboardCard>
        <DashboardCard title={t('BNB BALANCE')} actionLogo={lockButton || null}>
          <Box mt={1} mb={1} display="flex" alignItems="center" justifyContent="center">
            <Typography marginLeft={1} color="textPrimary" fontSize="30px">
              {balance ? `${currencyformatter.format(bnbValue)} BNB` : '--'}
            </Typography>
          </Box>
        </DashboardCard>
      </>
    ),
    [wallet, balance, bnbValue],
  );
  return (
    <>
      <Hidden mdUp>
        <Box display="grid" gridTemplateRows="auto auto auto" rowGap={2} columnGap={2} pb={2} pt={2}>
          {pureContent}
        </Box>
      </Hidden>
      <Hidden mdDown>
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" columnGap={2} pb={2} pt={2}>
          {pureContent}
        </Box>
      </Hidden>
    </>
  );
};
