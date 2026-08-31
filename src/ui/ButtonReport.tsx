import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import ReportDialog from 'src/components/modal/dialogs/Report';
import useModal from 'src/components/modal/useModal';
import useAuth from 'src/hooks/useAuth';
import ReportIcon from 'src/icons/svg-icons/ReportIcon';

export const ButtonReport = () => {
  const { showModal } = useModal();
  const { isAuthenticated } = useAuth();
  return (
    <Tooltip title="Report">
      <IconButton
        aria-label="Report"
        onClick={(ev) => {
          ev.stopPropagation();

          // Don't do anything if we are not logged in
          if (!isAuthenticated) {
            const authModal = showModal(AuthDialog, {
              onClose: () => {
                authModal.hide();
              },
            });
          }
          // Open Report Modal : Work In Progress
          const chooseModal = showModal(ReportDialog, { onClose: () => chooseModal.hide() });
        }}
      >
        <ReportIcon />
      </IconButton>
    </Tooltip>
  );
};
