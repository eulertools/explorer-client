import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import { selectFilterIsOpen, selectFilterSize } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { toggleFilter } from 'src/slices/ui/filters';

interface FilterButtonProps extends GlobalFilterProps {}

export const FilterInfo = (props: FilterButtonProps) => {
  const { tableId } = props;
  const { t } = useTranslation();
  const isOpen = useSelector(selectFilterIsOpen(tableId));
  const filterSize = useSelector(selectFilterSize(tableId));
  const dispatch = useDispatch();
  const onClick = React.useCallback(() => {
    dispatch(toggleFilter(tableId));
  }, [tableId]);

  return (
    <Badge badgeContent={filterSize} color="primary" onClick={onClick}>
      <Button variant="outlined">{isOpen ? <span>{t('Filter')}</span> : t('Filter')}</Button>
    </Badge>
  );
};
