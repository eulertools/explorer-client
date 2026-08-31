import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeButtonGroup } from 'src/components/dashboard/settings/ThemeButtonGroup';

const useStyles = makeStyles(() => ({
  themeToggle: {
    '& > button': {
      '& .MuiToggleButton-label': {
        minWidth: '100px',
      },
    },
  },
}));

const AccountThemeSettings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const mobileScreen = useMediaQuery(theme.breakpoints.down(475));

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={t('Theme')} />
      <Divider />
      <CardContent>
        <Grid display="flex" justifyContent="center">
          <ThemeButtonGroup className={classes.themeToggle} breakpoint={475} fullWidth={mobileScreen} />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountThemeSettings;
