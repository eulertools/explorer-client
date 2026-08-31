import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import { AccountGeneralSettings } from 'src/components/dashboard/account';
import { ThemeButtonGroup } from 'src/components/dashboard/settings/ThemeButtonGroup';
import { AppSkeleton } from 'src/components/templates';
import { PageTitle } from 'src/ui/PageTitle';

const useStyles = makeStyles(() => ({
  themeToggle: {
    '& > button': {
      maxHeight: '36.5px',
      '& .MuiToggleButton-label': {
        minWidth: '100px',
      },
    },
  },
  iconButton: {
    padding: '0 12px',
  },
}));

const Accounts = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <AppSkeleton>
      <Box display="flex" justifyContent="space-between">
        <PageTitle pageTitle="User" title={t('Account')} />
        <Grid display="flex" alignItems="start" gap={2}>
          <Hidden mdDown>
            <ThemeButtonGroup className={classes.themeToggle} />
          </Hidden>
        </Grid>
      </Box>
      <Grid container display="flex" spacing={2}>
        <Hidden mdUp>
          <Grid item xs={12}>
            <ThemeButtonGroup className={classes.themeToggle} breakpoint={475} fullWidth />
          </Grid>
        </Hidden>
        <Grid item xs={12}>
          <AccountGeneralSettings />
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

export default Accounts;
