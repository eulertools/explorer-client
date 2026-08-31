import { useContext, useState } from 'react';
import Alert from '@material-ui/core/Alert';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { AppSkeleton } from 'src/components/templates';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import DiscordIcon from 'src/icons/svg-icons/DiscordIcon';
import FacebookIcon from 'src/icons/svg-icons/FacebookIcon';
import InstagramIcon from 'src/icons/svg-icons/InstagramIcon';
import LinkedInIcon from 'src/icons/svg-icons/LinkedInIcon';
import MediumIcon from 'src/icons/svg-icons/MediumIcon';
import TelegramIcon from 'src/icons/svg-icons/TelegramIcon';
import TwitterIcon from 'src/icons/svg-icons/TwitterIcon';
import YoutubeIcon from 'src/icons/svg-icons/YoutubeIcon';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import EulerProject from 'src/pages/tokens/components/Project/EulerProject';
import EulerToken from 'src/pages/tokens/components/Token/EulerToken';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerEntityTitle } from 'src/ui/EulerEntityTitle';
import { EulerTabs } from 'src/ui/EulerTabs';
import { PageTitle } from 'src/ui/PageTitle';
import { checksumAddress } from 'src/utils/stringUtils';
import Security from './components/Security/Security';

const useStyles = makeStyles((theme) => ({
  mediaGrid: {
    display: 'flex',
    '& > button': {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down(1010)]: {
      margin: 'auto',
      '& > hr': {
        display: 'none',
      },
    },
  },
}));

const EulerTokenDetail = () => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { chain } = useContext(ConfigurationContext);

  const eulerAddress = chain.bsc.tokens.euler.address;

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Euler Tools (EULER)" />
      <Grid container display="flex">
        <Grid item>
          <EulerEntityTitle
            showButtons
            showAddToken
            title="EULER"
            address={eulerAddress}
            logo={
              <Avatar
                alt="euler-avatar"
                src={`${process.env.REACT_APP_ASSETS_URL}/tokens/bsc/${checksumAddress(eulerAddress)}/logo.png`}
              />
            }
            symbol="EULER"
            favoriteId="euler"
            portfolioName="euler"
            portfolioId={eulerAddress}
            portfolioEntity={EPortfolioItemType.TOKEN}
            decimals={18}
          />
        </Grid>
        <Grid item pb={2} className={classes.mediaGrid}>
          <Divider style={{ height: 40, alignSelf: 'center' }} orientation="vertical" flexItem />
          <Tooltip title="Telegram">
            <IconButton aria-label="Telegram" onClick={() => window.open('https://telegram.me/eulertools', '_blank')}>
              <TelegramIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Facebook">
            <IconButton
              aria-label="Facebook"
              onClick={() => window.open('https://www.facebook.com/Euler-Tools-101041785456000', '_blank')}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Instagram">
            <IconButton
              aria-label="Instagram"
              onClick={() => window.open('https://www.instagram.com/eulertools/', '_blank')}
            >
              <InstagramIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Twitter">
            <IconButton aria-label="Twitter" onClick={() => window.open('https://twitter.com/eulertools', '_blank')}>
              <TwitterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <IconButton
              aria-label="LinkedIn"
              onClick={() => window.open('https://www.linkedin.com/company/eulertools/', '_blank')}
            >
              <LinkedInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Youtube">
            <IconButton
              aria-label="Youtube"
              onClick={() => window.open('https://www.youtube.com/channel/UC7DdHMPyVyqOIFfQ-SNx3mg', '_blank')}
            >
              <YoutubeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Medium">
            <IconButton aria-label="Medium" onClick={() => window.open('https://medium.com/@euler.tools', '_blank')}>
              <MediumIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Discord">
            <IconButton aria-label="Discord" onClick={() => window.open('https://discord.gg/GAkQhNTnua', '_blank')}>
              <DiscordIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <EulerTabs titles={['Token', 'Project', 'Security']} selected={selectedTab} setSelected={setSelectedTab} />
        <Grid item xs={12}>
          <BasicTabPanel value={selectedTab} index={0}>
            <>
              <Box mt={2}>
                <Alert severity="info">
                  The information provided here comes from the Build and Build (BNB) since EULER, for now, only lives in
                  this blockchain and has no Wrapped/PEG tokens in other blockchains.
                </Alert>
              </Box>
              <EulerToken />
            </>
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={1}>
            <EulerProject />
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={2}>
            <Security tokenAddress={eulerAddress} />
          </BasicTabPanel>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

const EulerTokenDetailWrapper = () => (
  <CoinDataProvider>
    <EulerTokenDetail />
  </CoinDataProvider>
);

export default EulerTokenDetailWrapper;
