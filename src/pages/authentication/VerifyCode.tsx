import type { FC } from 'react';
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
import { VerifyCodeAmplify } from 'src/components/authentication/verify';
import { useAuthenticationStyles } from 'src/pages/authentication/AuthenticationStyles';
import { PageTitle } from 'src/ui/PageTitle';

const VerifyCode: FC = () => {
  const classes = useAuthenticationStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.root}>
      <PageTitle pageTitle="Verify Code" />
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
                <Typography color="textPrimary" gutterBottom variant="h4">
                  {t('AUTHENTICATION.VERIFY')}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {t('AUTHENTICATION.CONFIRM_REGISTRATION')}
                </Typography>
              </div>
            </Box>
            <Box flexGrow={1} mt={1}>
              <VerifyCodeAmplify />
            </Box>
            <Divider className={classes.divider} />
            <Link color="textSecondary" component={RouterLink} to="/authentication/password-recovery" variant="body2">
              {t('AUTHENTICATION.FAILED_CODE_SEND')}
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VerifyCode;
