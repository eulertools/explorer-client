import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { IPairSource } from 'src/types/pair';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainCard: {
      borderRadius: '20px',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      height: `calc(100% - ${theme.spacing(6)} - 31px)`,
      display: 'flex',
    },
    title: {
      fontSize: '16px',
      lineHeight: '170%',
      fontWeight: 700,
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    subTitle: {
      fontSize: '16px',
      lineHeight: '170%',
      fontWeight: 500,
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

interface PairStatsProps {
  pairDetails: IPairSource;
}

const PairStats: FC<PairStatsProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pairDetails } = props;

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h5" color="textPrimary">
        {t('Stats')}
      </Typography>
      <Card className={classes.mainCard}>
        <Grid container>
          <Grid item display="flex" xs={12} md={5}>
            <Box display="flex" flexDirection="column" alignSelf="center" padding={2}>
              <Box className={classes.title}>Total Liquidity</Box>
              {/* <Box className={classes.subTitle}>${getBigNumberCurrencyLabel(pairDetails.liquidity)} USD</Box> */}
            </Box>
          </Grid>
          <Grid item display="flex" xs={12} md={7}>
            <Box display="flex" flexDirection="column" alignSelf="center" padding={2}>
              <Box className={classes.title}>Price</Box>
              {/* <Box className={classes.subTitle}>${getBigNumberCurrencyLabel(pairDetails.price)} USD</Box> */}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider variant="fullWidth" />
          </Grid>
          <Grid item display="flex" xs={12} md={5}>
            <Box display="flex" flexDirection="column" alignSelf="center" padding={2}>
              <Box className={classes.title}>Volume (24H)</Box>
              <Box className={classes.subTitle}>$ -</Box>
            </Box>
          </Grid>
          <Grid item display="flex" xs={12} md={7}>
            <Box display="flex" flexDirection="column" alignSelf="center" padding={2}>
              <Box className={classes.title}>Pooled Tokens</Box>
              <Box className={classes.subTitle} display="flex">
                <Box marginRight={1} display="flex">
                  <AvatarThumbnail address={pairDetails.base_token_address} />
                  <Typography paddingLeft={1}>
                    {/* {getBigNumberCurrencyLabel(pairDetails.base_token_volume)} {pairDetails.base_token_name} */}
                  </Typography>
                </Box>
                <Box display="flex">
                  <AvatarThumbnail address={pairDetails.quote_token_address} />
                  <Typography paddingLeft={1}>
                    {/* {getBigNumberCurrencyLabel(pairDetails.quote_token_volume)} {pairDetails.quote_token_name} */}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default PairStats;
