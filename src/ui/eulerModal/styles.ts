import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      marginRight: '60px',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    closeButton: {
      position: 'absolute',
      top: '16px',
      right: '18px',
      width: '24px !important',
      height: '24px !important',
    },
    miniCloseButton: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      width: '24px !important',
      height: '24px !important',
    },
    dialogActions: {
      paddingBottom: '16px',
    },
    dialogContent: {
      padding: '12px 24px',
      fontFamily: theme.typography.fontFamily,
    },
  }),
);
