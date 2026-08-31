import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { deletePortfolio, editPortfolio } from 'src/slices/user/portfolios';
import { useDispatch } from 'src/store';
import { loggerError } from 'src/utils/logger';

enum EMenuOptions {
  RENAME_PORTFOLIO = 'RENAME_PORTFOLIO',
  DELETE_PORTFOLIO = 'DELETE_PORTFOLIO',
}

const options = [
  {
    id: EMenuOptions.RENAME_PORTFOLIO,
    label: 'Rename Portfolio',
    icon: EditIcon,
  },
  {
    id: EMenuOptions.DELETE_PORTFOLIO,
    label: 'Delete Portfolio',
    icon: DeleteIcon,
  },
];

interface IPortfolioSettingsMenuProps {
  portfolioName: string;
  portfolioId: string;
}

export default function PortfolioSettingsMenu({ portfolioName, portfolioId }: IPortfolioSettingsMenuProps) {
  const { t } = useTranslation();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<EMenuOptions | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState<string>(portfolioName);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeletePortfolioDialog = () => {
    setConfirmationDialogOpen(EMenuOptions.DELETE_PORTFOLIO);
  };

  const openRenamePortfolioDialog = () => {
    setNewPortfolioName(portfolioName);
    setConfirmationDialogOpen(EMenuOptions.RENAME_PORTFOLIO);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(null);
    setIsProcessing(false);
  };

  const handleDeleteButton = async () => {
    try {
      setIsProcessing(true);
      await dispatch(deletePortfolio({ identifier: portfolioId }));
    } catch (e) {
      loggerError('Error removing portfolio', e);
    }
  };

  const handleRenameButton = async () => {
    try {
      setIsProcessing(true);
      await dispatch(editPortfolio(portfolioId, { name: newPortfolioName }));

      closeConfirmationDialog();
    } catch (e) {
      loggerError('Error editing portfolio', e);
    }
  };

  return (
    <>
      <div>
        <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          keepMounted
          id="settings-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.id}
              onClick={
                option.id === EMenuOptions.DELETE_PORTFOLIO ? openDeletePortfolioDialog : openRenamePortfolioDialog
              }
            >
              <option.icon style={{ paddingRight: 8 }} />
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
      {/* Delete Portfolio dialog */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={confirmationDialogOpen === EMenuOptions.DELETE_PORTFOLIO}
        onClose={closeConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="delete-dialog-description" color="textPrimary">
            {t('PORTFOLIOS.REMOVE_PORTFOLIO_WARNING')}: {portfolioName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item display="flex" justifyContent="center" width="100%" gap={2}>
              <Button variant="outlined" onClick={closeConfirmationDialog} color="primary" autoFocus>
                {t('NO')}
              </Button>
              <Button variant="contained" disabled={isProcessing} onClick={handleDeleteButton} color="secondary">
                {t('YES')}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* Rename Portfolio dialog */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={confirmationDialogOpen === EMenuOptions.RENAME_PORTFOLIO}
        onClose={closeConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="rename-dialog-description" color="textPrimary">
            {t('PORTFOLIOS.RENAME_PORTFOLIO')}:
          </DialogContentText>
          <TextField
            fullWidth
            margin="dense"
            type="text"
            label="New Portfolio Name"
            variant="outlined"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item display="flex" justifyContent="center" width="100%" gap={2}>
              <Button variant="outlined" onClick={closeConfirmationDialog} color="primary" autoFocus>
                {t('CANCEL')}
              </Button>
              <Button variant="contained" disabled={isProcessing} onClick={handleRenameButton} color="primary">
                {t('RENAME')}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
