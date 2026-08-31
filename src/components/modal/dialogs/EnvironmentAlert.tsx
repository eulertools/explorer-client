import { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AnnouncementIcon from '@material-ui/icons/Announcement';

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    '& .MuiDialog-container .MuiDialog-paper': {
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      borderRadius: '20px',
    },
  },
  title: {
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
  contents: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    maxHeight: '120px',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '100%',
    },
  },
  bold: {
    fontWeight: 'bold',
  },
  alertIcon: {
    color: '#E74C3C',
  },
  box: {
    padding: theme.spacing(1),
  },
  button: {
    textTransform: 'uppercase',
    borderRadius: '20px',
  },
  mainGrid: {
    padding: '8px 24px',
  },
  gridStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: '0 !important',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: '16px',
    },
  },
  gridEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '0 !important',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: '16px',
    },
  },
}));

const EnvironmentAlert: FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => setOpen(false);

  return (
    <Dialog className={classes.dialog} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className={classes.title}>Environment</DialogTitle>
      <Divider />
      <DialogContent className={classes.contents}>
        <AnnouncementIcon className={classes.alertIcon} />
        <Typography variant="subtitle2">
          You are entering into a <span className={classes.bold}>non-production environment</span>.<br />
          Some features may be unstable.
        </Typography>
      </DialogContent>
      <DialogActions className={classes.mainGrid}>
        <Grid container spacing={2}>
          <Grid className={classes.gridEnd} item xs={12} sm={6}>
            <Box className={classes.box}>
              <Button className={classes.button} variant="outlined" onClick={handleClose}>
                Continue in Test Environment
              </Button>
            </Box>
          </Grid>
          <Grid className={classes.gridStart} item xs={12} sm={6}>
            <Box className={classes.box}>
              <Button className={classes.button} color="primary" variant="contained" href="https://euler.tools">
                Go to Euler.tools
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EnvironmentAlert;
