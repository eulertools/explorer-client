import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

interface ICardCommunityProps {
  children: React.ReactElement;
}

const CardCommunity: FC<ICardCommunityProps> = ({ children }) => {
  const classes = useStyles();
  return <Card className={classes.root}>{children}</Card>;
};

export default CardCommunity;
