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
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps, UITableID } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { marketSaleTypeOptions } from 'src/types/marketplace';

const useStyles = makeStyles((theme) => ({
  button: {
    width: 'auto',
    borderRadius: theme.spacing(2),
    padding: '5.875px 21px',
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
  selected: {
    background: theme.palette.background.paper,
  },
  textField: {
    width: '150px',
  },
  menuList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
}));

export const FilterSaleKind: FC<GlobalFilterProps> = ({ filterName = 'kind', tableId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const value: string = useSelector(selectFilterValue(tableId, filterName)) || 'all';

  const extendedMarketplaceSaleOptions = [
    {
      key: 'all',
      label: 'All Sales',
      description: 'All sales.',
    },
    marketSaleTypeOptions[0],
    marketSaleTypeOptions[2],
  ];

  const extendedMyTradesSaleOptions = [
    {
      key: 'all',
      label: 'All Sales',
      description: 'All sales.',
    },
    /**
     * All currently supported
     * kinds of sales
     */
    marketSaleTypeOptions[0],
    marketSaleTypeOptions[1],
    marketSaleTypeOptions[2],
    marketSaleTypeOptions[3],
  ];

  const extendedSaleOptions =
    tableId === UITableID.marketplace_trade_list
      ? [...extendedMarketplaceSaleOptions]
      : [...extendedMyTradesSaleOptions];

  const [open, setOpen] = useState(false);
  const [selectedKind, setSelectedKind] = useState(
    extendedSaleOptions?.find((j) => j.key === +value) || extendedSaleOptions[0],
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

  const onChange = useCallback(
    (k) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue: k.key.toString(),
        }),
      );
      setOpen(false);
      setSelectedKind(k);
    },
    [tableId, filterName],
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
      <Grid item display="flex" flexDirection="column" justifyContent="center" gap={2}>
        <Button
          ref={anchorRef}
          className={classes.button}
          fullWidth
          size="large"
          variant="outlined"
          endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
          onClick={handleToggle}
        >
          {selectedKind.label.toUpperCase()}
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
                  id="kind-menu"
                  onKeyDown={handleListKeyDown}
                  disableListWrap
                >
                  {extendedSaleOptions?.map((i) => (
                    <ListItem key={i.key} button onClick={() => onChange(i)}>
                      <ListItemText className={classes.listText} primary={i.label.toUpperCase()} />
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
