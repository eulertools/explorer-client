import { ExtendedTheme, LogoEuler } from '@eulertools/ui';
import { useEffect, useMemo, useRef, FC, MutableRefObject, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { SwitchAccount } from '@material-ui/icons';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import TelegramIcon from '@material-ui/icons/Telegram';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import NavSection from 'src/components/NavSection';
import Scrollbar from 'src/components/Scrollbar';
import AuthButton from 'src/components/authentication/AuthButton';
import CoinSummaryWidget from 'src/components/dashboard/home/CoinSummaryWidget';
import WalletSelector from 'src/components/dashboard/wallet/WalletSelector';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useSettings from 'src/hooks/useSettings';
import MediumIcon from 'src/icons/Medium';
import {
  TokensIcon,
  WorldWideWebIcon,
  MigrationIcon,
  /* FarmsIcon */
} from 'src/icons/svg-icons';

const useStyles = makeStyles((theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    navSection: {
      color: 'black',
    },
    mediaToolbar: {
      zIndex: theme.zIndex.drawer + 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minHeight: '120px',

      [theme.breakpoints.up('lg')]: {
        backgroundColor: theme.palette.background.paper,
      },
      [theme.breakpoints.down('md')]: {
        minHeight: '75px',
      },
    },
    mediaIconButton: {
      margin: '0 6px',
      padding: 0,
    },
    mediaIcon: {
      margin: '6px 0px',
      fontSize: '1.2rem',
      color: theme.palette.primary.main,
    },
    roadmapButton: {
      width: '100%',
      borderRadius: '13px',
      textTransform: 'uppercase',
      background: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    },
    eulerTooltip: {
      position: 'absolute',
      top: '-33px',
      right: '-40px',
    },
  }),
);

const sections = (network: string, featureFlags: { [key: string]: boolean }) => [
  {
    title: '',
    items: [
      {
        title: 'Profiles',
        path: `/profile/me`,
        icon: SwitchAccount,
        forceExactMatch: false,
        disabled: featureFlags.profilesDisabled,
      },
      {
        title: 'Tokens',
        path: `/tokens`,
        icon: TokensIcon,
        forceExactMatch: false,
        disabled: featureFlags.marketsDisabled,
      },
      {
        title: 'Tokens',
        path: `/${network}/token`,
        icon: TokensIcon,
        forceExactMatch: false,
        disabled: !featureFlags.marketsDisabled,
      },
      {
        title: 'Swap',
        path: `/${network}/swap`,
        icon: () => <SwapVertIcon style={{ width: '24px', height: '24px' }} />,
      },
      {
        title: 'Marketplace',
        path: `/${network}/marketplace`,
        icon: () => <ShoppingCartOutlinedIcon style={{ width: '24px', height: '24px' }} />,
        forceExactMatch: false,
      },
      {
        title: 'Assets',
        path: `/${network}/assets`,
        icon: () => <TrendingUpIcon style={{ width: '24px', height: '24px' }} />,
      },
      // Example for anidated sections:
      // {
      //   title: 'Blockchain',
      //   path: `/${network}/blockchain`,
      //   icon: (props) => <BlockchainIcon width="18px" height="20px" {...props} />,
      //   children: [
      //     {
      //       title: 'Transactions',
      //       path: `/${network}/txs`,
      //     },
      //     // {
      //     //   title: 'Accounts',
      //     //   path: `/${network}/accounts`,
      //     // },
      //     // {
      //     //   title: 'Contract',
      //     //   path: `/${network}/contractsVerified`,
      //     // },
      //   ],
      // },
      {
        title: 'Staking',
        path: `/${network}/staking/`,
        icon: () => <MonetizationOnOutlinedIcon style={{ width: '24px', height: '24px' }} />,
      },
      {
        title: 'Migration center',
        path: `/${network}/migration/`,
        icon: () => <MigrationIcon />,
      },
      // {
      //   title: 'Farms',
      //   path: `/${network}/farms`,
      //   icon: FarmsIcon,
      // },
      // {
      //   title: 'Locker',
      //   path: `/${network}/locker`,
      //   icon: () => <MonetizationOnOutlinedIcon style={{ width: '24px', height: '24px' }} />,
      // },
    ],
  },
];

