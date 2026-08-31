import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CardCommunity from 'src/ui/eulerCommunity/CardCommunity';

const useStyles = makeStyles(() =>
  createStyles({
    iframe: {
      border: '0px',
      margin: '0px',
      boxShadow: '0 0 16px 3px rgba(0,0,0,.2)',
    },
  }),
);

interface ITelegramProps {
  channelUrl: string;
  width?: string;
  height?: string;
}

const Telegram: FC<ITelegramProps> = ({ channelUrl, width = '100%', height = '100%' }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={12} md={12} lg={6}>
      <Typography variant="h5" color="textPrimary">
        {t('Telegram')}
      </Typography>
      <CardCommunity>
        <iframe
          className={classes.iframe}
          id="telegram_channel"
          title="channels"
          style={{ width, height }}
          src={`https://xn--r1a.website/s/${channelUrl}`}
        />
      </CardCommunity>
    </Grid>
  );
};

export default Telegram;
