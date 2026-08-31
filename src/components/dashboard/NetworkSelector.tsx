import { useWeb3React } from '@web3-react/core';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { settingsSupportedNetworks } from 'src/types/blockchain';
import { setNetwork } from 'src/utils/network';

export const useStyles = makeStyles((theme) => ({
  buttons: {
    width: 'auto',
    borderRadius: theme.spacing(2),
    padding: `4px ${theme.spacing(2)}`,
    [theme.breakpoints.down('sm')]: {
      width: 'min(90px, 100%)',
    },
  },
  popper: {
    zIndex: 1,
    width: '100%',
    transform: 'translate(0px, 161px)',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  sidebarButton: {
    borderRadius: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  startIcon: {
    marginRight: '10px',
    marginLeft: '10x',
    '& > svg:nth-of-type(1)': {
      fontSize: '30px',
    },
  },
  networkIcon: {
    padding: 7.5,
    backgroundColor: '#fff',
    border: `1.5px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: '#fff',
      opacity: 0.75,
    },
    '& > span > svg': {
      color: theme.palette.primary.main,
    },
  },
  listText: {
    color: theme.palette.text.primary,
  },
}));

export const ButtonNetworkSelector = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { settings, saveSettings } = useSettings();
  const { network: paramNetwork } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { account } = useWeb3React();

  const [currentNetwork, setCurrentNetwork] = useState(
    settingsSupportedNetworks.find((n) => n.value === paramNetwork) ||
      settingsSupportedNetworks.find((n) => n.value === settings.network) ||
      settingsSupportedNetworks[0],
  );
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNetworkChange = useCallback(
    async (network) => {
      if (settings.network !== network) {
        if (account) {
          const provider = window.ethereum;
          if (provider) {
            setNetwork(network);
          }
        }

        saveSettings({
          ...settings,
          network: network.value,
        });

        setCurrentNetwork(network);

        navigate(location.pathname.replace(paramNetwork, network.value), { replace: false });
      }
      setOpen((prevState) => !prevState);
    },
    [settings, location.pathname, account],
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

  return (
    <Box width={isMobile ? '100%' : 'auto'}>
      <Hidden mdUp>
        <Button
          ref={anchorRef}
          classes={{ startIcon: classes.startIcon }}
          className={classes.sidebarButton}
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<img src={currentNetwork.iconSrc} alt="selected-network-logo" width={24} height={24} />}
          endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
          onClick={handleToggle}
        >
          {currentNetwork.shortLabel}
        </Button>
      </Hidden>
      <Hidden mdDown>
        <Button
          ref={anchorRef}
          classes={{ startIcon: classes.startIcon }}
          className={classes.buttons}
          size="large"
          variant="outlined"
          startIcon={<img src={currentNetwork.iconSrc} alt="selected-network-logo" width={24} height={24} />}
          endIcon={open ? <ChevronUpIcon fontSize="large" /> : <ChevronDownIcon fontSize="large" />}
          onClick={handleToggle}
        >
          {currentNetwork.shortLabel}
        </Button>
      </Hidden>
      <Popper
        transition
        disablePortal
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
                  {settingsSupportedNetworks?.map((network) => (
                    <ListItem key={network.shortLabel} button onClick={() => handleNetworkChange(network)}>
                      <ListItemIcon>
                        <img src={network.iconSrc} alt="network-logo" width={24} height={24} />
                      </ListItemIcon>
                      <ListItemText className={classes.listText} primary={network.label} />
                    </ListItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
