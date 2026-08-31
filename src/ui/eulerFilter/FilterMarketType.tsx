import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel } from '@material-ui/core';
import Box from '@material-ui/core/Box/Box';
import FormControl from '@material-ui/core/FormControl';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { SelectOption } from 'src/types/option';
import { EulerSwitch } from '../EulerSwitch';

interface FilterExchangeProps extends GlobalFilterProps {}

export const TokenTypeOptions: SelectOption[] = [
  { value: 'token', label: 'Token' },
  { value: 'lp-token', label: 'LP-Token' },
];

export const FilterMarketType = (props: FilterExchangeProps) => {
  const dispatch = useDispatch();

  const { filterName = 'kind', tableId, defaultValue = ['token'] } = props;

  const savedFilterValue: string[] = useSelector(selectFilterValue(tableId, filterName));

  const [filterState, setFilterState] = useState<string[]>(savedFilterValue || defaultValue);

  React.useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: filterState,
      }),
    );
  }, [filterState]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, name } = event.target;

      if (checked) {
        setFilterState((cur) => [...cur, name]);
      } else {
        setFilterState((cur) => cur.filter((f) => f !== name));
      }
    },
    [tableId, filterName],
  );

  return (
    <>
      {TokenTypeOptions.map((option) => (
        <FormControl key={option.value} fullWidth>
          <Box display="grid" alignItems="center" pt={1}>
            <FormControlLabel
              control={
                <EulerSwitch
                  checked={filterState.includes(String(option.value))}
                  onChange={onChange}
                  name={option.value as string}
                />
              }
              label={option.label as string}
            />
          </Box>
        </FormControl>
      ))}
    </>
  );
};
