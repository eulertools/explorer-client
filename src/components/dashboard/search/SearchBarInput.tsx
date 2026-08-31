import bodybuilder from 'bodybuilder';
import _debounce from 'lodash/debounce';
import React, { useCallback, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import Autocomplete from '@material-ui/core/Autocomplete';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import SearchIcon from '@material-ui/icons/Search';
import TokenPairAvatars, { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useSettings from 'src/hooks/useSettings';
import axios from 'src/lib/axios';
import { IMarketSource, ISearchMarkets } from 'src/types/market';
import { IESSearchItem, ISearchTokens, ISource } from 'src/types/search';
import { loggerError } from 'src/utils/logger';
import { isTransaction, isAddress, isBlock } from 'src/utils/stringUtils';
import { ESearchFilter } from './SearchBarInputFilter';
import { IButtonsVisibility } from './types';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    maxWidth: '955px',
    '& .MuiOutlinedInput-root': {
      '& fieldset, &:hover fieldset': {
        border: `1px solid`,
        borderColor: theme.palette.mode === 'light' ? '#d9d9d9' : theme.palette.text.secondary,
        borderRadius: '10px',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '1px',
      },
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: theme.palette.text.secondary,
    },
  },
  autocompleteBar: {
    padding: '0px 6px',
    '& > input': {
      padding: '6.64px 6px',
    },
  },
}));

const defaultRedirectButtonsVisibility = {
  transaction: false,
  address: false,
  wallet: false,
  block: false,
};

interface IInternalRedirect {
  key: string;
  value: string;
  url: string;
}

interface ISearchbarInputProps {
  onResultsChange?: (results: IESSearchItem[], buttons: IButtonsVisibility) => void;
  onQueryChange?: (query: string) => void;
}

