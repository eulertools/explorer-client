import sanitizeHtml from 'sanitize-html';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import useSettings from 'src/hooks/useSettings';
import { MediumArticle } from 'src/types/communities';
import { EulerSpoiler } from 'src/ui/EulerSpoiler';

const useStyles = makeStyles((theme) =>
  createStyles({
    mainContainer: {
      padding: '0px 24px 0px 24px !important',
      '&:hover': {
        background: '#f5f8fa',
      },
    },
    darkTheme: {
      '&:hover': {
        background: 'rgba(25,30,35,.61)',
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
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    imageGrid: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      '& > img': {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      },
    },
    tweetTitle: {
      fontWeight: 'bold',
      '& > span': {
        fontWeight: 'normal',
      },
    },
  }),
);

interface IArticleProps {
  article: MediumArticle;
}

const Article: FC<IArticleProps> = ({ article }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const { t } = useTranslation();
  return (
    <Grid
      className={
        settings.theme === 'DARK' ? `${classes.mainContainer} ${classes.darkTheme}` : `${classes.mainContainer}`
      }
      item
      display="flex"
      flexDirection="column"
      width="100%"
    >
      <Grid item xs={12} pb={2} mt={1}>
        <Box>
          <Typography variant="subtitle2">{article.pubDate.slice(0, 10)}</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="h4">{article.title}</Typography>
        </Box>
        <Box display="inline-flex" mb={1}>
          <Typography className={classes.tweetTitle}>
            <span>{t('Author')}:</span> {article.author}
          </Typography>
        </Box>
        <Box mb={1}>
          <EulerSpoiler
            link={article.link}
            characters={150}
            content={sanitizeHtml(article.content, {
              allowedTags: [],
              allowedAttributes: {},
            })}
          />
        </Box>
      </Grid>
      <Grid className={classes.imageGrid} item xs={12} pb={1}>
        {article.thumbnail ? <img src={article.thumbnail} alt={article.title} /> : <ScreenSpinner />}
      </Grid>
      <Grid item xs={12} mb={1}>
        <Link target="_blank" href={article.link}>
          {t('Read more')}
        </Link>
      </Grid>
      <Grid item xs={12} mt={1}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default Article;
