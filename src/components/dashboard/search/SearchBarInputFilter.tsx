import { FC, useState, useEffect, Dispatch, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';

export const useStyles = makeStyles((theme) => ({
  buttons: {
    width: '100%',
    height: '100%',
    padding: 0,
    borderRadius: theme.spacing(2),
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      width: 'min(90px, 100%)',
    },
  },
  listText: {
    color: theme.palette.text.primary,
  },
  menu: {
    transform: 'translateY(10px) !important',
  },
}));

export enum ESearchFilter {
  ALL = 'ALL',
  TOKEN = 'token',
  PAIR = 'pool',
}

const searchFiltersOptions = [
  {
    value: ESearchFilter.ALL,
    label: 'All',
  },
  {
    value: ESearchFilter.TOKEN,
    label: 'Token',
  },
];
interface ISearchBarInputFilterProps {
  value: string;
  onChange: Dispatch<string>;
  // closeResults: Dispatch<SetStateAction<boolean>>;
}

export const SearchBarInputFilter: FC<ISearchBarInputFilterProps> = ({ value, onChange }) => {
  const classes = useStyles();
  const [searchFilter, setSearchFilter] = useState(searchFiltersOptions[0]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleFilterChange = (filterValue) => {
    setSearchFilter(filterValue);
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (value !== searchFilter.value) {
      onChange(searchFilter.value);
    }
  }, [searchFilter]);

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Box>
      <Button
        ref={anchorRef}
        className={classes.buttons}
        size="large"
        variant="text"
        endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
        onClick={handleToggle}
      >
        {searchFilter.label}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper className={classes.menu}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="search-filter-menu" onKeyDown={handleListKeyDown}>
                  {searchFiltersOptions?.map((filter) => (
                    <ListItem key={filter.value} button onClick={() => handleFilterChange(filter)}>
                      <ListItemText className={classes.listText} primary={filter.label} />
                    </ListItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
