import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { TokenChart } from 'src/pages/tokens/components/TokenChart';
import { getTokenFavorites } from 'src/selectors/favorites';
import { FavoriteItem, getFavorites } from 'src/slices/user/favorites';
import { useDispatch, useSelector } from 'src/store';
import DashboardCard from 'src/ui/DashboardCard';

const useStyles = makeStyles((theme) => ({
  favoriteButton: {
    width: 'auto',
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.disabled,
    borderRadius: theme.spacing(2),
    whiteSpace: 'nowrap',
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  favoriteDivider: {
    height: '85%',
    display: 'flex',
    alignSelf: 'center',
  },
  favoriteMobileDivider: {
    width: '100%',
  },
  listText: {
    color: theme.palette.text.primary,
  },
}));

export const ChartsCard = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const favoriteTokens = useSelector(getTokenFavorites);
  const { network } = useParams();
  const { chain } = useContext(ConfigurationContext);

  const [favorite, setFavorite] = useState<FavoriteItem>(null);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getFavorites());
    } else if (favorite) {
      setFavorite(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setFavorite(null);
  }, [network]);

  useEffect(() => {
    if (favoriteTokens?.length && favorite === null) {
      setFavorite(favoriteTokens[0]);
    }
  }, [favoriteTokens]);

  const handleFavoriteChange = useCallback(
    (newFavSelected) => {
      const favToken = favoriteTokens.find((f) => f.identifier === newFavSelected);
      if (favToken) {
        setFavorite(favToken);
      }
      setOpen((prevState) => !prevState);
    },
    [favoriteTokens],
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

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <DashboardCard trendingCard>
      {favorite && isAuthenticated ? (
        <>
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
            <Hidden mdDown>
              <Grid container>
                <Grid item>
                  <Typography mr={2} color="textPrimary" fontWeight={700} fontSize="20px">
                    {t('Favorites')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider className={classes.favoriteDivider} orientation="vertical" flexItem />
                </Grid>
                <Grid ml={2}>
                  <Button
                    ref={anchorRef}
                    className={classes.favoriteButton}
                    size="large"
                    variant="outlined"
                    endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
                    onClick={handleToggle}
                  >
                    {favorite.name}
                  </Button>
                </Grid>
              </Grid>
            </Hidden>
            <Hidden mdUp>
              <Grid container>
                <Grid item xs={12}>
                  <Typography mb={2} color="textPrimary" fontWeight={700} fontSize="20px">
                    {t('Favorites')}
                  </Typography>
                </Grid>
                <Grid item xs={12} display="flex">
                  <Divider className={classes.favoriteMobileDivider} orientation="horizontal" flexItem />
                </Grid>
                <Grid mt={2} item xs={12}>
                  <Button
                    ref={anchorRef}
                    className={classes.favoriteButton}
                    size="large"
                    variant="outlined"
                    endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
                    onClick={handleToggle}
                  >
                    {favorite.name}
                  </Button>
                </Grid>
              </Grid>
            </Hidden>
            <Box maxWidth={200} ml={2}>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="search-filter-menu" onKeyDown={handleListKeyDown}>
                          {favoriteTokens?.map((f) => (
                            <ListItem key={f.identifier} button onClick={() => handleFavoriteChange(f.identifier)}>
                              <ListItemText className={classes.listText} primary={f.name} />
                            </ListItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Box>
          <Box height="100%">
            <TokenChart name={favorite.symbol} symbol={favorite.symbol} tokenContract={favorite.address} />
          </Box>
        </>
      ) : (
        <TokenChart
          name={chain[network].tokens.btc.symbol}
          symbol={chain[network].tokens.btc.symbol}
          tokenContract={chain[network].tokens.btc.address}
        />
      )}
    </DashboardCard>
  );
};
