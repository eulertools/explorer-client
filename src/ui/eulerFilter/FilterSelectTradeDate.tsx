import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { selectFilterValue } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterValue } from 'src/slices/ui/filters';
import { dayMs } from 'src/utils/moment';

const useStyles = makeStyles((theme) => ({
  button: {
    width: 'auto',
    borderRadius: theme.spacing(2),
    padding: '5.875px 21px',
  },
  grid: {
    '& > div > p': {
      display: 'none',
    },
  },
  datePicker: {
    '& > div > input': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    '& > div > div > button': {
      padding: theme.spacing(1),
    },
  },
}));

export const FilterSelectTradeDate: FC<GlobalFilterProps> = ({ filterName = 'dateRange', tableId, defaultValue }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const value: string[] = useSelector(selectFilterValue(tableId, filterName)) || [];
  const [minDate, setMinDate] = useState<Date>(new Date(value[0]));
  const [maxDate, setMaxDate] = useState<Date>(new Date(value[1]));

  useEffect(() => {
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: value || defaultValue,
      }),
    );
  }, []);

  useEffect(() => {
    if (value[0] === value[1]) {
      setMinDate(new Date(new Date(value[0]).getTime() - dayMs));
      setMaxDate(new Date(value[1]));
    } else {
      setMinDate(new Date(value[0]));
      setMaxDate(new Date(value[1]));
    }
  }, [value]);

  const onButtonClick = useCallback(() => {
    const min = new Date(minDate);
    const max = new Date(maxDate);
    min.setHours(0, 0, 0, 0);
    max.setHours(0, 0, 0, 0);
    dispatch(
      setFilterValue(tableId, {
        filterName,
        filterValue: [min.toISOString(), max.toISOString()],
      }),
    );
  }, [tableId, filterName, minDate, maxDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container flexDirection="row" spacing={2} justifyContent={isMobile ? 'center' : null}>
        <Grid item display="flex" flexDirection="column" className={classes.grid} mt={1} gap={2}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={minDate}
            onChange={(date) => setMinDate(date)}
            renderInput={(params) => <TextField className={classes.datePicker} {...params} />}
            maxDate={new Date()}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={maxDate}
            onChange={(date) => setMaxDate(date)}
            renderInput={(params) => <TextField className={classes.datePicker} {...params} />}
            maxDate={new Date(new Date().getTime() + dayMs)}
            minDate={minDate}
          />
        </Grid>
        <Grid item display="flex" mt={1} mb="-2px">
          <Button className={classes.button} fullWidth size="large" variant="outlined" onClick={onButtonClick}>
            {t('SELECT')}
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};
