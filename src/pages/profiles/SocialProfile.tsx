import { ChangeEvent, FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import blueGrey from '@material-ui/core/colors/blueGrey';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import gtm from 'src/lib/gtm';
import { selectAccount } from 'src/selectors/account';
import { getMyProfiles } from 'src/slices/user/profile';
import { useDispatch, useSelector } from 'src/store';
import type { Profile } from 'src/types/social';
import { PageTitle } from 'src/ui/PageTitle';
import { loggerError } from 'src/utils/logger';

const SocialProfile: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { user } = useAuth();
  const { profileId } = useParams();
  const account = useSelector(selectAccount);

  const [currentTab, setCurrentTab] = useState<string>('nft-list');
  const [profile, setProfile] = useState<Profile | null>(null);

  const isUserProfile = useMemo(() => profileId === undefined, [profileId]);
  const subName = useMemo(() => account?.subscription?.name, [account]);
  const userName = useMemo(() => user?.email ?? 'N/A', [user]);

  const onSettingsClick = () => navigate('/user/account-settings');
  const onCreateNftClick = () => navigate('/nft/new');

  const getUserProfiles = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        dispatch(getMyProfiles());
      }
    } catch (err) {
      loggerError(err);
    }
  }, [isMountedRef]);

  const onTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
  };

  useEffect(() => {
    if (isUserProfile) {
      getUserProfiles();
    }
  }, [getUserProfiles, isUserProfile]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  if (!profile) {
    setProfile({
      id: '5e86809283e28b96d2d38537',
      avatar: 'https://pbs.twimg.com/profile_images/1530211328744476674/FlCjLScQ_400x400.jpg',
      bio: 'CEO and Founder of Euler Tools Solutions',
      connectedStatus: 'not_connected',
      cover: 'https://pbs.twimg.com/profile_banners/156709375/1643878473/1500x500',
      currentCity: 'Bucharest',
      currentJobCompany: 'Devias IO',
      currentJobTitle: 'CEO at Euler Tools',
      email: 'jane.rotanson@devias.io',
      name: 'Jorge de los Santos',
      originCity: 'Rm. Valcea',
      previousJobCompany: 'Focus Aesthetic Dynamics',
      previousJobTitle: 'UX Designer',
      quote: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
    });
    return null;
  }

  return (
    <>
      <PageTitle pageTitle="Dashboard: Social Profile" />
      <Box
        style={{ backgroundImage: `url(${profile.cover})` }}
        sx={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          height: 200,
          position: 'relative',
          '&:before': {
            backgroundImage: 'linear-gradient(-180deg, rgba(0,0,0,0.00) 58%, rgba(0,0,0,0.32) 100%)',
            content: '" "',
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          },
          '&:hover': {
            '& button': {
              visibility: 'visible',
            },
          },
        }}
      >
        <Avatar
          variant="square"
          sx={{
            border: (theme) => `4px solid ${theme.palette.background.default}`,
            position: 'absolute',
            height: 176,
            width: 176,
            left: 25,
            top: 60,
            borderRadius: '16px',
          }}
        />
        {isUserProfile ? (
          <Button
            variant="contained"
            startIcon={<AddPhotoIcon fontSize="small" />}
            sx={{
              backgroundColor: blueGrey[900],
              bottom: {
                lg: 24,
                xs: 'auto',
              },
              color: 'common.white',
              position: 'absolute',
              right: 24,
              top: {
                lg: 'auto',
                xs: 24,
              },
              visibility: 'hidden',
              '&:hover': {
                backgroundColor: blueGrey[900],
              },
            }}
          >
            {t('Change Banner')}
          </Button>
        ) : null}
      </Box>
      <Grid container display="flex" p={4}>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Box pt={isUserProfile && subName ? 0 : 2}>
            <Typography color="textSecondary" variant="overline">
              {isUserProfile ? subName : null}
            </Typography>
            <Typography color="textPrimary" variant="h5">
              {isUserProfile ? userName : profileId}
            </Typography>
          </Box>
          {isUserProfile ? (
            <Hidden smDown>
              <Box display="flex" alignItems="flex-end" gap={1}>
                <Button onClick={onCreateNftClick} variant="outlined" sx={{ borderRadius: '10px' }}>
                  {t('Create NFT')}
                </Button>
                <IconButton
                  sx={{ padding: 1, backgroundColor: '#E8EAFE', borderRadius: '10px' }}
                  onClick={onSettingsClick}
                >
                  <Tooltip title="Settings">
                    <SettingsOutlinedIcon color="primary" />
                  </Tooltip>
                </IconButton>
              </Box>
            </Hidden>
          ) : null}
        </Grid>
        {isUserProfile ? (
          <Hidden smUp>
            <Grid item xs={12} pt={2}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Button variant="outlined" sx={{ borderRadius: '10px' }}>
                  {t('Create NFT')}
                </Button>
                <IconButton
                  sx={{ padding: 1, backgroundColor: '#E8EAFE', borderRadius: '10px' }}
                  onClick={onSettingsClick}
                >
                  <Tooltip title="Settings">
                    <SettingsOutlinedIcon color="primary" />
                  </Tooltip>
                </IconButton>
              </Box>
            </Grid>
          </Hidden>
        ) : null}
      </Grid>
      <Grid item xs={12} display="flex">
        <Tabs
          indicatorColor="primary"
          onChange={onTabsChange}
          textColor="primary"
          value={currentTab}
          sx={{
            '& .MuiTabs-indicator': {
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              margin: 'auto',
              height: '4px',
              width: 'auto',
              maxWidth: '45px',
            },
          }}
        >
          {[{ label: `${isUserProfile ? 'MY' : 'USER'} NFT'S`, value: 'nft-list' }].map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Grid>
    </>
  );
};

export default SocialProfile;
