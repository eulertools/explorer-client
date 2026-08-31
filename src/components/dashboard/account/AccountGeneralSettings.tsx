import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import AccountSecuritySettings from 'src/components/dashboard/account/AccountSecuritySettings';
import AccountSummarySettings from 'src/components/dashboard/account/AccountSummarySettings';
import UserAccountSettings from 'src/components/dashboard/account/UserAccountSettings';
import useAuth from 'src/hooks/useAuth';

const AccountGeneralSettings: FC = (props) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Grid container alignItems="center" justifyContent="center" display="flex" minHeight="50vh">
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Grid container spacing={2} {...props}>
      <Grid item xs={12} md={3}>
        <AccountSummarySettings />
      </Grid>
      <Grid item xs={12} md={5}>
        <UserAccountSettings />
      </Grid>
      <Grid item xs={12} md={4}>
        <AccountSecuritySettings />
      </Grid>
    </Grid>
  );
};

export default AccountGeneralSettings;
