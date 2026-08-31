import React, { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import type { ListItemProps } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import ChevronDownIcon from '../icons/ChevronDown';
import ChevronRightIcon from '../icons/ChevronRight';

const useStyles = makeStyles((theme) =>
  createStyles({
    startIcon: {
      minWidth: '24px',
    },
    branchListItem: {
      display: 'block',
      paddingTop: 0,
      paddingBottom: 0,
    },
    branchButton: {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      justifyContent: 'flex-start',
      paddingRight: '8px',
      paddingTop: '12px',
      paddingBottom: '12px',
      textAlign: 'left',
      textTransform: 'none',
      width: '100%',
    },
    leafListItem: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0,
    },
    leafButton: {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      justifyContent: 'flex-start',
      textAlign: 'left',
      paddingRight: '8px',
      paddingTop: '12px',
      paddingBottom: '12px',
      textTransform: 'none',
      width: '100%',
    },
    leafButtonActive: {
      color: theme.palette.primary.main,
      fontWeight: 700,
      position: 'relative',
      '& svg': {
        color: theme.palette.primary.main,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        height: '40px',
        width: '6px',
        display: 'block',
        background: theme.palette.primary.main,
        left: '-7.2%',
      },
    },
  }),
);

interface NavItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  depth: number;
  icon?: React.ElementType;
  info?: ReactNode;
  open?: boolean;
  path?: string;
  beta?: boolean;
  title: string;
  ready: boolean;
}

const NavItem: FC<NavItemProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const { active, children, depth, icon: Icon, info, open: openProp, path, beta, title, ready, ...other } = props;
  const [open, setOpen] = useState<boolean>(openProp);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 16;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const IconComponent = Icon ? (
    <Icon color={active ? theme.palette.primary.main : theme.palette.text.secondary} />
  ) : (
    <></>
  );

  // Branch
  if (children) {
    return (
      <ListItem disableGutters className={classes.branchListItem} {...other}>
        <Button
          endIcon={!open ? <ChevronRightIcon fontSize="small" /> : <ChevronDownIcon fontSize="small" />}
          onClick={handleToggle}
          startIcon={IconComponent}
          className={classes.branchButton}
          classes={{ startIcon: classes.startIcon }}
          sx={{ pl: `${paddingLeft}px` }}
          variant="text"
          disabled={!ready}
        >
          <Box flexGrow={1}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem disableGutters className={classes.leafListItem}>
      <Button
        id="navbar-section-link"
        component={path && RouterLink}
        startIcon={IconComponent}
        className={`${classes.leafButton} ${active ? classes.leafButtonActive : null} ${title}`}
        classes={{ startIcon: classes.startIcon }}
        sx={{ pl: `${paddingLeft}px` }}
        variant="text"
        to={path}
        disabled={!ready}
      >
        <Box flexGrow={1}>
          {title}
          {ready ? null : (
            <Typography color="primary" variant="caption" fontWeight="bold">
              {' '}
              Coming soon!
            </Typography>
          )}
          {beta ? <Chip label="BETA" color="primary" size="small" sx={{ marginLeft: 1 }} /> : null}
        </Box>
        {info}
      </Button>
    </ListItem>
  );
};

export default NavItem;
