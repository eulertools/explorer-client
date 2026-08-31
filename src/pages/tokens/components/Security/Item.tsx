import _isNil from 'lodash/isNil';
import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InfoIcon from '@material-ui/icons/Info';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

const useStyles = makeStyles(() =>
  createStyles({
    tooltipIcon: {
      cursor: 'help',
    },
  }),
);

const UNKNOWN_LABEL = '--';

interface IProps {
  attribute: string;
  value: string;
  tooltipTitle?: string;
  isHashValue?: boolean;
  isPercentage?: boolean;
  isNumber?: boolean;
  isFreeText?: boolean;
}

const Item: React.FC<IProps> = ({
  attribute,
  value,
  tooltipTitle,
  isHashValue = false,
  isPercentage = false,
  isNumber = false,
  isFreeText = false,
}) => {
  const classes = useStyles();

  const label = React.useMemo(() => {
    if (_isNil(value)) {
      return UNKNOWN_LABEL;
    }

    if (isHashValue) {
      return (
        <HashCopyToClipboard value={value}>
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
          <Typography fontWeight={700} paddingRight={1}>
            {attribute}
          </Typography>
          {tooltipTitle ? (
            <Tooltip enterTouchDelay={0} title={tooltipTitle}>
              <InfoIcon className={classes.tooltipIcon} />
            </Tooltip>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={5} textAlign="left">
        {label}
      </Grid>
    </Grid>
  );
};
export default Item;
