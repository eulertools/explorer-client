import clsx from 'clsx';
import { ReactElement } from 'react';
import { makeStyles, createStyles, Box, Card } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      border: 'none',
      boxShadow: `0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08);`,
      width: '100%',
      overflowX: 'auto',
    },
    removeTopLeftBorder: {
      borderTopLeftRadius: 0,
    },
    removeTopRightBorder: {
      borderTopRightRadius: 0,
    },
    backgroundPaper: {
      background: theme.palette.background.paper,
    },
  }),
);

interface CardRootProps {
  children: ReactElement;
  noTopLeftBorder?: boolean;
  noTopRightBorder?: boolean;
  backgroundPaper?: boolean;
  minWidth?: number | null;
}

export const CardRoot = ({
  children,
  noTopLeftBorder = false,
  noTopRightBorder = false,
  backgroundPaper = false,
  minWidth = 800,
}: CardRootProps) => {
  const classes = useStyles();
  return (
    <Card
      className={clsx(
        classes.root,
        { [classes.removeTopLeftBorder]: noTopLeftBorder },
        { [classes.removeTopRightBorder]: noTopRightBorder },
        { [classes.backgroundPaper]: backgroundPaper },
      )}
    >
      <Box minWidth={minWidth ? `${minWidth}px` : null}>{children}</Box>
    </Card>
  );
};
