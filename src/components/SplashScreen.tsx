import { useWeb3React } from '@web3-react/core';
import type { FC } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAuth from 'src/hooks/useAuth';
import { EulerLoading } from 'src/ui/EulerLoading';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      left: 0,
      padding: theme.spacing(3),
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 2000,
    },
  }),
);

const SplashScreen: FC = ({ children }) => {
  const classes = useStyles();
  const auth = useAuth();
  const { active } = useWeb3React();

  if (!auth.isInitialized || !active) {
    return (
      <Box className={classes.root}>
        <EulerLoading size="m" />
      </Box>
    );
  }

  return <>{children}</>;
};

export default SplashScreen;
