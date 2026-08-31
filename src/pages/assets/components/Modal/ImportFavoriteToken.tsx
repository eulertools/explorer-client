import bodybuilder from 'bodybuilder';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery, CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import axios from 'src/lib/axios';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { addFavorite, FavoriteItem } from 'src/slices/user/favorites';
import { useDispatch } from 'src/store';
import { ESupportedNetworks } from 'src/types/blockchain';
import { ISearchMarkets, IMarketSource } from 'src/types/market';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import { hexToRGB, isAddress } from 'src/utils/stringUtils';

interface PartsProps {
  onClose: () => void;
  variant: 'dialog' | 'drawer';
}

interface TokenListProps {
  searchResults: any[];
  selectedTokens: FavoriteItem[];
  setSelectedTokens: Dispatch<SetStateAction<FavoriteItem[]>>;
}

const TokenList: FC<TokenListProps> = ({ searchResults, selectedTokens, setSelectedTokens }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tokenSelected = useMemo(
    () => (tokenAddress: string) => selectedTokens.find((i) => i.address === tokenAddress),
    [selectedTokens.length],
  );

  const getPriceVariation = (token) => {
    const percentage = token.price_change_percentage_1h?.cg;
    const totalPercentage = (token.price_usd?.cg * Math.abs(token.price_change_percentage_1h?.cg)) / 100;
    let arrow = '▼';
    let price = getBigNumberCurrencyLabel(token.price_usd?.cg + totalPercentage);
    if (percentage >= 0) {
      arrow = '▲';
      price = getBigNumberCurrencyLabel(token.price_usd?.cg - totalPercentage);
    }
    return `${arrow} ${Math.abs(percentage) || 0}% ($${price})`;
  };

  const onToggleSelectedToken = useCallback((token) => {
    const newSelected = {
      address: token.networks.bnb.address,
      name: token.networks.bnb.name,
      symbol: token.networks.bnb.symbol,
      network: ESupportedNetworks.BNB,
      type: EPortfolioItemType.TOKEN,
    };
    setSelectedTokens((prev) => {
      const exists = prev.find((i) => i.address === newSelected.address);
      if (exists) {
        return prev.filter((j) => j.address !== newSelected.address);
      }
      return [...prev, newSelected];
    });
  }, []);

  return (
    <Grid
      item
      xs={12}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(2),
      }}
    >
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          color: (theme as any).palette.terciary[700],
        }}
      >
        {t('Results')}
      </Typography>
      <List>
        {searchResults.map((item) => (
          <Box key={item.networks.bnb.address}>
            <Divider flexItem />
            <ListItem
              button
              onClick={() => onToggleSelectedToken(item)}
              sx={
                tokenSelected(item.networks.bnb.address)
                  ? {
                      background: (theme as any).palette.secondary[50],
                      '&:hover': {
                        background: (theme as any).palette.secondary[50],
                      },
                    }
                  : null
              }
            >
              <ListItemIcon>
                <AvatarThumbnail alt={item.networks.bnb?.name} src={item.image.cg?.large} />
              </ListItemIcon>
              <ListItemText
                primary={item.networks.bnb.symbol || item.networks.bnb.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: '17px',
                    color: (theme as any).palette.terciary[700],
                  },
                }}
              />
              <ListItemText
                primary={`$${getBigNumberCurrencyLabel(item.price_usd?.cg)}`}
                secondary={getPriceVariation(item)}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: '17px',
                    textAlign: 'right',
                    color: (theme as any).palette.terciary[700],
                  },
                  '& .MuiListItemText-secondary': {
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    textAlign: 'right',
                    color:
                      item.price_change_percentage_1h?.cg >= 0 ? theme.palette.success[800] : theme.palette.error[800],
                  },
                }}
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Grid>
  );
};

