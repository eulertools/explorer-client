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

const CUSTOM_TX_PERCENTAGE_VALUE = -1;
const CUSTOM_TX_PERCENTAGE_KEY = 'custom';

const defaultOptions = [
  {
    key: 'one-one-p',
    label: '0.1%',
    value: 0.1,
  },
  {
    key: 'half-one-p',
    label: '0.5%',
    value: 0.5,
  },
  {
    key: 'one-p',
    label: '1.5%',
    value: 1.5,
  },
  {
    key: 'three-p',
    label: '3%',
    value: 3,
  },
  {
    key: CUSTOM_TX_PERCENTAGE_KEY,
    label: 'Custom',
    value: CUSTOM_TX_PERCENTAGE_VALUE,
  },
];

const SlippageToleranceContainer: React.FC = () => {
  const { t } = useTranslation();
  const classes = swapperStyles();
  const theme = useTheme();

  const { settings, updateSettings } = useContext(SwapperContext);

  const selectedCheckbox = settings.isCustomTxPercentage
    ? CUSTOM_TX_PERCENTAGE_VALUE
    : settings.slippageTolerancePercentage;

  function onUpdateSlippageTolerance(key: string, newTolerancePercentage: number) {
    updateSettings({
      isCustomTxPercentage: key === CUSTOM_TX_PERCENTAGE_KEY,
      slippageTolerancePercentage: newTolerancePercentage <= 0 ? null : newTolerancePercentage,
    });
  }

  return (
    <Box my={1}>
      <FormControl sx={{ width: '100%' }}>
        <FormLabel id="demo-row-radio-buttons-group-label">
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '20px',
              color: (theme as any).palette.neutral[700],
              margin: theme.spacing(3, 0, 1, 0),
            }}
          >
            {t('Slippage Tolerance')}
          </Typography>
        </FormLabel>
        <Box display="flex" justifyContent="center">
          <RadioGroup
            row
            name="use-radio-group"
            value={selectedCheckbox.toString()}
            color={theme.palette.text.primary}
            sx={{ width: '100%' }}
          >
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
                onChange={() => onUpdateSlippageTolerance(o.key, o.value)}
              />
            ))}
          </RadioGroup>
        </Box>
        {settings.isCustomTxPercentage ? (
          <TextField
            fullWidth
            required
            size="small"
            id="outlined-required"
            label="Slippage Tolerance"
            placeholder="%"
            defaultValue={settings.slippageTolerancePercentage?.toString()}
            onBlur={(event) => onUpdateSlippageTolerance(CUSTOM_TX_PERCENTAGE_KEY, Number(event.target.value))}
            className={classes.customInput}
          />
        ) : null}
      </FormControl>
    </Box>
  );
};

export default SlippageToleranceContainer;
