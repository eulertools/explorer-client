import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import DiscordIcon from 'src/icons/svg-icons/DiscordIcon';
import FacebookIcon from 'src/icons/svg-icons/FacebookIcon';
import MediumIcon from 'src/icons/svg-icons/MediumIcon';
import RedditIcon from 'src/icons/svg-icons/RedditIcon';
import TelegramIcon from 'src/icons/svg-icons/TelegramIcon';
import TwitterIcon from 'src/icons/svg-icons/TwitterIcon';
import { ISource } from 'src/types/search';

const useStyles = makeStyles((theme) => ({
  mediaGrid: {
    display: 'flex',
    flexGrow: 1,
    '& > button': {
      padding: theme.spacing(1),
    },
  },
}));

interface ITokenSocialMediaProps {
  token: ISource;
  isMobile?: boolean;
}

const TokenSocialMedia: FC<ITokenSocialMediaProps> = ({ token, isMobile = false }) => {
  const classes = useStyles();

  const reddit = _get(token.coin?.links, 'subreddit_url');
  const twitter = _get(token.coin?.links, 'twitter_screen_name');
  const facebook = _get(token.coin?.links, 'facebook_username');
  const telegram = _get(token.coin?.links, 'telegram_channel_identifier');
  const discord = _get(token.coin?.links, 'chat_url[0');
  const medium = _get(token.coin?.links, 'announcement_url[0]');

  const showReddit = !_isEmpty(reddit);
  const showTwitter = !_isEmpty(twitter);
  const showFacebook = !_isEmpty(facebook);
  const showTelegram = !_isEmpty(telegram);
  const showDiscord = !_isEmpty(discord);
  const showMedium = !_isEmpty(medium);

  return (
    <Grid item mt={isMobile ? 1 : 0} justifyContent={isMobile ? 'center' : 'flex-start'} className={classes.mediaGrid}>
      {isMobile ? null : <Divider style={{ height: 40, alignSelf: 'center' }} orientation="vertical" flexItem />}
      {showTelegram ? (
        <Tooltip title="Telegram">
          <IconButton aria-label="Telegram" onClick={() => window.open(`https://telegram.me/${telegram}`, '_blank')}>
            <TelegramIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {showFacebook ? (
        <Tooltip title="Facebook">
          <IconButton
            aria-label="Facebook"
            onClick={() => window.open(`https://www.facebook.com/${facebook}`, '_blank')}
          >
            <FacebookIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {showTwitter ? (
        <Tooltip title="Twitter">
          <IconButton aria-label="Twitter" onClick={() => window.open(`https://twitter.com/${twitter}`, '_blank')}>
            <TwitterIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {showMedium ? (
        <Tooltip title="Medium">
          <IconButton aria-label="Medium" onClick={() => window.open(medium, '_blank')}>
            <MediumIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {showReddit ? (
        <Tooltip title="Reddit">
          <IconButton aria-label="Reddit" onClick={() => window.open(reddit, '_blank')}>
            <RedditIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {showDiscord ? (
        <Tooltip title="Discord">
          <IconButton aria-label="Discord" onClick={() => window.open(discord, '_blank')}>
            <DiscordIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Grid>
  );
};

export default TokenSocialMedia;
