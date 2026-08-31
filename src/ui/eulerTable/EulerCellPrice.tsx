import clsx from 'clsx';
import { FC } from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { GridCellParams } from '@material-ui/data-grid';
import { getReadableCurrency, useIntl } from 'src/hooks/useIntl';

const useStyles = makeStyles((theme) => ({
  cell: {
    width: '100%',
    textAlign: 'right',
    paddingRight: theme.spacing(2),
  },
  highlight: {
    fontWeight: 'bold',
  },
}));

interface EulerCellPriceProps extends GridCellParams {
  currency?: string;
  currencyPosition?: 'left' | 'right';
  highlightCell?: boolean;
  readable?: boolean;
  typographyProps?: TypographyProps;
  maxDecimals?: number;
  customFontWeight?: number;
}

export const EulerCellPrice: FC<EulerCellPriceProps> = ({
  currency = '$',
  value = 0,
  currencyPosition = 'left',
  highlightCell = false,
  readable = false,
  typographyProps,
  maxDecimals = 7,
  customFontWeight,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Typography
      {...typographyProps}
      variant="body2"
      className={clsx(classes.cell, { [classes.highlight]: highlightCell })}
      fontWeight={customFontWeight}
    >
      {currencyPosition === 'left' ? currency : null}{' '}
      {readable
        ? getReadableCurrency(value as number)
        : intl.formatNumber((value as number) || 0, { maximumFractionDigits: maxDecimals })}{' '}
      {currencyPosition === 'right' ? currency : null}
    </Typography>
  );
};
