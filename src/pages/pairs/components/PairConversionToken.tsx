import { FC } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      fontSize: '16px',
      lineHeight: '170%',
      fontWeight: 700,
    },
    inputBox: {
      minWidth: 'min(400px, 100%)',
    },
    textField: {
      width: '100%',
      '&>div': {
        background: theme.palette.background.paper,
        borderRadius: '20px',
      },
    },
  }),
);

interface TextFieldAdornmentProps {
  symbol: string;
  tokenAddress: string;
}

const TextFieldAdornment: FC<TextFieldAdornmentProps> = ({ symbol, tokenAddress }) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box paddingRight={1}>
        <AvatarThumbnail alt={symbol} address={tokenAddress} />
      </Box>
      <Box paddingRight={1}>
        <Typography className={classes.title}>{symbol}</Typography>
      </Box>
    </Box>
  );
};

interface PairConversionTokenProps {
  symbol: string;
  tokenAddress: string;
  coinValue: number;
  onChange: (event: any) => void;
}

const PairConversionToken: FC<PairConversionTokenProps> = ({ symbol, tokenAddress, coinValue, onChange }) => {
  const classes = useStyles();
  return (
    <Box className={classes.inputBox}>
      <TextField
        fullWidth
        className={classes.textField}
        InputProps={{
          startAdornment: <TextFieldAdornment symbol={symbol} tokenAddress={tokenAddress} />,
        }}
        value={coinValue}
        onChange={(e) => onChange(e)}
      />
    </Box>
  );
};

export default PairConversionToken;
