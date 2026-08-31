import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { PageTitle } from 'src/ui/PageTitle';

const ServerError: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      alignItems="center"
      px={3}
      py="80px"
      minHeight="100%"
      sx={{ backgroundColor: 'background.paper' }}
    >
      <PageTitle pageTitle="Error: Server Error" />
      <Container maxWidth="lg">
        <Typography align="center" color="textPrimary" variant={mobileDevice ? 'h4' : 'h1'}>
          {t('ERRORS.500')}
        </Typography>
        <Typography align="center" color="textSecondary" sx={{ mt: 0.5 }} variant="subtitle2">
          {t('ERRORS.404_MESSAGE')}
        </Typography>
        <Box display="flex" justifyContent="center" mt={6}>
          <Box
            alt="Under development"
            component="img"
            src={`/static/error/error500_${theme.palette.mode}.svg`}
            sx={{
              height: 'auto',
              maxWidth: '100%',
              width: 400,
            }}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={6}>
          <Button color="primary" component={RouterLink} to="/" variant="outlined">
            {t('Back to Home')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ServerError;
