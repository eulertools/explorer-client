import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { LoginAmplify } from 'src/components/authentication/login';
import ConnectYourWallet from 'src/components/modal/dialogs/ConnectYourWallet';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import { PageTitle } from 'src/ui/PageTitle';

const Login: FC = () => {
  const classes = useAuthenticationStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const [showWalletConnect, setShowWalletConnect] = useState<boolean>(false);

  useEffect(() => {
    if (account) {
      setShowWalletConnect(false);
    }
  }, [account]);

  function onWalletConnect() {
    setShowWalletConnect(true);
  }

  function onHideWalletConnect() {
    setShowWalletConnect(false);
  }

  function onRegisterClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.preventDefault();
    navigate('/authentication/register');
  }

  function onForgotPasswordClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
    event.preventDefault();
    navigate('/authentication/password-recovery');
  }

  function onLoginSuccess() {
    navigate('/');
  }

  return (
    <>
      <Box className={classes.root}>
        <PageTitle pageTitle="Login" />
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
                    {t('AUTHENTICATION.LOG_IN')}
                  </Typography>
                </div>
              </Box>
              <Box flexGrow={1} mt={1}>
                <LoginAmplify
                  onForgotPasswordClick={onForgotPasswordClick}
                  onRegisterClick={onRegisterClick}
                  onLoginSuccess={onLoginSuccess}
                  onWalletConnect={onWalletConnect}
                />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      {showWalletConnect ? <ConnectYourWallet open onCancel={onHideWalletConnect} /> : null}
    </>
  );
};

export default Login;
