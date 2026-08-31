import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import { UITableID } from 'src/slices/filter.types';
import { clearFilter, setFilterValue } from 'src/slices/ui/filters';
import { FilterSaleKind } from 'src/ui/eulerFilter/FilterSaleKind';
import { FilterSaleStatus } from 'src/ui/eulerFilter/FilterSaleStatus';

export const MySaleFilterForm = () => {
  const tableId = UITableID.marketplace_my_sale_list;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onClear = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(clearFilter(tableId));
      dispatch(
        setFilterValue(tableId, {
          filterName: 'account',
          filterValue: account,
        }),
      );
    },
    [tableId],
  );

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item display="flex" flexDirection="column" gap={1} width={isMobile ? '100%' : 'auto'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {t('Sale Type')}
        </Grid>
        <Grid item display="flex" flexDirection="row" justifyContent="center" whiteSpace="nowrap">
          <FilterSaleKind tableId={tableId} />
        </Grid>
      </Grid>
      <Grid item display="flex" flexDirection="column" gap={1} width={isMobile ? '100%' : 'auto'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {t('Sale Status')}
        </Grid>
        <Grid item display="flex" flexDirection="row" justifyContent="center" whiteSpace="nowrap">
          <FilterSaleStatus tableId={tableId} />
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
        <Button onClick={onClear}>{t('CLEAR FILTER')}</Button>
      </Grid>
    </Grid>
  );
};
