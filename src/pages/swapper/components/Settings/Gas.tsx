import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { SwapperContext } from '../../context';
import { swapperStyles } from '../../styles';

const CUSTOM_GAS_PRICE_VALUE = -1;
const CUSTOM_GAS_PRICE_KEY = 'custom';

const defaultOptions = [
  {
    key: 'low',
    label: 'Low (6)',
    value: 6,
  },
  {
    key: 'medium',
    label: 'Med (15)',
    value: 15,
  },
  {
    key: 'high',
    label: 'High (20)',
    value: 20,
  },
  {
    key: CUSTOM_GAS_PRICE_KEY,
    label: 'Custom',
    value: CUSTOM_GAS_PRICE_VALUE,
  },
];

const GasContainer: React.FC = () => {
  const { t } = useTranslation();
  const classes = swapperStyles();
  const theme = useTheme();

  const { settings, updateSettings } = useContext(SwapperContext);
  const selectedCheckbox = settings.isCustomGasPrice ? CUSTOM_GAS_PRICE_VALUE : settings.gasPrice;

  function onUpdateGasPriceSettings(key: string, newGasPrice: number) {
    updateSettings({ isCustomGasPrice: key === CUSTOM_GAS_PRICE_KEY, gasPrice: newGasPrice <= 0 ? null : newGasPrice });
  }

  return (
    <Box mb={1}>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '20px',
              color: (theme as any).palette.neutral[700],
              marginBottom: theme.spacing(1),
            }}
          >
            {t('Gas Price')}
          </Typography>
        </FormLabel>
        <Box display="flex" justifyContent="center">
          <RadioGroup row name="use-radio-group" value={selectedCheckbox.toString()} color={theme.palette.text.primary}>
            {defaultOptions.map((o) => (
              <FormControlLabel
                key={o.key}
                value={o.value.toString()}
                control={<Radio color="primary" />}
                label={
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      color: (theme as any).palette.neutral[700],
                    }}
                  >
                    {o.label}
                  </Typography>
                }
                onChange={() => onUpdateGasPriceSettings(o.key, o.value)}
              />
            ))}
          </RadioGroup>
        </Box>
        {settings.isCustomGasPrice ? (
          <TextField
            fullWidth
            required
            size="small"
            id="outlined-required"
            label="Gas price"
            placeholder="Gas Price (Gwei)"
            onBlur={(event) => onUpdateGasPriceSettings(CUSTOM_GAS_PRICE_KEY, Number(event.target.value))}
            defaultValue={settings.gasPrice?.toString()}
            className={classes.customInput}
          />
        ) : null}
      </FormControl>
    </Box>
  );
};

export default GasContainer;
