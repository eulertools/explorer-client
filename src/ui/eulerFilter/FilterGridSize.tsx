import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import GridViewOutlinedIcon from '@material-ui/icons/GridViewOutlined';
import { selectFilterState } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';

const useStyles = makeStyles((theme) => ({
  buttonGroupSelected: {
    background: theme.palette.background.paper,
  },
}));

interface FilterGridSizeProps extends GlobalFilterProps {}

export const FilterGridSize = (props: FilterGridSizeProps) => {
  const classes = useStyles();
  const { tableId } = props;
  const filters = useSelector(selectFilterState(tableId));
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(setFilterValue(tableId, { filterName: 'compact', filterValue: !filters.filter.compact }));
  }, [tableId, filters.filter.compact]);

  return (
    <ButtonGroup variant="outlined" size="large">
      <Button
        className={clsx({ [classes.buttonGroupSelected]: !filters.filter.compact })}
        onClick={filters.filter.compact ? onClick : null}
      >
        <GridViewOutlinedIcon />
      </Button>
      <Button
        className={clsx({ [classes.buttonGroupSelected]: filters.filter.compact })}
        onClick={!filters.filter.compact ? onClick : null}
      >
        <GridOnOutlinedIcon />
      </Button>
    </ButtonGroup>
  );
};
