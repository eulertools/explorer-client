import { FC, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { getExchanges } from 'src/slices/tables/exchanges';
import { setFilterValue } from 'src/slices/ui/filters';
import { useSelector as useStoreSelector } from 'src/store';
import { getExchangeInfoFromOwner } from 'src/utils/exchanges';

export const useStyles = makeStyles((theme) => ({
  buttons: {
    width: 'auto',
    borderRadius: theme.spacing(2),
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
}));

export const FilterEulerExchange: FC<GlobalFilterProps> = ({ filterName = 'tradePair', tableId, defaultValue }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const value = useSelector(selectFilterValue(tableId, filterName)) || defaultValue;
  const { exchanges } = useStoreSelector((state) => state.exchanges);
  const { externalLinks } = useContext(ConfigurationContext);

  const sortableExchanges = [...exchanges.hits];

  useEffect(() => {
    dispatch(getExchanges(value.baseAddress, null, { size: 20, page: 0 }));
  }, []);

  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: value || defaultValue,
      }),
    );
  }, []);

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

  const onExchangeChange = useCallback(
    (exchange) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue: {
            pairAddress: exchange.address.toLowerCase(),
            baseAddress: exchange.base_token_address,
            base: exchange.base_token_symbol,
            quote: exchange.quote_token_symbol,
          },
        }),
      );
      setOpen(false);
    },
    [tableId, filterName],
  );

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Box display="flex" alignItems="center">
      <Button
        ref={anchorRef}
        className={classes.buttons}
        size="large"
        variant="outlined"
        endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
        onClick={handleToggle}
      >
        {value.base}/{value.quote}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <Menu
                  open={open}
                  id="exchange-menu"
                  onKeyDown={handleListKeyDown}
                  onClose={handleClose}
                  anchorEl={anchorRef.current}
                  PaperProps={{
                    style: {
                      maxHeight: 250,
                      marginTop: 45,
                    },
                  }}
                >
                  {sortableExchanges
                    ?.sort((a, b) => a._source.readable_update_date - b._source.readable_update_date)
                    .map((exchange) => {
                      const {
                        owner,
                        base_token_symbol: baseSymbol,
                        quote_token_symbol: quoteSymbol,
                        base_token_address: baseAddress,
                        quote_token_address: quoteAddress,
                      } = exchange._source;
                      const { label, avatarSrc } = getExchangeInfoFromOwner(
                        owner,
                        baseAddress,
                        quoteAddress,
                        externalLinks,
                      );
                      const selected = exchange._source.address.toLowerCase() === value.pairAddress.toLowerCase();
                      return (
                        <ListItem
                          className={selected ? classes.selected : null}
                          key={exchange._id}
                          button
                          onClick={() => onExchangeChange(exchange._source)}
                        >
                          <ListItemIcon>
                            <AvatarThumbnail alt={owner.toUpperCase()} src={avatarSrc} />
                          </ListItemIcon>
                          <ListItemText
                            className={classes.listText}
                            primary={`${label} - ${baseSymbol}/${quoteSymbol}`}
                          />
                        </ListItem>
                      );
                    })}
                </Menu>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
