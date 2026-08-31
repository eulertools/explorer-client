import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import ChoosePortfolio from 'src/components/modal/dialogs/ChoosePortfolio';
import useModal from 'src/components/modal/useModal';
import useAuth from 'src/hooks/useAuth';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';

export interface ButtonPortfolioProps {
  item: IPortfolioDetailsItem;
}

export const ButtonPortfolio = ({ item }: ButtonPortfolioProps) => {
  const { showModal } = useModal();
  const { isAuthenticated } = useAuth();
  return (
    <Tooltip title="Portfolio">
      <IconButton
        aria-label="Add to Portfolio"
        onClick={(ev) => {
          ev.stopPropagation();

          // Don't do anything if we are not logged in
          if (!isAuthenticated) {
            const authModal = showModal(AuthDialog, {
              onClose: () => {
                authModal.hide();
              },
            });
            return;
          }

          // Prompt user to create/select portfolio
          const chooseModal = showModal(ChoosePortfolio, {
            onCancel: () => {
              chooseModal.hide();
            },
            item,
          });
        }}
      >
        <AssignmentReturnedIcon />
      </IconButton>
    </Tooltip>
  );
};
