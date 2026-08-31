import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useAuthenticationStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    container: {
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(4),
    },
    titleNoWrap: {
      whiteSpace: 'nowrap',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'normal',
      },
    },
    divider: {
      width: '65%',
      margin: theme.spacing(5, 'auto'),
    },
    dividerLabel: {
      border: `1px solid ${theme.palette.divider}`,
      position: 'absolute',
      padding: theme.spacing(1),
      borderRadius: '50%',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'auto',
      background: theme.palette.background.paper,
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
    },
  }),
);
