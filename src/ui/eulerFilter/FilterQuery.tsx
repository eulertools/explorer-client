import _debounce from 'lodash/debounce';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import gtm from 'src/lib/gtm';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';

interface FilterQueryProps extends GlobalFilterProps {
  placeholder?: string;
  onFocus?: () => void;
  captureEventsOf?: string;
}

export const FilterQuery = (props: FilterQueryProps) => {
  const { filterName = 'query', tableId, defaultValue = '', placeholder, onFocus, captureEventsOf } = props;
  const dispatch = useDispatch();
  const value: string = useSelector(selectFilterValue(tableId, filterName)) || '';
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const useStyles = makeStyles((theme) =>
    createStyles({
      searchIcon: {
        fill: theme.palette.primary.main,
      },
      input: {
        backgroundColor: theme.palette.background.paper,
      },
    }),
  );
  React.useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: value || defaultValue,
      }),
    );
  }, []);
  React.useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const setFilterQuery = React.useCallback(
    (filterValue: string) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue,
        }),
      );
    },
    [tableId, filterName],
  );

  const onNameChange = React.useCallback(
    _debounce((x) => {
      setFilterQuery(x);
    }, 500),
    [],
  );

  let timer;

  const onChange = React.useCallback((event: React.ChangeEvent<{ value }>) => {
    if (captureEventsOf) {
      clearInterval(timer);
      timer = setTimeout(() => {
        if (event.target.value.trim().length > 0) {
          gtm.push({ event: `user_typed_${captureEventsOf}_search`, value: event.target.value });
        }
      }, 2000);
    }
    onNameChange(event.target.value);
    setDisplayValue(event.target.value);
  }, []);
  const classes = useStyles();

  return (
    <FormControl fullWidth>
      <TextField
        onFocus={onFocus}
        variant="outlined"
        size="small"
        placeholder={placeholder}
        fullWidth
        value={displayValue}
        name={filterName}
        onChange={onChange}
        type="text"
        InputProps={{
          className: classes.input,
          endAdornment: <SearchIcon className={classes.searchIcon} />,
        }}
      />
    </FormControl>
  );
};
