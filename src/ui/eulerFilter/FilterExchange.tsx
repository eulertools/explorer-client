import { useEffect, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { EExchangeOwnersOptions } from 'src/slices/tables/pairs';
import { setFilterValue } from 'src/slices/ui/filters';
import { EulerCheckbox } from 'src/ui/EulerCheckbox';

interface FilterExchangeProps extends GlobalFilterProps {}

export const FilterExchange = (props: FilterExchangeProps) => {
  const { filterName = 'owner', tableId, defaultValue = EExchangeOwnersOptions.map((o) => o.value) } = props;
  const dispatch = useDispatch();
  const value: string[] = useSelector(selectFilterValue(tableId, filterName)) || [];
  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: value || defaultValue,
      }),
    );
  }, []);
  const onExchangeChange = useCallback(
    (event: ChangeEvent<{ value }>) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue: event.target.value,
        }),
      );
    },
    [tableId, filterName],
  );
  return (
    <FormControl fullWidth>
      <Select
        multiple
        value={value}
        onChange={onExchangeChange}
        input={<Input value={value} />}
        fullWidth
        renderValue={(selected) => selected.join(', ')}
      >
        {EExchangeOwnersOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <EulerCheckbox checked={value.indexOf(option.value as string) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
