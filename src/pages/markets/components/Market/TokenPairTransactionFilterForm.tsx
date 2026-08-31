import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import { UITableID } from 'src/slices/filter.types';
import { clearFilter } from 'src/slices/ui/filters';
import { FilterEulerExchange } from 'src/ui/eulerFilter/FilterEulerExchange';
import { FilterSelectTradeDate } from 'src/ui/eulerFilter/FilterSelectTradeDate';
import { FilterSelectTradeVolume } from 'src/ui/eulerFilter/FilterSelectTradeVolume';

export const TokenPairTransactionFilterForm = () => {
  const tableId = UITableID.token_trade_list;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onClear = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(clearFilter(tableId));
    },
    [tableId],
  );

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item display="flex" flexDirection="column" gap={1} width={isMobile ? '100%' : 'auto'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {t('Date Range')}
        </Grid>
        <Grid item display="flex" flexDirection="row" justifyContent="center" whiteSpace="nowrap">
          <FilterSelectTradeDate tableId={tableId} />
        </Grid>
      </Grid>
      <Grid
        item
        display="flex"
        flexDirection="column"
        gap={2}
        width={isMobile ? '100%' : 'auto'}
        alignItems={isMobile ? 'center' : null}
      >
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {t('Trade Volume')}
        </Grid>
        <Grid item display="flex" flexDirection="row" justifyContent="center" whiteSpace="nowrap">
          <FilterSelectTradeVolume tableId={tableId} />
        </Grid>
      </Grid>
      <Grid item display="flex" flexDirection="column" gap={2} width={isMobile ? '100%' : 'auto'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {t('Exchange')}
        </Grid>
        <Grid item display="flex" flexDirection="row" justifyContent="center" whiteSpace="nowrap">
          <FilterEulerExchange tableId={tableId} />
        </Grid>
      </Grid>
      <Grid
        item
        pt={2}
        display="flex"
        alignItems="end"
        width={isMobile ? '100%' : 'auto'}
        justifyContent={isMobile ? 'center' : null}
      >
        <Button variant="contained" onClick={onClear}>
          {t('CLEAR FILTER')}
        </Button>
      </Grid>
    </Grid>
  );
};
