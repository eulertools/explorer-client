import React, { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import InternalRedirectButtonsGroup from './InternalRedirectButtonsGroup';
import SearchBarInput from './SearchBarInput';
import SearchResultGroup from './SearchResultGroup';
import { IButtonsVisibility } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchField: {
      height: '56px',
      '&>div': {
        borderRadius: '100px',
      },
    },
    searchInput: {
      paddingLeft: theme.spacing(2),
    },
    searchButton: {
      background: `linear-gradient(89.46deg, ${theme.palette.primary.main} 0.02%, ${theme.palette.primary.light} 93.02%)`,
      marginLeft: theme.spacing(2),
      '& > span': {
        height: '35px',
        width: '35px',
        '& > svg': {
          color: theme.palette.primary.contrastText,
        },
      },
    },
    loadingBox: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      top: '40vh',
    },
    toggle: {
      marginRight: '0.5rem',
    },
    closeButtonBox: {
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
      '& > div': {
        display: 'flex',
        justifyContent: 'flex-end',
        '& > button': {
          padding: 0,
        },
      },
    },
    resultContainer: {
      paddingRight: '16px',
      [theme.breakpoints.down('md')]: {
        paddingRight: 0,
      },
    },
  }),
);

interface SearchDrawerProps {
  isOpen: boolean;
  closeDrawer: () => void;
}

const defaultRedirectButtonsVisibility = {
  transaction: false,
  address: false,
  wallet: false,
  block: false,
};

const SearchDrawer: FC<SearchDrawerProps> = ({ isOpen, closeDrawer }) => {
  const classes = useStyles();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [internalRedirectButtons, setInternalRedirectButtons] = useState<IButtonsVisibility>(
    defaultRedirectButtonsVisibility,
  );

  const handleCloseDrawer = () => {
    setSearchResults(null);
    setQuery('');
    setInternalRedirectButtons(() => ({ ...defaultRedirectButtonsVisibility }));
    closeDrawer();
  };

  const onResultsChange = React.useCallback((_results, _internalRedirectButtons) => {
    setSearchResults(_results);
    setInternalRedirectButtons(_internalRedirectButtons);
  }, []);

  const onQueryChange = React.useCallback((_query) => {
    if (_query) {
      setQuery(_query);
    }
  }, []);

  return (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={handleCloseDrawer}
      ModalProps={{ BackdropProps: { invisible: true } }}
      PaperProps={{
        sx: { width: '100%', height: '100vh' },
      }}
      variant="temporary"
    >
      <Box className={classes.closeButtonBox}>
        <Box>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>
      <Box pt={0} pb={3} py={3}>
        <Container maxWidth="md">
          <SearchBarInput onQueryChange={onQueryChange} onResultsChange={onResultsChange} />
        </Container>
        <Container className={classes.resultContainer} maxWidth="xl">
          <InternalRedirectButtonsGroup
            id={query}
            buttonsVisibility={internalRedirectButtons}
            closeDrawer={handleCloseDrawer}
          />
          <SearchResultGroup results={searchResults} closeDrawer={handleCloseDrawer} />
        </Container>
      </Box>
    </Drawer>
  );
};

export default SearchDrawer;
