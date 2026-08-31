import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import { PageTitle } from 'src/ui/PageTitle';

const DelayedRegistering: FC = () => {
  const { t } = useTranslation();
  const classes = useAuthenticationStyles();

  return (
    <Box className={classes.root}>
      <PageTitle pageTitle="Register" />
      <Container maxWidth="sm" className={classes.container}>
        <Box display="flex" justifyContent="center">
          <RouterLink to="/">
            <Logo format="eulertools-navbar-logo" />
          </RouterLink>
        </Box>
        <Box display="flex" justifyContent="center" mb={8} />
        <Typography color="textPrimary" variant="h1" textAlign="center" paddingBottom={4}>
          {t('AUTHENTICATION.REGISTRATION_SUCCESS')}
        </Typography>
        <Typography color="textPrimary" variant="body2" fontSize={16}>
          {t('AUTHENTICATION.REGISTRATION_SUCCESS_MESSAGE')}
        </Typography>
      </Container>
    </Box>
  );
};

export default DelayedRegistering;
