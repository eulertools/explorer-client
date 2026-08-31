import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RocketImage from 'src/assets/Rocket.png';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectAccountSubscription } from 'src/selectors/account';
import slice, { getPortfolios, setCurrentPortfolio } from 'src/slices/user/portfolios';
import { useSelector } from 'src/store';
import CreatePortfolioDialog from './CreatePortfolioDialog';
import PortfolioDetails from './portfolioDetails/PortfolioDetail';
import PortfolioSettingsMenu from './portfolioDetails/components/SettingsMenu';

const CREATE_PORTFOLIO_OPTION = 'create-portfolio';

const useStyles = makeStyles((theme) => ({
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
  startIcon: {
    marginRight: '10px',
    marginLeft: '10x',
    '& > svg:nth-of-type(1)': {
      fontSize: '30px',
    },
  },
  listText: {
    color: theme.palette.text.primary,
  },
}));

const PortfolioContent = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const { portfolios, loading, selected } = useSelector((state) => state.portfolios);
  const subscription = useSelector(selectAccountSubscription);

  const [openAddPortfolioDialog, setOpenAddPortfolioDialog] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    dispatch(getPortfolios(false));

    return () => {
      dispatch(slice.actions.setCurrentPortfolio(null));
    };
  }, []);

  function onAddPortfolio() {
    setOpenAddPortfolioDialog(true);
  }

  function onCloseAddPortfolioDialog() {
    setOpenAddPortfolioDialog(false);
  }

  const handleChange = (identifier: string) => {
    if (identifier === CREATE_PORTFOLIO_OPTION) {
      onAddPortfolio();
      setOpen(false);
      return;
    }
    dispatch(setCurrentPortfolio(portfolios.find((p) => p.identifier === identifier)));
    setOpen(false);
  };

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

  // This is to avoid adding more code to the portfolio slice but basically if it was a success
  // we should always have the oldest portfolio as selected coming to this tab
  if (loading || (portfolios.length && !selected)) {
    return (
      <Grid item xs={12} alignItems="center" justifyContent="center" display="flex" height="calc(100vh - 230px)">
        <CircularProgress />
      </Grid>
    );
  }

  if (!portfolios.length) {
    return (
      <Grid marginTop={8} justifyContent="center" alignItems="center" display="flex" flexDirection="column">
        <img src={RocketImage} alt="rocket" />
        <Typography style={{ fontWeight: 600, marginBottom: 12 }} color="textPrimary">
          {t('PORTFOLIOS.NO_PORTFOLIO_MESSAGE')}
        </Typography>
        <div>
          <Button variant="outlined" color="primary" size="large" onClick={onAddPortfolio}>
            <AddIcon fontSize="small" /> {t('PORTFOLIOS.CREATE_PORTFOLIO')}
          </Button>
        </div>
        {openAddPortfolioDialog ? <CreatePortfolioDialog onClose={onCloseAddPortfolioDialog} /> : null}
      </Grid>
    );
  }

  const selectedId = selected.identifier;
  // This is the total amount of portfolios the user is able to create based on the
  // subscription, if everything fails allow to create 3
  const totalPortfoliosAllowed = subscription.permissions?.portfolios ?? 3;

  return (
    <>
      <Grid display="flex" justifyContent="flex-start" alignItems="center" paddingBottom={1}>
        <Button
          ref={anchorRef}
          classes={{ startIcon: classes.startIcon }}
          className={clsx(classes.buttons, classes.listText)}
          size="large"
          variant="outlined"
          endIcon={
            open ? (
              <ChevronUpIcon className={classes.listText} fontSize="large" />
            ) : (
              <ChevronDownIcon className={classes.listText} fontSize="large" />
            )
          }
          onClick={handleToggle}
        >
          {selected.name}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          className={isMobile ? classes.popper : null}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="network-menu" onKeyDown={handleListKeyDown}>
                    {/* If user had a subscription and more portfolios before, only
                     allow them to pick from oldest-newest the default amount */}
                    {portfolios?.slice(0, totalPortfoliosAllowed).map((p) => (
                      <ListItem key={p.identifier} button onClick={() => handleChange(p.identifier)}>
                        <ListItemText className={classes.listText} primary={p.name} />
                      </ListItem>
                    ))}
                    {portfolios.length < totalPortfoliosAllowed ? (
                      <ListItem
                        key={CREATE_PORTFOLIO_OPTION}
                        button
                        onClick={() => handleChange(CREATE_PORTFOLIO_OPTION)}
                      >
                        <ListItemText className={classes.listText} primary={t('PORTFOLIOS.ADD_NEW_PORTFOLIO')} />
                      </ListItem>
                    ) : null}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <PortfolioSettingsMenu portfolioName={selected.name} portfolioId={selectedId} />
      </Grid>
      <PortfolioDetails />
      {openAddPortfolioDialog ? <CreatePortfolioDialog onClose={onCloseAddPortfolioDialog} /> : null}
    </>
  );
};

export default PortfolioContent;
