import { ExtendedTheme } from '@eulertools/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@material-ui/icons/FilterAltOutlined';
import { selectFilterIsOpen, selectFilterSize } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { toggleFilter } from 'src/slices/ui/filters';

const useStyles = makeStyles((theme) => ({
  buttonIcon: {
    background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    borderRadius: '10px',
    maxHeight: '90%',
  },
  button: {
    maxHeight: '90%',
  },
}));

interface FilterButtonProps extends GlobalFilterProps {}

export const FilterButton = (props: FilterButtonProps) => {
  const { tableId } = props;
  const { t } = useTranslation();
  const isOpen = useSelector(selectFilterIsOpen(tableId));
  const filterSize = useSelector(selectFilterSize(tableId));
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch(toggleFilter(tableId));
  }, [tableId]);

  return (
    <Badge badgeContent={filterSize} color="primary" onClick={onClick}>
      <Button variant="outlined" size="large">
        {isOpen ? <span>{t('FILTER')}</span> : t('FILTER')}
      </Button>
    </Badge>
  );
};

export const FilterButtonIcon = (props: FilterButtonProps) => {
  const classes = useStyles();
  const { tableId } = props;
  const isOpen = useSelector(selectFilterIsOpen(tableId));
  const filterSize = useSelector(selectFilterSize(tableId));
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch(toggleFilter(tableId));
  }, [tableId]);

  return (
    <Badge badgeContent={filterSize} color="primary" onClick={onClick}>
      {isOpen ? (
        <Button color="primary" aria-label="filter" variant="contained" className={classes.button}>
          <FilterAltOutlinedIcon />
        </Button>
      ) : (
        <Button color="primary" aria-label="filter" className={classes.buttonIcon}>
          <FilterAltOutlinedIcon />
        </Button>
      )}
    </Badge>
  );
};
