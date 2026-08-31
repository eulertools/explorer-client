import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import useSettings from 'src/hooks/useSettings';
import MediumIcon from 'src/icons/Medium';
import { getArticles } from 'src/slices/tables/medium';
import { useDispatch, useSelector } from 'src/store';
import CardCommunity from '../CardCommunity';
import Article from './Article';

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadBottom: {
      paddingBottom: '0px',
    },
    mediaIconButton: {
      padding: '2px 12px',
      backgroundColor: theme.palette.success.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    },
    mediaIcon: {
      margin: '0px 6px',
      fontSize: '1.2rem',
      color: theme.palette.primary.contrastText,
    },
    cardContent: {
      height: '100%',
      '& > div': {
        height: '100%',
      },
    },
    mediumCard: {
      height: '98%',
      overflowY: 'auto',
    },
    gridContent: {
      height: '90%',
    },
    darkBackground: {
      background: '#292F33',
    },
  }),
);

interface IMediumProps {
  user: string;
}

const Medium: FC<IMediumProps> = ({ user }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { articles, loading = true } = useSelector((state) => state.medium);

  useEffect(() => {
    dispatch(getArticles(user));
  }, []);

  return (
    <Grid item xs={12} md={12} lg={6}>
      <Typography variant="h5" color="textPrimary">
        {t('Medium')}
      </Typography>
      <CardCommunity>
        <>
          <CardHeader className={classes.noPadBottom} />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">{t('Articles')}</Typography>
                  <Button
                    className={classes.mediaIconButton}
                    href={`https://medium.com/@${user}`}
                    target="_blank"
                    variant="contained"
                  >
                    <MediumIcon className={classes.mediaIcon} color="primary" />
                    {t('Follow')}
                  </Button>
                </Box>
              </Grid>
              <Grid className={classes.gridContent} item xs={12}>
                <Card
                  className={
                    settings.theme === 'DARK'
                      ? `${classes.mediumCard} ${classes.darkBackground}`
                      : `${classes.mediumCard}`
                  }
                  raised
                >
                  {loading ? (
                    <ScreenSpinner />
                  ) : (
                    <Grid container display="flex" flexDirection="row" spacing={1}>
                      {Array.isArray(articles)
                        ? articles?.map((article) => <Article key={article.guid} article={article} />)
                        : null}
                    </Grid>
                  )}
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </>
      </CardCommunity>
    </Grid>
  );
};

export default Medium;
