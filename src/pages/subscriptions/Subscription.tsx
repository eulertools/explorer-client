import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CollapseAlert from 'src/components/home/CollapseAlert';
import { selectAccount } from 'src/selectors/account';
import { selectSubscriptionModalErrorSettings, selectSubscriptionModalSettings } from 'src/selectors/subscriptionModal';
import { useSelector } from 'src/store';
import Disclaimer from 'src/ui/Disclaimer';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { SubscriptionCards } from './components/Cards';

const Subscriptions: FC = () => {
  const settings = useSelector(selectSubscriptionModalSettings);
  const error = useSelector(selectSubscriptionModalErrorSettings);
  const account = useSelector(selectAccount);

  return (
    <>
      <Grid container>
        <Grid item display="flex" xs={12} justifyContent="center">
          <Typography variant="h5" color="textPrimary" mb={1}>
            It’s time to upgrade!
          </Typography>
        </Grid>
        <Grid item display="flex" xs={12} justifyContent="center">
          <Typography variant="subtitle1" color="textPrimary" mb={1}>
            You are currently on the{' '}
            <span style={{ fontWeight: 'bold' }}>{account?.subscription?.name || 'Free'} Plan</span>. Upgrade, downgrade
            or cancel at any time.
          </Typography>
        </Grid>
      </Grid>
      {!error && !settings ? <EulerLoading /> : null}
      {error ? <EulerError error={error} /> : null}
      {settings ? <SubscriptionCards /> : null}
      <Box marginTop="2rem">
        <CollapseAlert title="Legal Disclaimer" description={<Disclaimer />} />
      </Box>
    </>
  );
};
export default Subscriptions;
