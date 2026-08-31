import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

export const TradeHeader = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Grid item display={!breakpoint ? 'flex' : 'none'} xs={12} pb={2}>
      <Grid item pt={2} ml={2} display="flex" alignItems="center" justifyContent="flex-start" xs={5}>
        <Typography variant="body1" fontWeight={700}>
          {t('Tokens')}
        </Typography>
      </Grid>
      <Grid item pt={2} display="flex" alignItems="center" justifyContent="center" xs={3}>
        <Typography variant="body1" fontWeight={700}>
          {t('Sale Type')}
        </Typography>
      </Grid>
      <Grid item pt={2} display="flex" alignItems="center" justifyContent="center" xs={1}>
        <Typography variant="body1" fontWeight={700}>
          {t('Rate')}
        </Typography>
      </Grid>
    </Grid>
  );
};
