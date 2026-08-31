import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Timeline } from 'react-twitter-widgets';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TwitterIcon from '@material-ui/icons/Twitter';
import useSettings from 'src/hooks/useSettings';
import CardCommunity from '../CardCommunity';

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadBottom: {
      paddingBottom: '0px',
    },
    mediaIconButton: {
      padding: '2px 12px',
    },
    mediaIcon: {
      margin: '0px 6px',
      fontSize: '1.2rem',
      color: theme.palette.primary.main,
    },
    cardContent: {
      height: '100%',
      '& > div': {
        height: '100%',
      },
    },
    tweetCard: {
      height: '100%',
    },
    gridContent: {
      height: '90%',
      '& > div > div > iframe': {
        borderRadius: '20px 0 0 20px',
      },
    },
  }),
);

interface ITwitterProps {
  profile: string;
}

const Twitter: FC<ITwitterProps> = ({ profile }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settings } = useSettings();

  const initialization = () => {
    const iframe: any = document.getElementById('twitter-widget-0');
    const style = document.createElement('style');
    style.textContent = '.timeline-Tweet-text { font-size: 16px !important; }';
    iframe?.contentDocument.head.appendChild(style);
  };
  return (
    <Grid item xs={12} md={12} lg={6}>
      <Typography variant="h5" color="textPrimary">
        {t('Twitter')}
      </Typography>
      <CardCommunity>
        <>
          <CardHeader className={classes.noPadBottom} />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">{t('Tweets')}</Typography>
                  </Box>
                  <Box>
                    <Button
                      className={classes.mediaIconButton}
                      href={`https://twitter.com/${profile}`}
                      target="_blank"
                      variant="outlined"
                    >
                      <TwitterIcon className={classes.mediaIcon} />
                      {t('Follow')}
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid className={classes.gridContent} item xs={12}>
                <Card className={classes.tweetCard} raised>
                  <Timeline
                    dataSource={{ sourceType: 'profile', url: profile }}
                    options={{
                      theme: `${settings.theme === 'DARK' ? 'dark' : 'light'}`,
                      height: '495px',
                      chrome: 'noheader, nofooter',
                    }}
                    onLoad={initialization}
                  />
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </>
      </CardCommunity>
    </Grid>
  );
};

export default Twitter;
