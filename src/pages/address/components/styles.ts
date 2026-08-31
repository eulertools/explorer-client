import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useAddressDetailStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      padding: theme.spacing(0, 3),

      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 6),
      },
    },
    label: {
      textAlign: 'left',
      fontWeight: 'bold',
      wordWrap: 'break-word',
      color: theme.palette.text.primary,
    },
    value: {
      textAlign: 'right',
      wordWrap: 'break-word',
      color: theme.palette.text.primary,
    },
  }),
);
