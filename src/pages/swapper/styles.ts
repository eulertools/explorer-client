import { makeStyles } from '@material-ui/core/styles';

export const swapperStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(4),
    minHeight: 400,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      borderRadius: 'unset',
    },
  },
  headerIconButton: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0),
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'none',
    },
  },
  fromContainer: {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    margin: theme.spacing(0),
  },
  tokenSelector: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '12px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.background.paper,
    width: '49%',
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },
  txFee: {
    position: 'absolute',
    top: '140px',
    left: '20px',
    '& .MuiTypography-root': {
      fontSize: '13px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '11px',
      },
    },
  },
  toContainer: {
    // Keep this for the sync icon
    position: 'relative',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(7, 0, 0),
    backgroundColor: theme.palette.background.default,
  },
  routeIcon: {
    color: theme.palette.text.secondary,
    fontSize: '20px',
  },
  pointer: {
    cursor: 'pointer',
  },
  colorOnHover: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  settingsTitle: {
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '22px',
    color: (theme as any).palette.terciary[700],
    textAlign: 'start',
  },
  customInput: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  tokenAmountInput: {
    '& .MuiInputBase-input': {
      backgroundColor: theme.palette.background.paper,
      textAlign: 'end',
      fontSize: '16px',
      lineHeight: '20px',
      height: '25px',
      borderRadius: '12px',
      fontWeight: 500,
      color: (theme as any).palette.neutral[900],
    },
    '& .MuiOutlinedInput-input.MuiInputBase-input.Mui-disabled': {
      backgroundColor: theme.palette.background.default,
      fontWeight: 500,
      color: (theme as any).palette.neutral[900],
      '-webkit-text-fill-color': (theme as any).palette.neutral[900],
    },
  },
  collapseBoxContainer: {
    borderRadius: '10px',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  settingsOptions: {
    fontWeight: 600,
  },
  flipTokenContainer: {
    position: 'absolute',
    left: 'calc(2%)',
    top: '-44px',
    background: theme.palette.background.default,
    borderRadius: '10px',
    width: 36,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
  },
  flipIcon: {
    transform: 'rotate(90deg)',
  },
  flipButton: {
    borderRadius: '10px',
    '& > span > svg': {
      height: '20px',
      width: '20px',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  swapButton: {
    padding: theme.spacing(1),
    fontSize: '18px',
    marginTop: theme.spacing(3),
    backgroundColor: (theme as any).palette.primary[400],
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
    '&.Mui-disabled': {
      backgroundColor: (theme as any).palette.neutral[200],
      color: (theme as any).palette.neutral[0],
    },
  },
}));
