import React from 'react';
import { createStyles, makeStyles, Theme, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
);

export const Separator = () => {
  const classes = useStyles();
  return <Divider orientation="horizontal" className={classes.divider} />;
};
