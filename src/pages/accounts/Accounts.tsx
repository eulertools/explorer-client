import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles, createStyles, Typography, Card, Box } from '@material-ui/core';
import { AppSkeleton } from 'src/components/templates';
import AccountsTable from 'src/pages/accounts/components/AccountsTable';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      border: 'none',
      boxShadow: `0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08);`,
      width: '100%',
      overflowX: 'auto',
    },
  }),
);

const Accounts: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Euler Tools | Blockchain Accounts</title>
      </Helmet>
      <AppSkeleton>
        <Typography variant="h4" color="textPrimary" mb={3}>
          Accounts
        </Typography>
        <Card className={classes.root}>
          <Box minWidth="800px">
            <AccountsTable toolbarTitle="Top Accounts" />
          </Box>
        </Card>
      </AppSkeleton>
    </>
  );
};

export default Accounts;
