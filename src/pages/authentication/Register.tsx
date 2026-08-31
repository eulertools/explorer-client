import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { RegisterAmplify } from 'src/components/authentication/register';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import { PageTitle } from 'src/ui/PageTitle';

const Register: FC = () => {
  const classes = useAuthenticationStyles();
  const { t } = useTranslation();
  const [showWalletConnect, setShowWalletConnect] = useState<boolean>(false);

  function onWalletConnect() {
    setShowWalletConnect(true);
  }

  function onHideWalletConnect() {
    setShowWalletConnect(false);
  }

  return (
    <>
      <Box className={classes.root}>
        <PageTitle pageTitle="Register" />
        <Container maxWidth="sm" className={classes.container}>
          <Box display="flex" justifyContent="center" mb={8}>
            <RouterLink to="/">
              <Logo format="eulertools-navbar-logo" />
            </RouterLink>
          </Box>
          <Card>
            <CardContent className={classes.cardContent}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    {t('AUTHENTICATION.REGISTER')}
                  </Typography>
                </div>
              </Box>
              <Box flexGrow={1} mt={1}>
                <RegisterAmplify onWalletConnect={onWalletConnect} />
              </Box>
              <Divider className={classes.divider} />
              <Link color="textSecondary" component={RouterLink} to="/authentication/login" variant="body2">
                {t('AUTHENTICATION.HAVE_ACCOUNT')}
              </Link>
            </CardContent>
          </Card>
        </Container>
      </Box>
      {showWalletConnect ? <ConnectYourWallet open onCancel={onHideWalletConnect} /> : null}
    </>
  );
};

export default Register;
