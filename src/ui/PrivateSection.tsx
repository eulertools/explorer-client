import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@material-ui/core';
import Logo from 'src/components/Logo';
import AuthButton from 'src/components/authentication/AuthButton';
import useAuth from 'src/hooks/useAuth';

interface PrivateSectionProps {
  children: React.ReactChild;
}
export const PrivateSection = (props: PrivateSectionProps) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <>
        <Box display="grid" justifyContent="center" p={2}>
          <Logo format="eulertools-navbar-logo" />
        </Box>
        <Typography justifyContent="center" alignItems="center" display="flex" fontWeight={600} color="textPrimary">
          {t('Please login to continue')}
        </Typography>
        <Box display="grid" justifyContent="center" pt={2}>
          <AuthButton label={t('Login')} variant="contained" />
        </Box>
      </>
    );
  }

  return <>{props.children}</>;
};
