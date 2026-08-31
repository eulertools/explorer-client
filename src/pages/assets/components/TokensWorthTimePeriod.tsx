import { useContext } from 'react';
import { useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AssetsContext } from 'src/pages/assets/AssetsContext';
import { hexToRGB } from 'src/utils/stringUtils';

export const TokensWorthTimePeriod = () => {
  const theme = useTheme();
  const { timePeriod, updateTimePeriod } = useContext(AssetsContext);

  const smallScreen = useMediaQuery(theme.breakpoints.down(675));
  const fixedIntervalScreen = useMediaQuery(theme.breakpoints.between(960, 1014));

  const buttonGroupOptions = [
    {
      key: '24H',
      label: '24h',
    },
    {
      key: '7D',
      label: '7d',
    },
    {
      key: '30D',
      label: '30d',
    },
    {
      key: '6M',
      label: '6m',
    },
  ];

  const handlePeriodToggle = (value: string) => {
    updateTimePeriod(value);
  };

  return (
    <Grid item xs={12} px={4} display="flex" justifyContent="flex-end" pt={fixedIntervalScreen || smallScreen ? 3 : 2}>
      <ButtonGroup
        variant="outlined"
        size="large"
        sx={{
          background: theme.palette.background.default,
        }}
      >
        {buttonGroupOptions.map((b) => (
          <Button
            key={b.key}
            onClick={() => handlePeriodToggle(b.key)}
            sx={{
              color: b.key === timePeriod ? theme.palette.primary.main : hexToRGB(theme.palette.text.primary, 0.7),
              margin: theme.spacing(1),
              borderTopRightRadius: '10px !important',
              borderTopLeftRadius: '10px !important',
              borderBottomRightRadius: '10px !important',
              borderBottomLeftRadius: '10px !important',
              border: 'none',
              background: b.key === timePeriod ? theme.palette.background.paper : 'inherit',
              '&:hover': {
                border: 'none',
                background: b.key === timePeriod ? theme.palette.background.paper : 'inherit',
              },
            }}
          >
            {b.label}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
};
