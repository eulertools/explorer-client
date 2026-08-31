import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { ITopLevelFarm } from 'src/types/yield';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface IProps {
  farm: ITopLevelFarm;
}

const FarmDetails = ({ farm }: IProps) => {
  const { t } = useTranslation();
  const { deposit, rewards, farm: farmDetails } = farm;

  return (
    <Card raised>
      <CardContent>
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <Box textAlign="right">
            <Typography variant="h5">{farmDetails.name}</Typography>
            {farmDetails.yield?.apy ? (
              <Typography variant="caption">{getBigNumberCurrencyLabel(farmDetails.yield.apy)}% APY</Typography>
            ) : null}
          </Box>
          <Box textAlign="right">
            <Typography variant="h6">{getBigNumberCurrencyLabel(deposit?.usd)} BUSD</Typography>
            <Typography variant="caption">{getBigNumberCurrencyLabel(deposit?.amount)}</Typography>
            <Typography variant="caption" fontSize={11} display="block">
              <i>{t('Staking Units')}</i>
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" />
        {rewards?.length ? (
          <>
            <Typography variant="subtitle1" marginTop={2}>
              <i>{t('Rewards')}:</i>
            </Typography>
            <Box display="flex">
              {rewards.map((r) => (
                <Box key={r.symbol} textAlign="right" marginTop={1}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {getBigNumberCurrencyLabel(r.amount)} {r.symbol.toUpperCase()}
                  </Typography>
                  <Typography variant="caption">{getBigNumberCurrencyLabel(r.usd)} BUSD</Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default FarmDetails;
