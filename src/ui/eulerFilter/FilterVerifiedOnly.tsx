import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, makeStyles, createStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import useSettings from 'src/hooks/useSettings';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { EulerSwitch } from '../EulerSwitch';

interface FilterExchangeProps extends GlobalFilterProps {}

export const FilterVerifiedOnly = (props: FilterExchangeProps) => {
  const dispatch = useDispatch();

  const { filterName = 'verified', tableId, defaultValue = true } = props;

  const savedFilterValue: boolean = useSelector(selectFilterValue(tableId, filterName));
  const [filterState, setFilterState] = useState<boolean>(savedFilterValue || defaultValue);
  const useStyles = makeStyles((theme) =>
    createStyles({
      textWhite: {
        color: 'white',
      },
      textNormal: {
        color: theme.palette.text.primary,
      },
    }),
  );
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: filterState,
      }),
    );
  }, [filterState]);

  const { settings } = useSettings();
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setFilterState(checked);
    },
    [tableId, filterName],
  );

  return (
    <FormControl key="verifiedOnly" fullWidth>
      <FormControlLabel
        className={settings.theme === 'DARK' ? `${classes.textWhite}` : `${classes.textNormal}`}
        control={<EulerSwitch checked={filterState} onChange={onChange} name="verified" />}
        label=""
      />
    </FormControl>
  );
};
