import { EulerIconSearchNormal1 } from '@eulertools/ui';
import _debounce from 'lodash/debounce';
import { FC, useState, useEffect, useRef, useCallback } from 'react';
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
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import gtm from 'src/lib/gtm';
import { UITableSort } from 'src/slices/filter.types';
import { getMarketsData, getMarketData } from 'src/slices/tables/markets';
import { IChain } from 'src/types/configuration';
import { isBNBToken } from 'src/utils/marketplace';
import { isAddress } from 'src/utils/stringUtils';
import { BNB_TOKEN_INFO } from '../constants';
import { ISwapToken } from '../types';

interface ISaleTokenSelectorProps {
  initialValue: ISwapToken | null;
  onValueChange: (newValue: ISwapToken) => void;
  label: string;
  helperText?: string;
  error?: boolean;
  networkFilter?: Record<string, IChain>;
}

const TokenSelectorV2: FC<ISaleTokenSelectorProps> = ({
  initialValue,
  onValueChange,
  error,
  label,
  helperText,
  networkFilter,
}) => {
  const [tokenList, setTokenList] = useState<ISwapToken[]>(null);
  const [selectedToken, setSelectedToken] = useState<ISwapToken>(initialValue);
  const [userInput, setUserInput] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [textFieldWidth, setTextFieldWidth] = useState(0);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (initialValue.address !== selectedToken.address) {
      setSelectedToken(initialValue);
    }
  }, [initialValue]);

  const onSymbolQueryChange = useCallback(
    _debounce(async (query) => {
      if (!query) {
        return;
      }

      if (isAddress(query)) {
        const tokenData = await getMarketData(query, networkFilter as any);

        if (tokenData) {
          setTokenList([
            {
              name: tokenData.name,
              symbol: tokenData.symbol,
              address: tokenData.networks.bnb.address,
              image: tokenData.image.cg.thumb,
            },
          ]);
        } else {
          setTokenList([
            {
              name: query,
              symbol: query,
              address: query,
            },
          ]);
        }

        return;
      }

      const markets = await getMarketsData({
        query,
        type: 'token-selector',
        size: 10,
        page: 0,
        orderBy: 'rank.cg.global',
        orderDir: UITableSort.asc,
        network: networkFilter || 'bnb',
      });

      const filteredMarkets = markets.map((m) => ({
        name: m.name,
        symbol: m.symbol,
        address: m.networks.bnb.address,
        image: m.image.cg.thumb,
      }));

      if (query.toUpperCase().includes('BNB')) {
        setTokenList([BNB_TOKEN_INFO, ...filteredMarkets]);
      } else {
        setTokenList(filteredMarkets);
      }
      gtm.push({ event: 'user_view_token_list', category: 'Swapper', action: 'User View Token List' });
    }, 300),
    [],
  );

  const handleChange = useCallback(async (e) => {
    const newUserInput = e.target.value;
    setUserInput(newUserInput);
    onSymbolQueryChange(newUserInput);
  }, []);

  const handleTokenChange = useCallback((token) => {
    setOpen(false);
    if (isBNBToken(token.address)) {
      setSelectedToken({
        name: token.name,
        symbol: token.symbol,
        address: token.address,
      });
    } else {
      setSelectedToken({
        name: token?.name,
        symbol: token?.symbol,
        address: token?.networks?.bnb?.address,
        image: token?.image?.cg?.thumb,
      });
    }
    setUserInput('');
    setTokenList([]);
    onValueChange(token);
  }, []);

  const openOnInputClick = () => {
    setOpen(true);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    // Clear input/data after close event
    setUserInput('');
    setTokenList([]);
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

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (anchorRef) {
      setTextFieldWidth(anchorRef.current.clientWidth);
    }
  }, [anchorRef]);

  return (
    <>
      <TextField
        fullWidth
        autoComplete="off"
        size="small"
        margin="none"
        id="select-token-textField"
        variant="outlined"
        label={label}
        placeholder="Search token"
        value={open ? userInput : selectedToken.symbol}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        onClick={openOnInputClick}
        ref={anchorRef}
        focused={open}
        onKeyDown={handleListKeyDown}
        InputProps={{
          startAdornment:
            selectedToken && !open ? (
              <Box pr={1}>
                <AvatarThumbnail alt={selectedToken.symbol} src={selectedToken.image} address={selectedToken.address} />
              </Box>
            ) : (
              <Box pr={1}>
                <EulerIconSearchNormal1 size="m" colorLight="neutral-300" colorDark="neutral-300" />
              </Box>
            ),
        }}
        sx={{
          '& input': {
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '20px',
            color: (theme) => (theme as any).palette.neutral[900],
          },
          '& input::placeholder': {
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '20px',
            color: (theme) => (theme as any).palette.neutral[400],
          },
          '& .MuiOutlinedInput-root:hover': {
            '& > fieldset': {
              borderColor: 'transparent',
            },
          },
          '& .MuiOutlinedInput-root fieldset': {
            borderColor: 'transparent',
            borderRadius: '12px',
          },
          '& .MuiOutlinedInput-root.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
        }}
      />
      <ClickAwayListener onClickAway={handleClose}>
        <Popper
          transition
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          style={{ zIndex: 10000 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom-start' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                {userInput ? (
                  <MenuList
                    style={{ width: textFieldWidth }}
                    autoFocusItem={!open}
                    id="token-menu"
                    onKeyDown={handleListKeyDown}
                    disableListWrap
                    sx={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      marginTop: '1px !important',
                    }}
                  >
                    {tokenList?.map((token) => (
                      <ListItem key={token.symbol} button onClick={() => handleTokenChange(token)}>
                        <ListItemIcon>
                          <AvatarThumbnail alt={token.symbol} src={token.image || ''} address={token.address} />
                        </ListItemIcon>
                        <ListItemText
                          primary={token.symbol}
                          secondary={token.name}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '16px',
                              fontWeight: 600,
                              lineHeight: '20px',
                              color: (theme) => (theme as any).palette.neutral[700],
                            },
                            '& .MuiListItemText-secondary': {
                              fontSize: '13px',
                              fontWeight: 500,
                              lineHeight: '17px',
                              color: (theme) => (theme as any).palette.neutral[600],
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                    {!tokenList || tokenList?.length === 0 ? (
                      <ListItem key="empty">
                        <ListItemText
                          primary="No results found."
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '13px',
                              fontWeight: 500,
                              lineHeight: '17px',
                              color: (theme) => (theme as any).palette.neutral[600],
                            },
                          }}
                        />
                      </ListItem>
                    ) : null}
                  </MenuList>
                ) : null}
              </Paper>
            </Grow>
          )}
        </Popper>
      </ClickAwayListener>
    </>
  );
};

export default TokenSelectorV2;
