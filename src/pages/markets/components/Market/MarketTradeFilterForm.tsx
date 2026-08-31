import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { selectFilterValue } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';

export const MarketTradeFilterForm = () => {
  const tableId = UITableID.token_trade_list;
  const filterName = 'tradeType';
  const dispatch = useDispatch();
  const filterValue = useSelector(selectFilterValue(tableId, filterName));
  const [filterForm, setFilterForm] = useState({
    buy: true,
    sell: true,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // Obtain opposite linked checkbox value.
      const pairCheckbox = Object.keys(filterForm).filter((keys) => !keys.includes(event.target.name));

      // Check if both future filters will be true and apply ALL filter.
      if (filterForm[event.target.name] === false && filterForm[pairCheckbox[0]] === true) {
        dispatch(
          setFilterValue(tableId, {
            filterName,
            filterValue: 'all',
          }),
        );
      } else {
        // Otherwise apply the opposite filter from the clicked checkbox.
        dispatch(
          setFilterValue(tableId, {
            filterName,
            filterValue: pairCheckbox[0],
          }),
        );
      }
    },
    [filterValue, filterForm],
  );

  useEffect(() => {
    if (filterValue === 'all')
      setFilterForm((prev) => ({
        ...prev,
        buy: true,
        sell: true,
      }));

    if (filterValue === 'buy')
      setFilterForm((prev) => ({
        ...prev,
        buy: true,
        sell: false,
      }));

    if (filterValue === 'sell')
      setFilterForm((prev) => ({
        ...prev,
        buy: false,
        sell: true,
      }));
  }, [filterValue]);

  return (
    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
      <FormControlLabel
        control={<Checkbox onChange={handleChange} checked={filterForm.buy} name="buy" />}
        label="Buy"
        sx={{
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '17px',
          color: (theme) => (theme as any).palette.neutral[600],
          '& .Mui-checked': {
            color: (theme) => `${(theme as any).palette.primary[400]} !important`,
          },
        }}
      />
      <FormControlLabel
        control={<Checkbox onChange={handleChange} checked={filterForm.sell} name="sell" />}
        label="Sell"
        sx={{
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '17px',
          color: (theme) => (theme as any).palette.neutral[600],
          '& .Mui-checked': {
            color: (theme) => `${(theme as any).palette.primary[400]} !important`,
          },
        }}
      />
    </FormGroup>
  );
};
