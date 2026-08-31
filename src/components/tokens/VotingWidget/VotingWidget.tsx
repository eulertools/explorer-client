import numeral from 'numeral';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import LoopIcon from '@material-ui/icons/Loop';
import MoodIcon from '@material-ui/icons/Mood';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import useAuth from 'src/hooks/useAuth';
import StartupIcon from 'src/icons/svg-icons/StartupIcon';
import { selectAccount } from 'src/selectors/account';
import { fetchVotes, resetProjectRating, vote } from 'src/slices/user/projects';
import { useDispatch, useSelector } from 'src/store';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: '#E74C3C',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#65B168',
  },
}))(LinearProgress);

const breakpoints = createBreakpoints({});

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadBottom: {
      paddingBottom: '0px',
    },
    buttons: {
      width: 'min(125px, 100%)',
      borderRadius: '100px',
      [theme.breakpoints.down('sm')]: {
        width: 'min(90px, 100%)',
      },
    },
    title: {
      margin: '.5em 0',
    },
    voting: {
      padding: 0,
      justifyContent: 'center',
    },
    startIcon: {
      marginRight: '10px',
      marginLeft: '10x',
      '& > svg:nth-of-type(1)': {
        fontSize: '30px',
      },
    },
    goodIcon: {
      color: theme.palette.success.main,
    },
    badIcon: {
      color: theme.palette.error.main,
    },
    thumbIcons: {
      color: theme.palette.primary.main,
    },
    voteProgress: {
      margin: '0.25em 0 0.75em',
    },
    voteProgressContainer: {
      width: '100%',
    },
    voteNumbers: {
      color: theme.palette.primary.main,
      paddingRight: '0px',
    },
    btnContainer: {
      [breakpoints.down('md')]: {
        paddingBottom: '1em',
      },
    },
    btnGrid: {
      display: 'flex',
      gap: theme.spacing(2),
      flexDirection: 'column',
      justifyContent: 'start',
      paddingLeft: '0px !important',
      paddingRight: '0px',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    btnPercentage: {
      color: theme.palette.text.primary,
      marginLeft: theme.spacing(1),
    },
    btnDisabled: {
      color: `${theme.palette.primary.main} !important`,
    },
    txtGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: '0px !important',
    },
    divider: {
      borderWidth: '1px',
    },
  }),
);

interface IVotingWidgetProps {
  itemName: string;
  itemType: string;
}

