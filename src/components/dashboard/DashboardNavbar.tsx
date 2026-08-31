import { LogoEuler } from '@eulertools/ui';
import { FC, useContext } from 'react';
import { AppBarProps, useMediaQuery, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, Theme, createStyles, experimentalStyled } from '@material-ui/core/styles';
import AuthButton from 'src/components/authentication/AuthButton';
import SearchBar from 'src/components/dashboard/search/SearchBar';
import DashboardSettingsDrawer from 'src/components/dashboard/settings/DashboardSettingsDrawer';
import SettingsMenu from 'src/components/dashboard/settings/SettingsMenu';
import WalletSelector from 'src/components/dashboard/wallet/WalletSelector';
import { NotificationsMenu } from 'src/components/notifications';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import MenuIcon from 'src/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    metamask: {
      '& > button': {
        padding: '3.125px 6px',
      },
      '& .metamask-connector > button': {
        backgroundColor: theme.palette.primary.main,
      },
      '& .metamask-connector > button > span > p': {
        textTransform: 'uppercase',
        color: theme.palette.primary.contrastText,
        fontWeight: 700,
      },
    },
    selectInput: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  }),
);

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  boxShadow: `0px -1px 0px 0px ${theme.palette.divider} inset`,
  zIndex: theme.zIndex.drawer + 100,
  padding: theme.spacing(0, 0),
  boxSizing: 'border-box',
  height: '80px',
  justifyContent: 'center',
}));

const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { settings } = useSettings();
  const { featureFlags } = useContext(ConfigurationContext);
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const classes = useStyles();

  const mobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other} id="navbar-root">
      <Toolbar style={{ minHeight: 50 }}>
        <Hidden lgUp>
          <IconButton color="primary" onClick={onSidebarMobileOpen} data-testid="navbar-toggle-menu">
            <MenuIcon fontSize="small" />
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <Box display="flex" data-testid="navbar-logo-container">
            <LogoEuler
              linkProps={{
                href: featureFlags.marketsDisabled ? `/${settings.network}` : `/tokens`,
                id: 'euler-logo-topnavbar',
              }}
            />
          </Box>
        </Hidden>
        <Box mr={2} flexGrow={1} />
        <Box ml={1} width="460px" height="40px" display="flex" alignItems="center">
          <SearchBar />
        </Box>
        <Hidden mdDown>
          <Box flexGrow={1} ml={2} />
        </Hidden>
        <Hidden mdDown>
          <Box>
            <WalletSelector />
          </Box>
        </Hidden>
        <Box ml={2}>
          <NotificationsMenu />
        </Box>
        {isAuthenticated ? null : <Box>{mobileScreen ? <DashboardSettingsDrawer /> : <SettingsMenu />}</Box>}
        <Hidden mdDown>
          <Box className={classes.metamask} ml={1}>
            <AuthButton />
          </Box>
        </Hidden>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
