import React from 'react';
import { Typography, Box } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useStyles } from './style';

interface SubscribeBillingBoxProps {
  amount: string;
  checked: boolean;
  children?: React.ReactChild | React.ReactChild[];
  id: string;
  onClick: (id: String) => void;
}

export const SubscribeBillingBox = (props: SubscribeBillingBoxProps) => {
  const { amount, checked, children, id, onClick } = props;
  const classes = useStyles();
  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [id]);
  return (
    <Box
      boxShadow={1}
      className={`${classes.billingBox} ${checked ? 'checked' : ''}`}
      display="grid"
      justifyContent="center"
      alignItems="center"
      tabIndex={0}
      onClick={handleClick}
    >
      {checked ? <div className={classes.bgIcon} /> : null}
      {checked ? <CheckCircleIcon className={classes.checkIcon} /> : null}
      <Box>
        <Typography>{amount}</Typography>
        {children}
      </Box>
    </Box>
  );
};
