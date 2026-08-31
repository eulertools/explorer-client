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
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';

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
}));

interface TradeItem {
  label: string;
  value: number[];
}

const TradeVolumeOptions = [
  { label: 'all', value: [0, -1] },
  { label: 'shrimp', value: [0, 1_000] },
  { label: 'turtle', value: [1_000, 10_000] },
  { label: 'shark', value: [10_000, 100_000] },
  { label: 'whale', value: [100_000, -1] },
];

export const FilterSelectTradeVolume: FC<GlobalFilterProps> = ({ filterName = 'volumeRange', tableId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const value: number[] = useSelector(selectFilterValue(tableId, filterName)) || [];

  const [open, setOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<TradeItem>(TradeVolumeOptions[0]);
  const [volumeRange, setVolumeRange] = useState<number[]>(value);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const newRange = () => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: [+volumeRange[0], +volumeRange[1]],
      }),
    );
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const onChange = useCallback(
    (trade: TradeItem) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue: [trade.value[0], trade.value[1]],
        }),
      );
      setOpen(false);
      setSelectedVolume(trade);
      setVolumeRange(trade.value);
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

  const onInputChange = (e, side: string) => {
    const reg = /^[0-9\b]+$/;
    e.preventDefault();
    if (side === 'max' && volumeRange[1] === -1) setVolumeRange((prev) => [prev[0], +e.target.value.slice(1)]);
    if (e.target.value === '' || reg.test(e.target.value)) {
      if (e.target.value === '') {
        if (side === 'min') setVolumeRange((prev) => [0, prev[1]]);
        if (side === 'max') setVolumeRange((prev) => [prev[0], -1]);
      } else if (side === 'min' && volumeRange[0] === 0) setVolumeRange((prev) => [+e.target.value.slice(1), prev[1]]);
      else if (side === 'max' && volumeRange[1] === 0) setVolumeRange((prev) => [prev[0], +e.target.value.slice(1)]);
      else if (side === 'min' && volumeRange[1] > +e.target.value) setVolumeRange((prev) => [+e.target.value, prev[1]]);
      else if (side === 'max' && volumeRange[0] < +e.target.value) setVolumeRange((prev) => [prev[0], +e.target.value]);
    }
  };

  return (
    <Grid container display="flex" flexDirection="row" justifyContent="center" spacing={2}>
      <Grid item display="flex" flexDirection="column" gap={2}>
        <TextField
          className={classes.textField}
          value={volumeRange[0]}
          size="small"
          variant="outlined"
          onChange={(e) => onInputChange(e, 'min')}
        />
        <TextField
          className={classes.textField}
          value={volumeRange[1] === -1 ? '\u221E' : volumeRange[1]}
          size="small"
          variant="outlined"
          onChange={(e) => onInputChange(e, 'max')}
        />
      </Grid>
      <Grid item display="flex" flexDirection="column" justifyContent="center" gap={2}>
        <Button className={classes.button} fullWidth size="large" variant="outlined" onClick={newRange}>
          CUSTOM
        </Button>
        <Button
          ref={anchorRef}
          className={classes.button}
          fullWidth
          size="large"
          variant="outlined"
          endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
          onClick={handleToggle}
        >
          {selectedVolume.label.toUpperCase()}
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
                <MenuList autoFocusItem={open} id="network-menu" onKeyDown={handleListKeyDown}>
                  {TradeVolumeOptions?.map((trade) => (
                    <ListItem key={trade.label} button onClick={() => onChange(trade)}>
                      <ListItemText className={classes.listText} primary={trade.label.toUpperCase()} />
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
