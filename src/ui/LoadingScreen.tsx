import NProgress from 'nprogress';
import { useEffect } from 'react';
import { Box } from '@material-ui/core';

export const LoadingScreen = () => {
  useEffect(() => {
    NProgress.start();

    return (): void => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
      }}
    />
  );
};
