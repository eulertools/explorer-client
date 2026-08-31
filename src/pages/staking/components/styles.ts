import { makeStyles } from '@material-ui/core/styles';

export const stakingStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingRight: 0,
  },
  cardHeaderContainer: {
    background: theme.palette.primary.light,
  },
  stakeInput: {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  stakeHelperText: {
    position: 'absolute',
    bottom: theme.spacing(-3),
    minWidth: 350,
  },
  button: {
    padding: theme.spacing(0.75, 3),
  },
  successColor: {
    color: theme.palette.success.main,
  },
}));
