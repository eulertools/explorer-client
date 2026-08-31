import { EulerIconArrowDown } from '@eulertools/ui';
import { FC, useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { getTokens, getTokenData } from 'src/slices/tables/tokens';
import { setFilterValue } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { ISource } from 'src/types/search';
import { isAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles(() => ({
  popper: {
    zIndex: 10000,
    maxWidth: '260px',
    overflow: 'hidden',
  },
}));

interface ISaleTokenSelectorProps {
  formik: any;
  fieldValue: string;
  linkedField: string;
  helperText: string;
  tokenList: ISource[];
  onNameChange(eventValue: string): void;
  initialValue: ISource;
}

export const SaleTokenSelectorV2: FC<ISaleTokenSelectorProps> = ({
  formik,
  fieldValue,
  linkedField,
  helperText,
  tokenList,
  onNameChange,
  initialValue,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const tableId = UITableID.marketplace_token_selector;
  const filters = useSelector(selectFilterState(tableId));
  const { chain } = useContext(ConfigurationContext);
  const fields = ['name', 'symbol', 'address', 'price_usd'];
  const [selectedToken, setSelectedToken] = useState(initialValue);

  const setFilterQuery = useCallback((query: string) => {
    dispatch(
      setFilterValue(tableId, {
        filterName: 'query',
        filterValue: query,
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(getTokens(filters.filter, fields));
  }, [filters.filter]);

  useEffect(() => {
    if (Object.keys(selectedToken).length === 0) {
      setSelectedToken(initialValue);
    }
  }, [initialValue]);

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

  const tokenData = useCallback(async () => {
    if (selectedToken && selectedToken.address && !selectedToken.price) {
      const token = await getTokenData(selectedToken.address, chain);
      const newToken = {
        ...selectedToken,
        price: token.price_usd,
      };
      setSelectedToken(newToken);
      formik.setFieldValue(fieldValue, newToken);
    }
  }, [selectedToken]);

  useEffect(() => {
    tokenData();
  }, [selectedToken]);

  const handleTokenChange = useCallback((tkn) => {
    setOpen((prevState) => !prevState);
    setFilterQuery('');
    setSelectedToken(tkn);
    formik.setFieldValue(fieldValue, tkn);
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
    if (!open) {
      formik.setFieldValue(fieldValue, '');
    }
    setOpen((prevState) => !prevState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    formik.setFieldValue(fieldValue, selectedToken);
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
        placeholder="Search token"
        value={formik.values[fieldValue]?.symbol || ''}
        onChange={handleChange}
        error={!!(formik.touched[fieldValue] && formik.errors[fieldValue])}
        helperText={helperText}
        onClick={handleToggle}
        ref={anchorRef}
        focused={open}
        InputProps={{
          startAdornment: tokenLogo,
          endAdornment: <EulerIconArrowDown size="s" colorLight="neutral-500" />,
        }}
        sx={{
          borderRadius: theme.spacing(1.5),
          backgroundColor: theme.palette.background.paper,
          marginTop: '0px',
          input: { fontWeight: 600, color: 'neutral.400', fontSize: '16px' },
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.spacing(1.5),
          },
          '& .MuiFormHelperText-root': {
            margin: theme.spacing(0),
            fontSize: '11px',
            background: theme.palette.background.default,
          },
        }}
      />
      <Popper
        className={classes.popper}
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
                  sx={{
                    maxHeight: '230px',
                    overflowY: 'scroll',
                    paddingRight: theme.spacing(2),
                    paddingLeft: theme.spacing(1),
                    boxSizing: 'content-box',
                  }}
                  style={{ width: textFieldWidth }}
                  autoFocusItem={!open}
                  id="token-menu"
                  onKeyDown={handleListKeyDown}
                  disableListWrap
                >
                  {tokenList.map((tkn) => (
                    <ListItem
                      key={tkn.symbol}
                      button
                      onClick={() =>
                        handleTokenChange({
                          key: tkn.symbol,
                          symbol: tkn.symbol,
                          address: tkn.address,
                          price: tkn.price,
                          name: tkn.name,
                        })
                      }
                    >
                      <ListItemIcon>
                        <AvatarThumbnail alt={tkn.symbol} address={tkn.address} />
                      </ListItemIcon>
                      <ListItemText
                        primary={tkn.symbol}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: '16px',
                          color: 'neutral.700',
                        }}
                        secondary={tkn.name}
                        secondaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '13px',
                          color: 'neutral.600',
                        }}
                      />
                    </ListItem>
                  ))}
                  {tokenList.length === 0 ? (
                    <ListItem key="empty">
                      <ListItemText color="neutral-500" primary="No Tokens found." />
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
