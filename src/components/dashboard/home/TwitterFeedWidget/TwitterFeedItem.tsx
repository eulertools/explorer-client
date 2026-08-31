import moment from 'moment';
import { FC } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';

interface TwitterFeedItemProps {
  feedData: {
    date: number;
    user: string;
    message: string;
    link: string;
    img: string;
  };
}

const useStyles = makeStyles(() =>
  createStyles({
    name: {
      fontSize: 14,
      fontWeight: 500,
    },
    message: {
      fontSize: 14,
      fontWeight: 400,
      marginTop: 8,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: '100%',
      whiteSpace: 'nowrap',
    },
    date: {
      fontSize: 12,
      fontWeight: 300,
      marginTop: 24,
      marginLeft: 16,
      width: '20%',
      whiteSpace: 'nowrap',
    },
    infoContainer: {
      width: '60%',
    },
    img: {
      backgroundColor: '#1D84D7',
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    imageContainer: {
      width: '20%',
    },
  }),
);

const TwitterFeedItem: FC<TwitterFeedItemProps> = (props) => {
  const styles = useStyles();
  const { feedData } = props;
  const { date, user, message } = feedData;
  return (
    <Grid xs={12} style={{ display: 'flex', flexDirection: 'row', padding: '8px 0' }}>
      <div className={styles.imageContainer}>
        <div className={styles.img} />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>{user}</div>
        <div className={styles.message}>{message}</div>
      </div>
      <div className={styles.date}>{moment(date * 1000).fromNow()}</div>
    </Grid>
  );
};

export default TwitterFeedItem;
