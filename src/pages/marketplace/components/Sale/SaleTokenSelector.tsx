import _debounce from 'lodash/debounce';
import { FC, useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { getTokens, getTokenData } from 'src/slices/tables/tokens';
import { setFilterValue } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { isAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  listText: {
    color: theme.palette.text.primary,
  },
  zIndex: {
    zIndex: 10000,
  },
  menuList: {
    maxHeight: '260px',
    overflowY: 'auto',
  },
}));

interface ISaleTokenSelectorProps {
  formik: any;
  fieldValue: string;
  linkedField: string;
  label: string;
  helperText: string;
}

export const SaleTokenSelector: FC<ISaleTokenSelectorProps> = ({
  formik,
  fieldValue,
  linkedField,
  label,
  helperText,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const tableId = UITableID.marketplace_token_selector;
  const filters = useSelector(selectFilterState(tableId));
  const { tokens, total, loading } = useSelector((state) => state.tokens);
  const [tokenList, setTokenList] = useState(null);
  const { chain } = useContext(ConfigurationContext);

  const fields = ['name', 'symbol', 'address', 'price_usd'];

  /**
   * We need a way to represent the Network Token in
   * the marketplace contract, this is the address.
   */
  const bnbTkn = {
    name: 'BNB',
    symbol: 'BNB',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    price_usd: 0,
    identifier: 'bsc~token~bnb',
  };

  const setFilterQuery = useCallback((query: string) => {
    dispatch(
      setFilterValue(tableId, {
        filterName: 'query',
        filterValue: query,
      }),
    );
  }, []);

  const onNameChange = useCallback(
    _debounce((x) => {
      setFilterQuery(x);
    }, 500),
    [],
  );

  useEffect(() => {
    dispatch(getTokens(filters.filter, fields));
  }, [filters.filter]);

  const [open, setOpen] = useState(false);
  const [textFieldWidth, setTextFieldWidth] = useState(0);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const tokenLogo = useMemo(() => {
    const address = formik.values[fieldValue].address || formik.values[fieldValue].symbol;
    if (isAddress(address)) {
      return (
        <Box pr={1}>
          <AvatarThumbnail alt={formik.values[fieldValue].symbol} address={address} />
        </Box>
      );
    }
    return null;
  }, [formik]);

  const handleTokenChange = useCallback(async (tkn) => {
    const token = await getTokenData(tkn.address, chain);
    const newToken = {
      ...tkn,
      price: token.price_usd,
    };
    setOpen((prevState) => !prevState);
    setFilterQuery('');
    formik.setFieldValue(fieldValue, newToken);
    formik.setFieldValue(linkedField, '');
    formik.setFieldTouched(linkedField, false, false);
  }, []);

  const handleChange = useCallback(async (e) => {
    onNameChange(e.target.value);
    const addressValue = isAddress(e.target.value);
    const token = addressValue ? await getTokenData(e.target.value, chain) : null;
    if (!token) {
      const newToken = {
        key: e.target.value,
        symbol: e.target.value,
        address: addressValue ? e.target.value : '',
        price: '',
      };
      formik.setFieldValue(fieldValue, newToken);
    } else {
      const newToken = {
        key: token.symbol,
        symbol: token.symbol,
        address: token.address,
        price: token.price_usd,
      };
      formik.setFieldValue(fieldValue, newToken);
    }
    formik.setFieldValue(linkedField, '');
    formik.setFieldTouched(linkedField, false, false);
    if (!addressValue) {
      formik.setFieldTouched(fieldValue, false, false);
    }
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

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    if (!open) {
      setFilterQuery('');
    }
    if (open && formik.values[fieldValue].symbol && !formik.values[fieldValue].address) {
      setFilterQuery(formik.values[fieldValue].symbol.toUpperCase());
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (anchorRef) {
      setTextFieldWidth(anchorRef.current.clientWidth);
    }
  }, [anchorRef]);

  useEffect(() => {
    if (!loading && tokens) {
      if (tokens.length > 0 && (!filters.filter.query || filters.filter.query.toUpperCase().includes('BNB'))) {
        setTokenList([bnbTkn, ...tokens]);
      } else {
        setTokenList(tokens);
      }
    }
  }, [tokens, loading]);

  useEffect(() => () => setFilterQuery(''), []);

  return (
    <>
      <TextField
        fullWidth
        autoComplete="off"
        size="small"
        margin="dense"
        id={fieldValue}
        name={`${fieldValue}.symbol`}
        variant="outlined"
        label={t(label)}
        placeholder="Search by Token or input your own contract..."
        value={formik.values[fieldValue]?.symbol}
        onChange={handleChange}
        error={!!(formik.touched[fieldValue] && formik.errors[fieldValue])}
        helperText={helperText}
        onClick={handleToggle}
        ref={anchorRef}
        focused={open}
        InputProps={{ startAdornment: tokenLogo }}
      />
      <Popper
        className={classes.zIndex}
        transition
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  className={classes.menuList}
                  style={{ width: textFieldWidth }}
                  autoFocusItem={!open}
                  id="token-menu"
                  onKeyDown={handleListKeyDown}
                  disableListWrap
                >
                  {tokenList?.map((tkn) => (
                    <ListItem
                      key={tkn.symbol}
                      button
                      onClick={() =>
                        handleTokenChange({
                          key: tkn.symbol,
                          symbol: tkn.symbol,
                          address: tkn.address,
                          price: tkn.price_usd,
                        })
                      }
                    >
                      <ListItemIcon>
                        <AvatarThumbnail alt={tkn.symbol} address={tkn.address} />
                      </ListItemIcon>
                      <ListItemText className={classes.listText} primary={tkn.symbol} />
                    </ListItem>
                  ))}
                  {total === 0 ? (
                    <ListItem key="empty">
                      <ListItemText className={classes.listText} primary="No Markets found." />
                    </ListItem>
                  ) : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
