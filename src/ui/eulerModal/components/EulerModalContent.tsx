import React from 'react';
import { DialogContent, Box } from '@material-ui/core';
import { useStyles } from '../styles';

export const EulerModalContent = (props) => {
  const classes = useStyles();

  return (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <Box>{props.children}</Box>
    </DialogContent>
  );
};