const sectionsMobile = (network: string, featureFlags: { [key: string]: boolean }) => [
  {
    title: '',
    items: [
      {
        title: 'Profiles',
        path: `/profile/me`,
        icon: SwitchAccount,
        forceExactMatch: false,
        disabled: featureFlags.profilesDisabled,
      },
      {
        title: 'Tokens',
        path: `/tokens`,
        icon: TokensIcon,
        forceExactMatch: false,
        disabled: featureFlags.marketsDisabled,
      },
      {
        title: 'Tokens',
        path: `/${network}/token`,
        icon: TokensIcon,
        forceExactMatch: false,
        disabled: !featureFlags.marketsDisabled,
      },
      {
        title: 'Swap',
        path: `/${network}/swap`,
        icon: () => <SwapVertIcon style={{ width: '24px', height: '24px' }} />,
      },
      {
        title: 'Marketplace',
        path: `/${network}/marketplace`,
        icon: () => <ShoppingCartOutlinedIcon style={{ width: '24px', height: '24px' }} />,
        forceExactMatch: false,
      },
      {
        title: 'Assets',
        path: `/${network}/assets`,
        icon: () => <TrendingUpIcon style={{ width: '24px', height: '24px' }} />,
      },
      {
        title: 'Staking',
        path: `/${network}/staking/`,
        icon: () => <MonetizationOnOutlinedIcon style={{ width: '24px', height: '24px' }} />,
      },
      {
        title: 'Migration center',
        path: `/${network}/migration/`,
        icon: () => <MigrationIcon />,
      },
      // {
      //   title: 'Farms',
      //   path: `/${network}/farms`,
      //   icon: FarmsIcon,
      // },
      // {
      //   title: 'Locker',
      //   path: `/${network}/locker`,
      //   icon: () => <MonetizationOnOutlinedIcon style={{ width: '24px', height: '24px' }} />,
      // },
    ],
  },
];

interface IDashboardSidebarContentProps {
  mobileWallet?: MutableRefObject<boolean>;
}

const DashboardSidebarContent: FC<IDashboardSidebarContentProps> = ({ mobileWallet }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const { settings } = useSettings();
  const { featureFlags } = useContext(ConfigurationContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navSections = useMemo(
    () => (isMobile ? sectionsMobile(settings.network, featureFlags) : sections(settings.network, featureFlags)),
    [isMobile, settings.network],
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Hidden mdUp>
        <Box display="flex" alignItems="center" justifyContent="center" px={2} pt={2}>
          <LogoEuler
            linkProps={{
              href: `/${settings.network}`,
              id: 'euler-logo-sidebarnav',
            }}
          />
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box width="100%" display="flex" justifyContent="center" flexDirection="row" pl={3} pr={3} pb={2}>
          <Box mt={2} width="100%">
            <AuthButton variant="contained" fullWidth buttonAvatar />
          </Box>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box px={6} pb={2}>
          <WalletSelector mobileWallet={mobileWallet} />
        </Box>
      </Hidden>
      <Box marginX={3}>
        <Divider />
      </Box>
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box p={1} pt={isMobile ? 0 : 5} pb={isMobile ? 0 : 2}>
          {navSections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              className={classes.navSection}
              sx={{
                '& + &': {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
        <Hidden mdUp>
          <Box width="100%" pb={isMobile ? 0 : 2}>
            <CoinSummaryWidget />
          </Box>
        </Hidden>
      </Scrollbar>
      <Toolbar className={classes.mediaToolbar}>
        <Hidden mdDown>
          <Box width="100%">
            <CoinSummaryWidget />
          </Box>
        </Hidden>
        <Box width="100%" marginX={3} marginY={2}>
          <Divider />
        </Box>
        <Box display="flex" flexDirection="row" marginBottom={2}>
          <IconButton className={classes.mediaIconButton} href="https://medium.com/@euler.tools" target="_blank">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="Medium"
            >
              <MediumIcon className={classes.mediaIcon} color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton className={classes.mediaIconButton} href="https://github.com/eulertools" target="_blank">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="GitHub"
            >
              <GitHubIcon className={classes.mediaIcon} color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton className={classes.mediaIconButton} href="https://t.me/eulertools" target="_blank">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="Telegram"
            >
              <TelegramIcon className={classes.mediaIcon} color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton className={classes.mediaIconButton} href="https://twitter.com/eulertools" target="_blank">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="Twitter"
            >
              <TwitterIcon className={classes.mediaIcon} />
            </Tooltip>
          </IconButton>
          <IconButton className={classes.mediaIconButton} href="https://eulertools.solutions/" target="_blank">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="eulertools.solutions"
              classes={{ tooltip: classes.eulerTooltip }}
            >
              <div>
                <WorldWideWebIcon htmlColor={theme.palette.primary.main} height="19.2px" width="19.2px" />
              </div>
            </Tooltip>
          </IconButton>
          <IconButton
            className={classes.mediaIconButton}
            href="https://www.youtube.com/channel/UC7DdHMPyVyqOIFfQ-SNx3mg"
            target="_blank"
          >
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="YouTube"
            >
              <YouTubeIcon className={classes.mediaIcon} color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton
            className={classes.mediaIconButton}
            href="https://www.linkedin.com/company/eulertools/"
            target="_blank"
          >
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title="LinkedIn"
            >
              <LinkedInIcon className={classes.mediaIcon} color="primary" />
            </Tooltip>
          </IconButton>
        </Box>
      </Toolbar>
    </Box>
  );
};

interface DashboardSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const DashboardSidebar = (props: DashboardSidebarProps) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const mobileWallet = useRef(true);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: 280,
            },
          }}
          variant="temporary"
        >
          <DashboardSidebarContent mobileWallet={mobileWallet} />
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              height: 'calc(100% - 50px) !important',
              top: '50px !Important',
              width: 250,
            },
          }}
          variant="persistent"
        >
          <DashboardSidebarContent />
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
