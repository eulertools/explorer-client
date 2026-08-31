import { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import RepeatIcon from '@material-ui/icons/Repeat';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import Logo from 'src/components/Logo';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';

const useStyles = makeStyles((theme) =>
  createStyles({
    mediaIconButton: {
      margin: '0 6px',
      padding: 0,
    },
    mediaIcon: {
      margin: '6px 0px',
      fontSize: '1.2rem',
      color: theme.palette.primary.main,
    },
    imageGrid: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > div': {
        minHeight: '45vh',
        [theme.breakpoints.down('sm')]: {
          minHeight: '20vh',
        },
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

const Tweet: FC = () => {
  const classes = useStyles();
  const [favorite, setFavorite] = useState(false);
  const handleFavoriteClick = () => {
    setFavorite((prevState) => !prevState);
  };
  return (
    <Grid container display="flex" flexDirection="column" mt={3} mb={3}>
      <Grid item xs={12} sm={2}>
        <Hidden smDown>
          <Logo format="euler-home" heightValue={50} />
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Grid container display="flex" flexDirection="row" height="100%">
          <Grid item xs={12} pb={2}>
            <Box display="inline-flex">
              <Typography className={classes.tweetTitle}>
                Euler Tools <span>@EulerTools - 15 abr.</span>
              </Typography>
            </Box>
            <Typography>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem culpa esse enim unde repellat nisi fugiat
              at ea repellendus quisquam!
            </Typography>
          </Grid>
          <Grid className={classes.imageGrid} item xs={12} pb={0}>
            <ScreenSpinner />
          </Grid>
          <Grid item xs={12} pb={2}>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <IconButton className={classes.mediaIconButton}>
                <ChatBubbleOutlineOutlinedIcon className={classes.mediaIcon} color="primary" />
              </IconButton>
              <IconButton className={classes.mediaIconButton}>
                <RepeatIcon className={classes.mediaIcon} color="primary" />
              </IconButton>
              <IconButton className={classes.mediaIconButton} onClick={handleFavoriteClick}>
                {favorite ? (
                  <FavoriteIcon className={classes.mediaIcon} />
                ) : (
                  <FavoriteBorderOutlinedIcon className={classes.mediaIcon} />
                )}
              </IconButton>
              <IconButton className={classes.mediaIconButton}>
                <ShareOutlinedIcon className={classes.mediaIcon} color="primary" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography>Go To Tweet</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Tweet;
