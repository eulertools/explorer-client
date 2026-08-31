import _isNil from 'lodash/isNil';
import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

const UNKNOWN_LABEL = '--';

interface IProps {
  attribute: string;
  value: string;
  tooltipTitle?: string;
  isHashValue?: boolean;
  isPercentage?: boolean;
  isNumber?: boolean;
  isFreeText?: boolean;
  eventPush?: string;
}

const Item: React.FC<IProps> = ({
  attribute,
  value,
  tooltipTitle,
  isHashValue = false,
  isPercentage = false,
  isNumber = false,
  isFreeText = false,
  eventPush,
}) => {
  const theme = useTheme();

  const label = React.useMemo(() => {
    if (_isNil(value)) {
      return UNKNOWN_LABEL;
    }

    if (isHashValue) {
      return (
        <HashCopyToClipboard value={value} eventPush={eventPush}>
          <Typography component="span" fontSize={14} textOverflow="ellipsis" overflow="hidden">
            {value}
          </Typography>
        </HashCopyToClipboard>
      );
    }

    if (isPercentage) {
      return `${Number(value) * 100}%`;
    }

    if (isNumber) {
      return getBigNumberCurrencyLabel(value);
    }

    if (isFreeText) {
      return value;
    }

    return value === '1' ? 'Yes' : 'No';
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={7}>
        <Box display="flex" alignItems="center">
          <Typography
            paddingRight={1}
            sx={{
              color: (theme as any).palette.terciary[700],
              fontSize: '13px',
              fontWeight: '600',
              lineHeight: '17px',
            }}
          >
            {attribute}
          </Typography>
          {tooltipTitle ? (
            <Tooltip enterTouchDelay={0} title={tooltipTitle}>
              <InfoIcon sx={{ cursor: 'help' }} />
            </Tooltip>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={5} textAlign="left">
        <Typography
          sx={{
            color: (theme as any).palette.terciary[700],
            fontSize: '13px',
            fontWeight: '500',
            lineHeight: '17px',
          }}
        >
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
};
export default Item;
