import { FC } from 'react';
import { createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '1em',
    },
    newsContainer: {
      padding: '2em',
      marginTop: '1em',
    },
    titles: {
      color: '#48506D',
    },
  }),
);

interface NewsWidgetProps {
  news?: any[];
}

const NewsWidget: FC<NewsWidgetProps> = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} container xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" className={classes.titles}>
        Latest News
      </Typography>
      <Paper className={classes.newsContainer} elevation={3}>
        <Typography variant="h6">This section is under construction.</Typography>
      </Paper>
    </Grid>
  );
};

export default NewsWidget;
