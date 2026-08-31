import clsx from 'clsx';
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Pagination from '@material-ui/core/Pagination';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectFilterState } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';

const useStyles = makeStyles((theme) => ({
  button: {
    width: 'auto',
    borderRadius: theme.spacing(2),
    padding: '5.875px 21px',
    color: theme.palette.text.primary,
    fontWeight: 'normal',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  buttonLight: {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      backgroundColor: theme.palette.action.hover,
    },
  },
  buttonDark: {
    borderColor: 'rgba(255, 255, 255, 0.23)',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
      backgroundColor: theme.palette.action.hover,
    },
  },
  popper: {
    zIndex: 1,
    width: '100%',
    transform: 'translate(0px, 161px)',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  listText: {
    color: theme.palette.text.primary,
  },
  menuList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
}));

export const FilterPagination: FC<GlobalFilterProps> = ({ tableId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilterState(tableId));
  const { settings } = useSettings();

  const pageSizeOptions = [16, 32];

  const [open, setOpen] = useState(false);
  const [selectedPageSize, setSelectedPageSize] = useState(
    pageSizeOptions.find((i) => i === filters.filter.size) || pageSizeOptions[0],
  );
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const onPageSizeChange = useCallback(
    (j) => {
      dispatch(
        setFilterValue(tableId, {
          filterName: 'size',
          filterValue: j,
        }),
      );

      setOpen(false);
      setSelectedPageSize(j);
    },
    [tableId],
  );

  const onPageChange = useCallback(
    (value: number) => dispatch(setFilterValue(tableId, { filterName: 'page', filterValue: value })),
    [tableId],
  );

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

  return (
    <Grid container display="flex" flexDirection="row" justifyContent="center" spacing={2}>
      <Grid item display="flex" justifyContent="center">
        <Pagination
          variant="outlined"
          shape="rounded"
          size="large"
          count={filters.filter.size} // TODO: Replace with API total.
          page={filters.filter.page}
          onChange={(e, value) => onPageChange(value)}
        />
      </Grid>
      <Grid item display="flex" flexDirection="column" justifyContent="center" gap={2}>
        <Button
          ref={anchorRef}
          className={clsx(
            classes.button,
            { [classes.buttonLight]: settings.theme !== 'DARK' },
            { [classes.buttonDark]: settings.theme === 'DARK' },
          )}
          fullWidth
          size="large"
          variant="outlined"
          endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
          onClick={handleToggle}
        >
          {selectedPageSize}
        </Button>
      </Grid>
      <Popper
        transition
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        className={isMobile ? classes.popper : undefined}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  className={classes.menuList}
                  autoFocusItem={open}
                  id="status-menu"
                  onKeyDown={handleListKeyDown}
                  disableListWrap
                >
                  {pageSizeOptions?.map((k) => (
                    <ListItem key={k} button onClick={() => onPageSizeChange(k)}>
                      <ListItemText className={classes.listText} primary={k} />
                    </ListItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
};
