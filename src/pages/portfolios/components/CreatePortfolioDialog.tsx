import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
import { createPortfolio } from 'src/slices/user/portfolios';

interface IProps {
  onClose: () => void;
}

export default function CreatePortfolioDialog(props: IProps) {
  const { onClose } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [value, setValue] = React.useState('');

  const handleClose = () => {
    onClose();
  };

  const handleCreate = async () => {
    const params = { name: value };

    await dispatch(createPortfolio(params));
    handleClose();
  };

  return (
    <Dialog open onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle id="form-dialog-title">{t('CREATE_PORTFOLIO.TITLE')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('CREATE_PORTFOLIO.DESCRIPTION')}</DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          id="name"
          label={t('CREATE_PORTFOLIO.INPUT_LABEL')}
          type="text"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.code === 'Enter') {
              handleCreate();
            }
          }}
        />
      </DialogContent>
      <DialogActions style={{ paddingRight: theme.spacing(3) }}>
        <Grid container>
          <Grid item display="flex" justifyContent="center" width="100%" gap={2}>
            <Button variant="outlined" onClick={handleClose} color="primary">
              {t('CANCEL')}
            </Button>
            <Button variant="contained" onClick={handleCreate} color="primary">
              {t('CREATE')}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
