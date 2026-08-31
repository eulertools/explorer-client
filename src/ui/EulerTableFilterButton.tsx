import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  }),
);
interface EulerTableFilterButtonProps {
  children: React.ReactChild;
  filterId: string;
}

export const EulerTableFilterButton = (props: EulerTableFilterButtonProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { children, filterId } = props;
  const open = Boolean(anchorEl);
  const id = open ? filterId : undefined;

  return (
    <div>
      <IconButton onClick={handleClick} aria-label="Open Filter" size="small">
        <FilterListIcon fontSize="inherit" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className={classes.typography}>{children}</Box>
      </Popover>
    </div>
  );
};
