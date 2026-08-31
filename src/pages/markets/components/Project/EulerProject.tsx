import { FC, useContext } from 'react';
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
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import Telegram from 'src/ui/eulerCommunity/Telegram/Telegram';
import Twitter from 'src/ui/eulerCommunity/Twitter/Twitter';

const useStyles = makeStyles((theme) =>
  createStyles({
    baseCard: {
      minHeight: '100%',
    },
    aboutCard: {
      marginTop: theme.spacing(4),
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
      '& a': {
        color: theme.palette.primary.main,
      },
    },
  }),
);

const EulerProject: FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { chain } = useContext(ConfigurationContext);

  return (
    <div className={classes.container}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card className={classes.baseCard}>
            <CardHeader className={classes.noPadBottom} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <b>{t('Website')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Link target="_blank" href="https://euler.tools/" rel="noreferrer">
                        https://euler.tools
                      </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>{t('Source Code')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Link target="_blank" href="https://github.com/eulertools">
                        Github
                      </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>{t('Explorers')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={6} md={6} key={0}>
                          <Link
                            className={classes.explorer}
                            target="_blank"
                            rel="noopener"
                            href={`https://bscscan.com/token/${chain.bsc.tokens.euler.address}`}
                          >
                            Bscscan
                          </Link>
                          &nbsp;&nbsp;
                          <br />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className={classes.baseCard}>
            <CardHeader className={classes.noPadBottom} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <b>{t('Contract')}</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      --
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>Litepaper</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Link target="_blank" href="https://euler.tools/documentation/Litepaper.pdf">
                        Litepaper
                      </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <b>Presskit</b>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Link target="_blank" href="https://euler.tools/documentation/Presskit.pdf">
                        Presskit
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card className={classes.aboutCard}>
        <CardHeader className={classes.noPadBottom} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Typography variant="h6" mb={1}>
                {t('About')} Euler Tools
              </Typography>
              <Box className={classes.description}>
                Euler.Tools is a new way to understand the blockchain. We are translating the complex architecture into
                delightful and reusable data representations that should provide insight on the transactions. Starting
                with our Euler explorer, and moving towards a trading interface, we will introduce a smooth user
                experience focused on explaining the blockchain. Backed by a utility token that can be used both for
                payments or liquidity mining, we will create a deflationary mechanism by buying back tokens and burning
                them.
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={4} mt={1}>
        <Twitter profile="EulerTools" />
        <Telegram channelUrl="eulertools_news" />
      </Grid>
    </div>
  );
};

export default EulerProject;