const Head: FC<PartsProps> = ({ onClose, variant }) => {
  const { t } = useTranslation();

  if (variant === 'drawer') {
    return (
      <Box display="flex" alignItems="center" pt={1}>
        <Box>
          <IconButton onClick={onClose}>
            <ArrowBackOutlinedIcon />
          </IconButton>
        </Box>
        <Box flexGrow={1} textAlign="left">
          <Typography variant="body1" fontWeight={500}>
            {t('Add Token')}
          </Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} textAlign="left" ml={3}>
        {t('Add Token')}
      </Box>
      <Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const Body: FC<PartsProps> = ({ onClose, variant }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IMarketSource[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<FavoriteItem[]>([]);

  const search = async (_query: string): Promise<void> => {
    setSearchResults([]);
    setSelectedTokens([]);
    setLoading(true);
    if (_query?.length <= 1) {
      return;
    }
    try {
      const queryObj = bodybuilder();

      if (_query) {
        queryObj.addQuery('exists', 'field', 'networks.bnb');
        queryObj.orFilter('wildcard', 'name', `*${_query}*`);
        queryObj.orFilter('wildcard', 'symbol', `*${_query}*`);
      }

      if (isAddress(_query)) {
        queryObj.orFilter('wildcard', 'networks.bnb.address', _query.toLowerCase());
      }

      queryObj.sort('price_usd.cg', 'desc');

      const qBuilt: any = queryObj.build();
      const q = qBuilt.query;
      const body = {
        query: _isEmpty(q) ? undefined : q,
        size: 5,
        from: 0,
        sort: qBuilt.sort ? qBuilt.sort : [],
      };

      const response = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body);

      const marketsData = response.data;
      const arrayData = _map(marketsData.hits, (item) => item._source);

      setSearchResults(arrayData);
    } catch (error) {
      loggerError('Fetching Market List Failed', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(_debounce(search, 1000), []);

  const handleClearSearchResults = () => setQuery('');

  const handleQueryChange = (event): void => {
    event.stopPropagation();
    setQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  const onAddAddressSuccess = () =>
    enqueueSnackbar('Tokens added successfully.', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      autoHideDuration: 2500,
      variant: 'success',
    });

  const onAddFavoriteTokens = useCallback(() => {
    selectedTokens.forEach((token) => {
      dispatch(addFavorite(token));
    });
    onAddAddressSuccess();
    onClose();
  }, [selectedTokens]);

  return (
    <Grid container spacing={2} p={variant === 'drawer' ? 2 : 0}>
      <Grid item xs={12} width="100%" display="flex" pt="0px !important">
        <TextField
          fullWidth
          name="address"
          margin="dense"
          id="import-wallet"
          variant="outlined"
          placeholder="Search token by name, symbol or contract"
          onChange={handleQueryChange}
          value={query}
          InputProps={{
            startAdornment: (
              <Box mr={1} display="flex">
                <SearchIcon />
              </Box>
            ),
            endAdornment: query ? (
              <Box display="flex" pr={0}>
                <IconButton
                  onClick={handleClearSearchResults}
                  sx={{
                    paddingRight: '0px',
                    color: theme.palette.text.primary,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : null,
          }}
          sx={{
            '& > div > input': {
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '20px',
              color: (theme as any).palette.neutral[900],
            },
          }}
        />
      </Grid>
      {loading && query.length > 2 ? (
        <Box display="flex" sx={{ justifyContent: 'center', width: 'inherit' }} my={2}>
          <CircularProgress />
        </Box>
      ) : null}
      {!loading && searchResults.length > 0 ? (
        <>
          <TokenList
            searchResults={searchResults}
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />
        </>
      ) : null}
      {!loading ? (
        <Grid item xs={12} display="flex">
          <Button
            fullWidth
            variant="outlined"
            disabled={selectedTokens.length === 0}
            onClick={onAddFavoriteTokens}
            sx={{
              border: 'none',
              borderRadius: '10px',
              padding: `8px ${theme.spacing(3)}`,
              color: (theme as any).palette.primary[400],
              background: (theme as any).palette.primary[50],
              '&:hover': {
                background: hexToRGB((theme as any).palette.primary[50], 0.5),
                border: 'none',
              },
              '&.Mui-disabled': {
                border: 'none',
                background: (theme as any).palette.neutral[200],
                color: (theme as any).palette.neutral[0],
              },
            }}
          >
            {selectedTokens.length > 1 ? `${t('Add token')}s` : t('Add token')}
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};

interface ImportFavoriteTokenProps extends DialogProps {
  onClose: () => void;
  variant: 'dialog' | 'drawer';
}

export const ImportFavoriteToken: FC<ImportFavoriteTokenProps> = ({ onClose, variant, ...rest }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [openDrawer, setOpenDrawer] = useState(true);

  const handleToggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  if (variant === 'drawer')
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={openDrawer}
        onClose={onClose}
        onOpen={handleToggleDrawer}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <Head onClose={onClose} variant={variant} />
        <Divider flexItem variant="middle" sx={{ marginBottom: theme.spacing(1) }} />
        <Body onClose={onClose} variant={variant} />
      </SwipeableDrawer>
    );

  return (
    <Dialog
      {...rest}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={!isSmallScreen}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
        },
      }}
    >
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Head onClose={onClose} variant={variant} />
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Body onClose={onClose} variant={variant} />
      </DialogContent>
    </Dialog>
  );
};
