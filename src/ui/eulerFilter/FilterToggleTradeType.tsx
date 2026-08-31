import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box } from '@material-ui/core';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { ETransactionType, ETransactionTypeOptions } from 'src/slices/tables/pairTransactions';
import { setFilterValue } from 'src/slices/ui/filters';

export const FilterToggleTradeType: FC<GlobalFilterProps> = ({
  filterName = 'tradeType',
  tableId,
  defaultValue = ETransactionType.ALL,
}) => {
  const dispatch = useDispatch();
  const value: string = useSelector(selectFilterValue(tableId, filterName)) || defaultValue;

  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: value,
      }),
    );
  }, []);

  const onChange = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>, newValue: string) => {
      dispatch(
        setFilterValue(tableId, {
          filterName,
          filterValue: newValue,
        }),
      );
    },
    [tableId, filterName, value],
  );

  return (
    <Box py={1}>
      <ToggleButtonGroup exclusive value={value} onChange={onChange} aria-label="text formatting">
        {ETransactionTypeOptions.map((e) => {
          const checked = value === e.value;
          return (
            <ToggleButton
              key={e.value as string}
              name={e.value as string}
              value={e.value as string}
              aria-label={e.label as string}
            >
              <Box display="grid" gridTemplateColumns="30px auto">
                <Typography variant="caption" color={checked ? 'primary' : 'disabled'}>
                  {e.label}
                </Typography>
              </Box>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};
