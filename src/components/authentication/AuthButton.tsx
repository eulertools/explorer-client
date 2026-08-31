import { useTranslation } from 'react-i18next';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useModal } from 'src/components/modal';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import useAuth from 'src/hooks/useAuth';
import gtm from 'src/lib/gtm';
import { UserAvatar } from 'src/ui/UserAvatar';

interface AuthButtonProps {
  label?: string;
  variant?: 'contained' | 'text';
  fullWidth?: boolean;
  buttonAvatar?: boolean;
  buttonProps?: ButtonProps;
}

const AuthButton = (props: AuthButtonProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const { showModal } = useModal();
  const { label, variant, fullWidth = false, buttonAvatar = false, buttonProps = null } = props;
  const { t } = useTranslation();
  function onLoginButtonClick() {
    gtm.push({ event: 'user_login_register_start', category: 'Login/Signup', action: 'User Login/Signup modal click' });

    const authModal = showModal(AuthDialog, {
      onClose: () => {
        authModal.hide();
      },
    });
  }
  if (isAuthenticated) return <UserAvatar buttonAvatar={buttonAvatar} />;
  return (
    <Button {...buttonProps} fullWidth={fullWidth} variant={variant || 'text'} onClick={onLoginButtonClick}>
      {label || t('LOGIN/REGISTER')}
    </Button>
  );
};

export default AuthButton;
