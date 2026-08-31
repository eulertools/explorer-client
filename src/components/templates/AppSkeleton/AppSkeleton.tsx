import type { FC } from 'react';
import { makeStyles, createStyles, Theme, Box, Container } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      fontFamily: "'Montserrat', 'Roboto', sans-serif",
    },
    container: {
      // Larger padding at the bottom for the feedback button
      padding: theme.spacing(2, 2, 8),

      '@media (min-width: 600px)': {
        padding: theme.spacing(3, 5, 8),
      },

      '@media (min-width: 960px)': {
        padding: theme.spacing(3, 5, 8),
      },

      '@media (min-width: 1560px)': {
        maxWidth: '100%',
        padding: theme.spacing(3, 5, 8),
      },
    },
    noPadding: {
      padding: theme.spacing(0),
    },
  }),
);

interface AppSkeletonProps {
  noPadding?: boolean;
}

const AppSkeleton: FC<AppSkeletonProps> = (props) => {
  const { children, noPadding = false } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={noPadding ? classes.noPadding : classes.container}>{children}</Container>
    </Box>
  );
};

export default AppSkeleton;
