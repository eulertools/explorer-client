import React, { FC } from 'react';
import { Box, Grid, Typography, createStyles, makeStyles } from '@material-ui/core';

interface EulerErrorProps {
  error: string;
  minHeight?: string;
  onlyText?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      fontWeight: 800,
      marginBottom: '8px',
    },
  }),
);

export const EulerError: FC<EulerErrorProps> = (props) => {
  const { error, children, minHeight, onlyText } = props;
  const classes = useStyles();

  const text = React.useMemo(
    () => (
      <Typography color="textPrimary" variant="subtitle2" classes={{ subtitle2: classes.text }}>
        {error}
      </Typography>
    ),
    [error],
  );
  if (onlyText) return text;
  return (
    <Box display="grid" justifyContent="center" minHeight={minHeight}>
      <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {text}
        {children ? <div>{children}</div> : null}
      </Grid>
    </Box>
  );
};
