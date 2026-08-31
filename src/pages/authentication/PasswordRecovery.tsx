import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { PasswordRecoveryAmplify } from 'src/components/authentication/password-recovery';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import { PageTitle } from 'src/ui/PageTitle';

const PasswordRecovery: FC = () => {
  const classes = useAuthenticationStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.root}>
      <PageTitle pageTitle="Password Recovery" />
      <Container maxWidth="sm" className={classes.container}>
        <Box display="flex" justifyContent="center">
          <RouterLink to="/">
            <Logo format="eulertools-navbar-logo" />
          </RouterLink>
        </Box>
        <Box display="flex" justifyContent="center" mb={8} />
        <Card>
          <CardContent className={classes.cardContent}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <div>
                <Typography className={classes.titleNoWrap} color="textPrimary" gutterBottom variant="h4">
                  {t('AUTHENTICATION.PASSWORD_RECOVERY')}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {t('AUTHENTICATION.PASSWORD_RECOVERY_MESSAGE')}
                </Typography>
              </div>
            </Box>
            <Box flexGrow={1} mt={1}>
              <PasswordRecoveryAmplify />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PasswordRecovery;
