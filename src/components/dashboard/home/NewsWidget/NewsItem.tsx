import { useTheme } from '@emotion/react';
import { FC } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

interface NewsProps {
  newData: {
    date: number;
    title: string;
    summary: string;
    link: string;
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    newsItem: {
      display: 'flex',
      flexDirection: 'row',
      padding: '14px 0px',
      height: '74px',
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      fontWeight: 500,
      fontSize: 14,
      marginBottom: 8,
    },
    summary: {
      fontWeight: 400,
      fontSize: 12,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: '100%',
      whiteSpace: 'nowrap',
    },
    content: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      width: '85%',
    },
    date: {
      backgroundColor: `${theme.palette.primary.main}14`,
      padding: 8,
      color: theme.palette.primary.main,
      width: 44,
      height: 67,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
    },
    dateMonth: {
      fontWeight: 500,
      marginBottom: '8px',
      textTransform: 'uppercase',
      fontSize: 14,
    },
    dateDay: {
      fontWeight: 700,
      fontSize: 18,
    },
    linkIcon: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    linkContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

const NewsItem: FC<NewsProps> = (props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { newData } = props;
  const { date, title, summary } = newData;
  const newsDate = new Date(date * 1000);
  return (
    <Grid xs={12} className={styles.newsItem}>
      <div className={styles.date}>
        <div className={styles.dateMonth}>{newsDate.toLocaleString('default', { month: 'short' })}</div>
        <div className={styles.dateDay}>{newsDate.getDay()}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.summary}>{summary}</div>
      </div>
      <div className={styles.linkContainer}>
        <OpenInNewIcon className={styles.linkIcon} />
      </div>
    </Grid>
  );
};

export default NewsItem;