const VotingWidget: FC<IVotingWidgetProps> = ({ itemName, itemType }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const classes = useStyles();
  const [myVote, setMyVote] = useState('');
  const { projectRating = null } = useSelector((state) => state.projects);
  const { voting = null } = useSelector((state) => state.channels);
  const account = useSelector(selectAccount);
  const { total = 0, rating = 0 } = useMemo(() => {
    const rate = {
      total: 0,
      rating: 0,
    };

    if (projectRating) {
      const {
        rate: { good = 0, bad = 0 },
      } = projectRating;
      rate.total = good + bad;

      if (rate.total === 0) {
        rate.rating = null;
      }
      if (good === 0) {
        rate.rating = 0;
      }

      rate.rating = (good * 100) / rate.total;
    }

    return rate;
  }, [projectRating]);
  const handleVote = useCallback(
    (item_rate: string, message: string) => {
      if (!projectRating?.voted) {
        setMyVote(message);
        dispatch(vote({ item_name: itemName, item_rate, item_type: itemType }));
      }
    },
    [projectRating],
  );

  useEffect(() => {
    dispatch(
      fetchVotes({
        item_name: itemName,
        item_type: itemType,
        user_sub: user?.id,
      }),
    );

    return () => {
      dispatch(resetProjectRating());
    };
  }, [user, voting]);

  const VoteButtons = () => (
    <>
      {account?.subscription?.name ? (
        <Grid item xs={12} md={5} className={classes.btnContainer}>
          <Grid container>
            <Grid item xs={12} className={classes.btnGrid} order={1}>
              <Hidden smDown>
                <Grid item xs={12} display="flex">
                  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <Button
                      classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                      className={classes.buttons}
                      size="large"
                      variant={projectRating?.voted ? 'text' : 'outlined'}
                      disabled={projectRating?.voted}
                      startIcon={<MoodIcon className={classes.goodIcon} />}
                      onClick={() => handleVote('good', 'Good')}
                    >
                      {t('Good')}
                      {projectRating?.voted ? (
                        <Typography className={classes.btnPercentage}>{rating || 0}%</Typography>
                      ) : null}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <Button
                      classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                      style={{ borderRadius: '100px' }}
                      size="large"
                      variant={projectRating?.voted ? 'text' : 'outlined'}
                      disabled={projectRating?.voted}
                      startIcon={<StartupIcon width={30} height={30} />}
                      onClick={() => handleVote('good', 'To The Moon')}
                    >
                      {t('To The Moon')}
                      {projectRating?.voted ? (
                        <Typography className={classes.btnPercentage}>{rating || 0}%</Typography>
                      ) : null}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12} display="flex" gap={1}>
                  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <Button
                      classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                      className={classes.buttons}
                      size="large"
                      variant={projectRating?.voted ? 'text' : 'outlined'}
                      disabled={projectRating?.voted}
                      startIcon={<MoodBadIcon className={classes.badIcon} />}
                      onClick={() => handleVote('bad', 'Bad')}
                    >
                      {t('Bad')}
                      {projectRating?.voted ? (
                        <Typography className={classes.btnPercentage}>{total - rating || 0}%</Typography>
                      ) : null}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <Button
                      classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                      style={{ borderRadius: '100px' }}
                      size="large"
                      variant={projectRating?.voted ? 'text' : 'outlined'}
                      disabled={projectRating?.voted}
                      startIcon={<TrendingDownIcon className={classes.badIcon} />}
                      onClick={() => handleVote('bad', 'Not Gonna Make It')}
                    >
                      {t('Not Gonna Make It')}
                      {projectRating?.voted ? (
                        <Typography className={classes.btnPercentage}>{total - rating || 0}%</Typography>
                      ) : null}
                    </Button>
                  </Grid>
                </Grid>
              </Hidden>
              <Hidden smUp>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                    className={classes.buttons}
                    size="large"
                    variant={projectRating?.voted ? 'text' : 'outlined'}
                    disabled={projectRating?.voted}
                    startIcon={<MoodIcon className={classes.goodIcon} />}
                    onClick={() => handleVote('good', 'Good')}
                  >
                    {t('Good')}
                    {projectRating?.voted ? (
                      <Typography className={classes.btnPercentage}>{rating || 0}%</Typography>
                    ) : null}
                  </Button>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                    style={{ borderRadius: '100px' }}
                    size="large"
                    variant={projectRating?.voted ? 'text' : 'outlined'}
                    disabled={projectRating?.voted}
                    startIcon={<StartupIcon width={30} height={30} />}
                    onClick={() => handleVote('good', 'To The Moon')}
                  >
                    {t('To The Moon')}
                    {projectRating?.voted ? (
                      <Typography className={classes.btnPercentage}>{rating || 0}%</Typography>
                    ) : null}
                  </Button>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                    className={classes.buttons}
                    size="large"
                    variant={projectRating?.voted ? 'text' : 'outlined'}
                    disabled={projectRating?.voted}
                    startIcon={<MoodBadIcon className={classes.badIcon} />}
                    onClick={() => handleVote('bad', 'Bad')}
                  >
                    {t('Bad')}
                    {projectRating?.voted ? (
                      <Typography className={classes.btnPercentage}>{total - rating || 0}%</Typography>
                    ) : null}
                  </Button>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    classes={{ startIcon: classes.startIcon, disabled: classes.btnDisabled }}
                    style={{ borderRadius: '100px' }}
                    size="large"
                    variant={projectRating?.voted ? 'text' : 'outlined'}
                    disabled={projectRating?.voted}
                    startIcon={<TrendingDownIcon className={classes.badIcon} />}
                    onClick={() => handleVote('bad', 'Not Gonna Make It')}
                  >
                    {t('Not Gonna Make It')}
                    {projectRating?.voted ? (
                      <Typography className={classes.btnPercentage}>{total - rating || 0}%</Typography>
                    ) : null}
                  </Button>
                </Grid>
              </Hidden>
            </Grid>
            <Grid item xs={12} pt={2} className={classes.txtGrid} order={2}>
              {projectRating?.voted ? (
                () => {
                  if (myVote !== '') {
                    return (
                      <Typography>
                        You voted <span style={{ fontWeight: 700 }}>{myVote}!</span>
                      </Typography>
                    );
                  }
                  return null;
                }
              ) : (
                <Typography>{t('Share your thoughts!')}</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item md={6} />
      )}
    </>
  );

  const Votes = () => (
    <Grid item xs={12} md={account?.subscription?.name ? 6 : 8} display="flex" alignItems="center">
      <Grid container className={classes.voteProgressContainer} spacing={0}>
        <Grid item xs={2} md={2}>
          <ThumbUpIcon fontSize="large" className={classes.thumbIcons} />
        </Grid>
        <Grid item xs={8} md={8} />
        <Grid
          item
          xs={2}
          md={2}
          style={{
            textAlign: 'right',
          }}
        >
          <ThumbDownIcon fontSize="large" className={classes.thumbIcons} />
        </Grid>
        <Grid item xs={12} md={12}>
          <BorderLinearProgress className={classes.voteProgress} variant="determinate" value={rating || 0} />
        </Grid>
        <Grid item xs={1} md={1}>
          <b>{numeral(rating).format('0.[00]')}&#37;</b>
        </Grid>
        <Grid item xs={10} md={10} textAlign="center" className={classes.voteNumbers}>
          {total}&nbsp;{t('Votes')}
        </Grid>
        <Grid
          item
          xs={1}
          md={1}
          style={{
            textAlign: 'right',
          }}
        >
          <b>{numeral((rating !== null && 100 - rating) || 0).format('0.[00]')}&#37;</b>
        </Grid>
        <Grid item xs={12} pt={2} display="flex" justifyContent="center" alignItems="center">
          <LoopIcon />
          <Typography>Last Updated: -</Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  const VoteDivider = () => (
    <>
      {account?.subscription?.name ? (
        <Box display="flex" pl={2} pr={2}>
          <Divider className={classes.divider} flexItem orientation="vertical" variant="middle" />
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      {isAuthenticated ? (
        <Card>
          <CardHeader className={classes.noPadBottom} />
          <CardContent>
            <Grid container className={classes.voting}>
              <VoteButtons />
              <VoteDivider />
              <Votes />
            </Grid>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

export default VotingWidget;
