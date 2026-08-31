import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  mainDialog: {
    width: 'clamp(200px, 500px, 100%)',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 8,
    gap: theme.spacing(2),
  },
  dialogContent: {
    padding: '16px 24px 8px 24px',
    '& > p': {
      textAlign: 'center',
    },
  },
  wrapper: {
    position: 'relative',
    minWidth: 150,
  },
  buttons: {
    borderRadius: '100px',
    maxWidth: '125px',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  cancelButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  reportButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
}));

interface IProps extends DialogProps {
  onClose: () => void;
}

const ReportDialog: React.FC<IProps> = ({ onClose, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  function onCloseDialog() {
    onClose();
  }

  return (
    <Dialog {...rest} onClose={onCloseDialog} maxWidth="sm" fullWidth>
      <form>
        <DialogTitle style={{ paddingRight: 4 }}>
          <Box display="flex" alignItems="center">
            <Box display="flex" justifyContent="center" flexGrow={1}>{`${t('REPORT TOKEN')}`}</Box>
            <Box>
              <IconButton onClick={onCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>{t('REPORT TOKEN')}</DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Grid className={classes.cancelButton} item xs={12} sm={6}>
            <Button className={classes.buttons} fullWidth variant="outlined" color="primary" size="large" type="submit">
              {t('CANCEL')}
            </Button>
          </Grid>
          <Grid className={classes.reportButton} item xs={12} sm={6}>
            <Button
              className={classes.buttons}
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              {t('REPORT')}
            </Button>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportDialog;
