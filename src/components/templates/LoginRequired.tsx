import { ReactChild, FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@material-ui/core';
import { SxProps, useTheme } from '@material-ui/system';
import { useModal } from 'src/components/modal';
import useAuth from 'src/hooks/useAuth';
import { NavInfo } from 'src/pages/nftcreate/components/NavInfo';
import { EulerLoading } from 'src/ui/EulerLoading';
import AuthButton from '../authentication/AuthButton';
import AuthDialog from '../modal/dialogs/AuthDialog';
import { AppSkeleton } from './AppSkeleton';

interface PageLoginRequiredProps {
  sections: string[];
  sx?: SxProps;
  children: ReactChild[];
}

/**
 * Use this primary component to place pages with login required.
 * @param sections Array of strings wich contains the navigation info.
 * @param sx The style of the Box main container.
 *
 */
const LoginRequired: FC<PageLoginRequiredProps> = (props: PageLoginRequiredProps) => {
  const user = useAuth();
  const { t } = useTranslation();
  const { showModal } = useModal();
  const theme = useTheme();

  useEffect(() => {
    function onShowModal() {
      const authModal = showModal(AuthDialog, {
        onClose: () => {
          authModal.hide();
        },
      });
    }
    if (user.isInitialized && !user.isAuthenticated) {
      onShowModal();
    }
  }, [user]);

  return (
    <AppSkeleton>
      <NavInfo sections={props.sections} />
      {!user.isInitialized ? (
        <EulerLoading />
      ) : (
        <Box sx={props.sx}>
          {user.isAuthenticated ? (
            <>{props.children}</>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
              height="60vh"
            >
              <Typography variant="subtitle1" color={theme.palette.text.primary} textAlign="center">
                {t('You have to be logged in to see this section')}
              </Typography>
              <AuthButton variant="contained" />
            </Box>
          )}
        </Box>
      )}
    </AppSkeleton>
  );
};

export default LoginRequired;
