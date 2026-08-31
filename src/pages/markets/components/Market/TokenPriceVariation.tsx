import { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  basePercentage: {
    fontWeight: theme.typography.fontWeightBold,
  },
  positivePercentage: {
    color: theme.palette.success.main,
    margin: `0 ${theme.spacing(0.5)}`,
    fontWeight: theme.typography.fontWeightBold,
  },
  negativePercentage: {
    color: theme.palette.error.main,
    margin: `0 ${theme.spacing(0.5)}`,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

interface ITokenPriceVariationProps {
  currentValue: number;
  historicalValue: number;
}

export const TokenPriceVariation: FC<ITokenPriceVariationProps> = ({ currentValue, historicalValue }) => {
  const classes = useStyles();
  const percentage = (1 - currentValue / historicalValue) * 100;
  const visiblePercentage = (value: number) => value.toString().slice(0, value.toString().lastIndexOf('.') + 3);

  if (currentValue === historicalValue) {
    return <Typography className={classes.basePercentage}>0.00%</Typography>;
  }
  if (currentValue > historicalValue) {
    return (
      <Typography className={classes.negativePercentage}>
        {percentage > 0 ? percentage : visiblePercentage(percentage)}%
      </Typography>
    );
  }
  if (currentValue < historicalValue) {
    return (
      <Typography className={classes.positivePercentage}>
        {percentage > 0 ? visiblePercentage(percentage) : percentage}%
      </Typography>
    );
  }
  return <Typography className={classes.basePercentage}>0.00%</Typography>;
};
