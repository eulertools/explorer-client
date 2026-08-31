import { ExtendedTheme } from '@eulertools/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { ITransactionLog } from 'src/pages/portfolios/components/portfolioDetails/types';

const useStyles = makeStyles(() => ({
  hideOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface ITransactionLogsProps {
  logs: ITransactionLog[];
}

const TransactionLogs: FC<ITransactionLogsProps> = ({ logs }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { settings } = useSettings();

  const logDetails = [...logs];

  return (
    <Box mt={3}>
      <Card elevation={0} sx={{ paddingBottom: theme.spacing(5) }}>
        <Grid pl={3} pr={3} container spacing={2} marginY={1}>
          <Grid item xs={12} pt={0} pb={1}>
            <Typography fontSize={16} fontWeight={600} justifyContent="center" color="terciary.700">
              {t('Transactions Recipt Event Logs')}
            </Typography>
          </Grid>
        </Grid>
        <Divider light />
        <Grid item xs={12} marginTop={4}>
          {logDetails
            .sort((a, b) => Number(a.log_index) - Number(b.log_index))
            .map((l) => (
              <Grid container spacing={2} marginBottom={2} paddingLeft={2} key={l.log_index}>
                <Grid item xs={3} sm={1} display="flex" justifyContent="center">
                  <Chip
                    variant="filled"
                    label={l.log_index}
                    sx={{
                      background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
                      color: 'primary.400',
                      fontWeight: 700,
                      fontSize: '11px',
                    }}
                  />
                </Grid>
                <Grid item xs={9} sm={11}>
                  <Grid container spacing={1}>
                    <Grid item xs={3} sm={1}>
                      <Typography color="terciary.700" fontWeight={600} fontSize={13}>
                        {t('Address')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} sm={11}>
                      <HashCopyToClipboard value={l.address} customFontSize={13} customFontWeight={500}>
                        <Link
                          className={classes.hideOverflow}
                          href={`/${settings.network}/address/${l.address}`}
                          sx={{ color: 'primary.400' }}
                        >
                          {l.address}
                        </Link>
                      </HashCopyToClipboard>
                    </Grid>
                    <Grid item xs={3} sm={1}>
                      <Typography color="terciary.700" fontWeight={600} fontSize={13}>
                        {t('Topics')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} sm={11}>
                      {l.topics.map((topic, i) => (
                        <Grid item display="flex" xs={9} sm={11} gap={1} margin={1}>
                          <Chip
                            variant="filled"
                            label={i}
                            size="small"
                            sx={{ color: 'terciary.700', fontWeight: 500, fontSize: '11px' }}
                          />
                          <Typography
                            color="terciary.700"
                            fontWeight={500}
                            fontSize={13}
                            className={classes.hideOverflow}
                          >
                            {topic}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid item xs={3} sm={1}>
                      <Typography color="terciary.700" fontWeight={600} fontSize={13}>
                        {t('Data')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} sm={11}>
                      <Typography
                        color="terciary.700"
                        fontSize={13}
                        fontWeight={500}
                        className={classes.hideOverflow}
                        sx={{
                          background: theme.palette.background.default,
                          borderRadius: theme.spacing(1),
                          padding: theme.spacing(1),
                          marginRight: theme.spacing(1),
                          maxWidth: 'fit-content',
                        }}
                      >
                        {l.data}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider light />
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Card>
    </Box>
  );
};

export default TransactionLogs;
