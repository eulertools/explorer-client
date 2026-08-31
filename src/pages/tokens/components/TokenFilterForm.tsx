import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import { UITableID } from 'src/slices/filter.types';
import { clearFilter } from 'src/slices/ui/filters';
import { FilterTokenType } from 'src/ui/eulerFilter/FilterTokenType';
import { FilterVerifiedOnly } from 'src/ui/eulerFilter/FilterVerifiedOnly';

export const TokenFilterForm = () => {
  const tableId = UITableID.token_list;
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
      <Grid item display="flex" flexDirection="column">
        {t('Verified Only')}
        <FilterVerifiedOnly tableId={tableId} />
      </Grid>
      <Grid item display="flex" flexDirection="column">
        <Grid item display="flex" justifyContent="center">
          {t('Token Type')}
        </Grid>
        <Grid item display="flex" flexDirection="row" whiteSpace="nowrap">
          <FilterTokenType tableId={tableId} />
        </Grid>
      </Grid>
      <Grid item pt={2} display="flex" alignItems="center">
        <Button variant="contained" onClick={onClear}>
          {t('CLEAR FILTER')}
        </Button>
      </Grid>
    </Grid>
  );
};
