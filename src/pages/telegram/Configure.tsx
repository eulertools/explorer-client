import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import TelegramLogo from 'src/assets/icons/Telegram.svg';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import useQuery from 'src/hooks/useQuery';
import { PageTitle } from 'src/ui/PageTitle';
import { PrivateSection } from 'src/ui/PrivateSection';
import { loggerError } from 'src/utils/logger';
import { useConfigureTelegramStyles } from './Configure.styles';

export default function ConfigureTelegram(): JSX.Element {
  const { t } = useTranslation();
  const classes = useConfigureTelegramStyles();
  const query = useQuery();
  const { user, updateAccount, isInitialized } = useAuth();
  const navigate = useNavigate();

  const [connecting, setConnecting] = useState<boolean>(false);

  const userId = query.get('user_id');

  async function onConnectUserToTelegram() {
    setConnecting(true);

    try {
      await updateAccount({ 'custom:telegram_user_id': userId });

      navigate('/user/account-settings');
    } catch (error) {
      loggerError(error);
      setConnecting(false);
    }
  }

  if (!isInitialized) {
    return null;
  }

  // If user has already configured his/her/they Telegram account go back to settings
  if (user?.telegram_user_id) {
    return <Navigate to="/user/account-settings" />;
  }

  return (
    <Box className={classes.container}>
      <PageTitle pageTitle="Configure Telegram" />
      <PrivateSection>
        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center" mb={8} mt={12}>
            <RouterLink to="/">
              <Logo format="eulertools-navbar-logo" />
            </RouterLink>
          </Box>
          <Card>
            <CardContent>
              <Box padding={4} display="flex" flexDirection="column">
                <Typography color="textPrimary" fontWeight={700}>
                  {t('TELEGRAM.USER_CONNECT')}
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                  <Logo format="logo" />
                  <Box marginX={2}>
                    <SyncAltIcon fontSize="large" />
                  </Box>
                  <img width={40} height={40} src={TelegramLogo} alt="telegram" />
                </Box>
                <Box marginTop={2} display="flex" alignItems="center" justifyContent="center">
                  <Typography color="textPrimary" paddingLeft={1}>
                    {t('TELEGRAM.USER_LABEL')} <b>{userId}</b>
                  </Typography>
                </Box>
                <Box maxWidth={200} marginTop={4} marginX="auto">
                  <Button
                    fullWidth
                    disabled={connecting}
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={onConnectUserToTelegram}
                  >
                    {t('Connect')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </PrivateSection>
    </Box>
  );
}
