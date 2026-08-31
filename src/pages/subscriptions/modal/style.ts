import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    stepBox: {
      minWidth: 644,
      padding: '2rem',
    },
    billingBox: {
      position: 'relative',
      width: 262,
      height: 157,
      borderRadius: '12%',
      padding: '1rem',
      textAlign: 'center',
      color:
        theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.getContrastText('#FFFFFF'),
      cursor: 'pointer',
      transition: 'all 400ms ease',
      '&.checked': {
        background: '#F0F4FF',
        color: '#42526E',
        border: `solid 1px ${theme.palette.primary.main}`,
      },
      '&:hover': {
        transform: 'translate(0, -1.5%)',
      },
    },
    checkIcon: {
      position: 'absolute',
      top: '-13px',
      right: '3%',
      color: theme.palette.primary.main,
      width: '20px',
      height: '20px',
    },
    bgIcon: {
      position: 'absolute',
      top: '-13px',
      right: '3%',
      marginRight: 3,
      marginTop: 3,
      height: 14,
      width: 14,
      background: 'white',
      borderRadius: '50%',
    },
  }),
);
