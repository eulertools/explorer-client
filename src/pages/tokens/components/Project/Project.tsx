import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import psl from 'psl';
import sanitizeHtml from 'sanitize-html';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import VotingWidget from 'src/components/tokens/VotingWidget/VotingWidget';
import { ISource } from 'src/types/search';
import { EulerError } from 'src/ui/EulerError';
import Medium from 'src/ui/eulerCommunity/Medium/Medium';
import Twitter from 'src/ui/eulerCommunity/Twitter/Twitter';

const useStyles = makeStyles((theme) =>
  createStyles({
    baseCard: {
      minHeight: '100%',
    },
    container: {
      paddingTop: theme.spacing(2),
    },
    noPadBottom: {
      paddingBottom: '0px',
    },
    explorer: {
      textTransform: 'capitalize',
    },
    description: {
      lineHeight: '32px',
      paddingTop: theme.spacing(2),
      '& a': {
        color: theme.palette.primary.main,
      },
    },
  }),
);

interface IProjectProps {
  token: ISource;
}

const Project: FC<IProjectProps> = ({ token }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const twitter = _get(token.coin?.links, 'twitter_screen_name');
  const medium = _get(token.coin?.links, 'announcement_url[0]');
  const github = _get(token.coin?.links, 'repos_url.github[0]');
  const explorers = _get(token.coin?.links, 'blockchain_site');
  const categories = _get(token.coin, 'categories');

  const showTwitter = !_isEmpty(twitter);
  const showMedium = !_isEmpty(medium);
  const showGithub = !_isEmpty(github);
  const showExplorers = !_isEmpty(explorers);
  const showCategories = !_isEmpty(categories);

  let mediumUser = '';
  if (medium?.indexOf('@') > -1) {
    mediumUser = medium?.substring(medium?.indexOf('@') + 1);
  } else {
    mediumUser = medium?.substring(medium?.indexOf('/') + 2, medium?.indexOf('.'));
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card className={classes.baseCard}>
            <CardHeader className={classes.noPadBottom} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  {!token.coin?.links ? (
                    <EulerError error={t('NO_LINKS')} />
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <b>{t('Website')}</b>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {token.coin?.links?.homepage?.length > 0 ? (
                          <Link target="_blank" href={token.coin?.links?.homepage[0]} rel="noreferrer">
                            {token.coin?.links?.homepage[0] || '--'}
                          </Link>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <b>{t('Source Code')}</b>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {showGithub && (
                          <Link target="_blank" href={github}>
                            Github
                          </Link>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <b>{t('Explorers')}</b>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={1}>
                          {(showExplorers &&
                            explorers.map((explorer) => {
                              if (explorer) {
                                const result = psl.parse(explorer.replace(/^(?:https?:\/\/)?([^/]+).*/gi, '$1'));
                                if (!result.error) {
                                  const { sld } = result;
                                  return (
                                    <Grid item xs={6} md={6} key={sld}>
                                      <Link className={classes.explorer} target="_blank" href={explorer}>
                                        {sld}
                                      </Link>
                                      &nbsp;&nbsp;
                                      <br />
                                    </Grid>
                                  );
                                }
                              }
                              return null;
                            })) ||
                            '--'}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader className={classes.noPadBottom} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <b>{t('Contract')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      --
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>{t('Whitepaper')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      --
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>{t('Category')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        {(showCategories &&
                          categories.map((category) => {
                            if (category) {
                              return (
                                <Grid item xs={12} key={category}>
                                  {category}
                                </Grid>
                              );
                            }
                            return null;
                          })) ||
                          '--'}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box paddingY={3}>
        <VotingWidget itemName={token.address} itemType="project" />
      </Box>
      {token.coin?.description ? (
        <Card>
          <CardHeader className={classes.noPadBottom} />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <Typography variant="h6">
                  {t('About')} {token.name}
                </Typography>
                <div
                  className={classes.description}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(token.coin?.description, {
                      allowedTags: ['b', 'i', 'em', 'strong', 'a'],
                      allowedAttributes: {
                        a: ['href', 'target'],
                      },
                    }),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}
      <Grid container spacing={4} mt={1}>
        {showTwitter ? <Twitter profile={twitter} /> : null}
        {showMedium ? <Medium user={mediumUser} /> : null}
      </Grid>
    </div>
  );
};

export default Project;
