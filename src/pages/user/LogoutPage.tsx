import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import { AppSkeleton } from 'src/components/templates';
import useAuth from 'src/hooks/useAuth';
import { EulerLoading } from 'src/ui/EulerLoading';
import { PageTitle } from 'src/ui/PageTitle';
import { loggerException } from 'src/utils/logger';

const LogoutPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    try {
      setTimeout(() => {
        logout();
        navigate('/');
      }, 800);
    } catch (error) {
      loggerException(error);
      setTimeout(() => navigate('/'), 800);
    }
  }, []);

  return (
    <AppSkeleton>
      <Box>
        <PageTitle pageTitle="User" title={t('Closing session')} />
        <Box display="grid" minHeight="400px">
          <EulerLoading />
        </Box>
      </Box>
    </AppSkeleton>
  );
};

export default LogoutPage;
