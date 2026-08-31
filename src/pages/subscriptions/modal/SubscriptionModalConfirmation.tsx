import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export function SubscriptionModalConfirmation() {
  const navigate = useNavigate();

  const handleClick = React.useCallback(() => {
    navigate('/');
  }, []);

  return (
    <Box height="400px" display="grid" justifyContent="center" alignItems="center">
      <Box display="grid" justifyContent="center" alignItems="center">
        <Typography>We are checking your transfer, please wait</Typography>
        <Box display="grid" justifyContent="center" pt={2}>
          <Button variant="contained" onClick={handleClick}>
            Back to home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
