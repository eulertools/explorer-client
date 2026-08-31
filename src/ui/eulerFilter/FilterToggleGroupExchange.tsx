import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { EExchangeOwners, EExchangeOwnersOptions } from 'src/slices/tables/pairs';
import { setFilterValue } from 'src/slices/ui/filters';

const useStyles = makeStyles(() => ({
  toggleButtons: {
    '& > button:first-of-type': {
      borderBottomLeftRadius: 0,
    },
    '& > button:last-of-type': {
      borderBottomRightRadius: 0,
    },
  },
}));

export const FilterToggleGroupExchange = (props: GlobalFilterProps) => {
  const { filterName = 'owner', tableId, defaultValue = EExchangeOwners.PANCAKE_V2 } = props;
  const classes = useStyles();
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
    <Box pt={1}>
      <ToggleButtonGroup
        className={classes.toggleButtons}
        exclusive
        value={value}
        onChange={onChange}
        aria-label="text formatting"
      >
        {EExchangeOwnersOptions.map((e) => {
          const checked = value === e.value;
          return (
            <ToggleButton
              key={e.value as string}
              name={e.value as string}
              value={e.value as string}
              aria-label={e.label as string}
            >
              <Box display="grid" gridTemplateColumns="30px auto">
                <Check fontSize="small" color={checked ? 'primary' : 'disabled'} />
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
