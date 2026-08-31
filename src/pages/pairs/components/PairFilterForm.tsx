import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import { UITableID } from 'src/slices/filter.types';
import { clearFilter } from 'src/slices/ui/filters';
import { FilterExchange } from 'src/ui/eulerFilter/FilterExchange';

export const PairFilterForm = () => {
  const tableId = UITableID.pair_list;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClear = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(clearFilter(tableId));
    },
    [tableId],
  );

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item xs={3} display="flex" flexDirection="column">
        {t('Exchange')}
        <FilterExchange tableId={tableId} />
      </Grid>
      <Grid item pt={2} display="flex" alignItems="center">
        <Button variant="contained" onClick={onClear}>
          {t('CLEAR FILTER')}
        </Button>
      </Grid>
    </Grid>
  );
};
