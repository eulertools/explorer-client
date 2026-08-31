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
import { IMarketSource } from 'src/types/market';

interface IProjectProps {
  market: IMarketSource;
}

const Project: FC<IProjectProps> = ({ market }) => {
  const { t } = useTranslation();

  // Obtain the domain name from the url.
  /* eslint-disable-next-line no-useless-escape */
  const regularExpression = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)()/gim;
  const reduceURL = (url: string) =>
    url.replace(regularExpression, '$1').replace(url.replace(regularExpression, '$2'), '');

  return (
    <Box sx={{ paddingTop: (theme) => theme.spacing(2) }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minHeight: '100%', boxShadow: 'none' }}>
            <CardHeader sx={{ paddingBottom: '0px' }} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Website')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {(market?.links &&
                        market.links.map((homepage) => {
                          if (homepage.kind === 'homepage') {
                            return (
                              <Link
                                target="_blank"
                                href={homepage.url}
                                rel="noreferrer"
                                sx={{
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  lineHeight: '17px',
                                }}
                              >
                                {reduceURL(homepage.url) || '--'}
                              </Link>
                            );
                          }
                          return null;
                        })) ||
                        '--'}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Source Code')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        {(market?.links &&
                          market.links.map((repos) => {
                            if (repos.kind === 'repo') {
                              return (
                                <Grid item xs={6} key={repos.url}>
                                  <Link
                                    target="_blank"
                                    href={repos.url}
                                    sx={{
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      display: 'inline',
                                      wordBreak: 'break-word',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      lineHeight: '17px',
                                    }}
                                  >
                                    {reduceURL(repos.url) || '--'}
                                  </Link>
                                </Grid>
                              );
                            }
                            return null;
                          })) ||
                          '--'}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Blockchain Explorers')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        {(market?.links &&
                          market.links.map((explorer) => {
                            if (explorer.kind === 'blockchain_site') {
                              return (
                                <Grid item xs={12} md={6} key={explorer.url}>
                                  <Link
                                    target="_blank"
                                    href={explorer.url}
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: 'inline',
                                      wordBreak: 'break-word',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      lineHeight: '17px',
                                    }}
                                  >
                                    {reduceURL(explorer.url) || '--'}
                                  </Link>
                                  &nbsp;&nbsp;
                                  <br />
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
        <Grid item xs={12} sm={6}>
          <Card sx={{ minHeight: '100%', boxShadow: 'none' }}>
            <CardHeader sx={{ paddingBottom: '0px' }} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Contract')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {(market?.networks?.bnb?.address && (
                        <Grid item xs={6}>
                          <Link
                            target="_blank"
                            href={`https://bscscan.com/address/${market.networks.bnb.address}#code`}
                            sx={{
                              fontSize: '13px',
                              fontWeight: '500',
                              lineHeight: '17px',
                            }}
                          >
                            bscscan.com
                          </Link>
                        </Grid>
                      )) ||
                        '--'}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Whitepaper')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        {(market?.links &&
                          market.links.map((doc) => {
                            if (doc.kind === 'technical_doc') {
                              return (
                                <Grid item xs={6} key={doc.url}>
                                  <Link
                                    target="_blank"
                                    href={doc.url}
                                    sx={{
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      display: 'inline',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      lineHeight: '17px',
                                    }}
                                  >
                                    {reduceURL(doc.url) || '--'}
                                  </Link>
                                </Grid>
                              );
                            }
                            return null;
                          })) ||
                          '--'}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('Category')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        {(market?.tags &&
                          market.tags.map((category) => {
                            if (category) {
                              return (
                                <Grid item xs={12} key={category}>
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      lineHeight: '17px',
                                    }}
                                  >
                                    {category}
                                  </Typography>
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
        {market.description ? (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 'none' }}>
              <CardHeader sx={{ paddingBottom: '0px' }} />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6">
                      <Typography
                        sx={{
                          color: (theme) => (theme as any).palette.terciary[700],
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '17px',
                        }}
                      >
                        {t('About')} {market?.name}
                      </Typography>
                    </Typography>
                    <Box
                      sx={{
                        paddingTop: (theme) => theme.spacing(2),
                        '& a': {
                          color: (theme) => theme.palette.primary.main,
                        },
                        fontSize: '13px',
                        fontWeight: '400',
                        lineHeight: '17px',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(market.description, {
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
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
};

export default Project;