export default function SearchBarInput({ onResultsChange, onQueryChange }: ISearchbarInputProps) {
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const classes = useStyles();
  const { settings } = useSettings();
  const { chain, featureFlags } = useContext(ConfigurationContext);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IESSearchItem[]>(null);
  const [internalRedirectButtons, setInternalRedirectButtons] = useState<IButtonsVisibility>(
    defaultRedirectButtonsVisibility,
  );
  const [filterBy] = useState<ESearchFilter>(ESearchFilter.ALL);

  React.useEffect(() => {
    if (isMountedRef.current) {
      onResultsChange?.(searchResults, internalRedirectButtons);
    }
  }, [searchResults]);

  React.useEffect(() => {
    if (isMountedRef.current) {
      onQueryChange?.(query);
    }
  }, [query]);

  const search = async (_query: string, _filterBy: ESearchFilter): Promise<void> => {
    setInternalRedirectButtons(() => ({ ...defaultRedirectButtonsVisibility }));
    setSearchResults(null);

    // Don't search if no user input or we don't have at least 2 characters
    if (_query?.length <= 1) {
      return;
    }

    // Check if it's a transaction
    if (isTransaction(_query)) {
      setInternalRedirectButtons(() => ({ ...defaultRedirectButtonsVisibility, transaction: true }));
    } else if (isAddress(_query)) {
      // Check if it's an address
      setInternalRedirectButtons(() => ({ ...defaultRedirectButtonsVisibility, address: true, wallet: true }));
    } else if (isBlock(_query)) {
      // Check if it's a block (all numbers)
      setInternalRedirectButtons(() => ({ ...defaultRedirectButtonsVisibility, block: true }));
    }

    setIsLoading(true);

    // Use v2 tokens service to search for tokens
    if (!featureFlags.marketsDisabled && new RegExp(/\p{Letter}/gu).test(_query)) {
      try {
        const queryObj = bodybuilder();

        queryObj.orFilter('wildcard', 'name', `*${_query}*`);
        queryObj.orFilter('wildcard', 'symbol', `*${_query}*`);
        queryObj.sort('score.cg.score', 'desc');

        const qBuilt: any = queryObj.build();
        const body = {
          query: qBuilt.query,
          sort: qBuilt.sort,
        };

        const tokensResponse = await axios.publicFetchClient.post<ISearchMarkets>(`v2/tokens`, body);

        const searchResultsData = tokensResponse.data.hits;

        setSearchResults(searchResultsData as any);
        setOpen(true);
      } catch (error) {
        loggerError(error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    try {
      const queryObj = bodybuilder();

      if (_filterBy === ESearchFilter.ALL) {
        queryObj.orQuery('bool', (q) => q.andQuery('term', 'category', 'token').andQuery('exists', 'field', 'coin'));
        // queryObj.orQuery('term', 'category', 'pool');
      }

      if (_filterBy === ESearchFilter.TOKEN) {
        queryObj.query('term', 'category', 'token');
        // Only request verified tokens in search bar
        queryObj.query('exists', 'field', 'coin');
      }

      if (_filterBy === ESearchFilter.PAIR) {
        queryObj.query('term', 'category', 'pool');
      }

      // Look for name or symbol
      queryObj.orFilter('match', 'name', _query);
      queryObj.orFilter('match', 'symbol', _query);
      queryObj.notFilter('terms', 'category', ['lp-token', 'address', 'pair', 'pool']);

      const qBuilt: any = queryObj.build();
      const body = {
        query: qBuilt.query,
        size: 10,
        from: 0,
      };

      // TODO improvement? Cancel token
      const response = await axios.publicFetchClient.post<ISearchTokens>(`search`, body);

      const searchResultsData = response.data.hits;

      setSearchResults(searchResultsData);
      setOpen(true);
    } catch (error) {
      loggerError(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(_debounce(search, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: string): void => {
    event?.stopPropagation();

    setQuery(newValue);
    debouncedSearch(newValue, filterBy);
  };

  const onTakeAction = () => {
    // Check if it's a transaction
    if (isTransaction(query)) {
      navigate(`/${settings.network}/tx/${query}`);
      return;
    }

    // Check if it's an address
    if (isAddress(query)) {
      navigate(`/${settings.network}/address/${query}`);
      return;
    }

    // Check if it's a block (all numbers)
    if (isBlock(query)) {
      navigate(`/${settings.network}/block/${query}`);
    }
  };

  const onSearchInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      onTakeAction();
      setOpen(false);
      debouncedSearch(query, filterBy);
    }
  };

  const onInternalLinkClick = React.useCallback((url: string) => {
    navigate(url);
  }, []);

  const onSearchLinkClick = React.useCallback((source: ISource) => {
    if (featureFlags.marketsDisabled) {
      if (source.category === 'token') {
        if (source.address.toLowerCase() === chain.bsc.tokens.euler.address.toLowerCase()) {
          navigate('/token/euler');
        } else {
          navigate(`/${settings.network}/token/${source.address}`);
        }
      }

      if (source.category === 'pool') {
        navigate(`/${settings.network}/pair/${source.address}`);
      }
    } else {
      navigate(`/tokens/${source.identifier || source.coin?.coin_id}`);
    }

    setOpen(false);
  }, []);

  const options = React.useMemo(() => {
    const optionsWithInternalRedirects: (IESSearchItem | IInternalRedirect)[] = [...(searchResults || [])];

    if (internalRedirectButtons.address) {
      optionsWithInternalRedirects.unshift({
        key: 'internal',
        value: 'Go to address',
        url: `/${settings.network}/address/${query}`,
      });
    }

    if (internalRedirectButtons.block) {
      optionsWithInternalRedirects.unshift({
        key: 'internal',
        value: 'Go to block',
        url: `/${settings.network}/block/${query}`,
      });
    }

    if (internalRedirectButtons.wallet) {
      optionsWithInternalRedirects.unshift({
        key: 'internal',
        value: 'Go to wallet',
        url: `/${settings.network}/wallet/${query}`,
      });
    }

    if (internalRedirectButtons.transaction) {
      optionsWithInternalRedirects.unshift({
        key: 'internal',
        value: 'Go to transaction',
        url: `/${settings.network}/tx/${query}`,
      });
    }

    return optionsWithInternalRedirects;
  }, [searchResults]);

  return (
    <Autocomplete
      className={classes.autocomplete}
      fullWidth
      disableClearable
      selectOnFocus
      freeSolo
      id="asynchronous-searchbar"
      open={open && !onResultsChange}
      onOpen={() => {
        if (searchResults?.length) {
          setOpen(true);
        }
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) =>
        (option as IESSearchItem)._source?.address === (value as IESSearchItem)._source?.address
      }
      options={options}
      filterOptions={(x) => x}
      loading={isLoading}
      popupIcon={null}
      inputValue={query || ''}
      onInputChange={handleQueryChange}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyUp={onSearchInputKeyUp}
          placeholder="Search token"
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                <Box marginX={1} display="flex">
                  <SearchIcon color="primary" />
                </Box>
                {params.InputProps.endAdornment}
              </>
            ),
            className: classes.autocompleteBar,
          }}
        />
      )}
      getOptionLabel={(option) =>
        (option as IESSearchItem)._source?.address ||
        (option as IESSearchItem)._source?.name ||
        (option as IInternalRedirect).value ||
        option.toString()
      }
      renderOption={(props, option) => {
        if ((option as IInternalRedirect).key === 'internal') {
          return (
            <Box {...(props as any)} onClick={() => onInternalLinkClick((option as IInternalRedirect).url)}>
              <LinkIcon />
              <Typography paddingLeft={1} color="textPrimary" fontWeight={700}>
                {(option as IInternalRedirect).value}
              </Typography>
            </Box>
          );
        }

        const source = (option as IESSearchItem)._source;

        return (
          <Box
            {...(props as any)}
            display="flex"
            alignItems="flex-start !important"
            onClick={() => onSearchLinkClick(source)}
          >
            {source?.category === 'pool' ? (
              <TokenPairAvatars
                baseTokenAddress={source?.base_token_address}
                quoteTokenAddress={source?.quote_token_address}
              />
            ) : (
              <AvatarThumbnail
                address={source?.address || ((source as unknown) as IMarketSource)?.networks?.bnb?.address}
              />
            )}
            <Box display="flex" flexDirection="column" marginLeft={1}>
              <Typography color="textPrimary" fontWeight={700}>
                {source?.name}
              </Typography>
              <Typography color="primary" fontSize="12px">
                {source?.address || ((source as unknown) as IMarketSource)?.networks?.bnb?.address}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
