import BigNumber from 'bignumber.js';
import { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import PairConversionToken from 'src/pages/pairs/components/PairConversionToken';

const useStyles = makeStyles(() =>
  createStyles({
    inputs: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
    },
    syncIcon: {
      transform: 'rotate(90deg)',
    },
  }),
);

interface CoinExchange {
  leftInput: number;
  rightInput: number;
}

interface IProps {
  baseTokenAddress: string;
  baseTokenSymbol: string;
  quoteTokenAddress: string;
  quoteTokenSymbol: string;
  quoteTokenPrice: string;
}

const TokenConversionWidget: FC<IProps> = ({
  baseTokenAddress,
  baseTokenSymbol,
  quoteTokenAddress,
  quoteTokenSymbol,
  quoteTokenPrice,
}) => {
  const classes = useStyles();

  const quoteRatio = new BigNumber(quoteTokenPrice).toNumber();
  const baseRatio = new BigNumber(1).dividedBy(quoteTokenPrice).toNumber();

  const [ratio] = useState<number[]>([baseRatio, quoteRatio]);
  const [coinExchange, setCoinExchange] = useState<CoinExchange>({
    leftInput: 1,
    rightInput: quoteRatio,
  });

  const handleLeftExchange = (e) => {
    const newValues = {
      leftInput: e.target.value,
      rightInput: e.target.value * ratio[1],
    };
    setCoinExchange(newValues);
  };
  const handleRightExchange = (e) => {
    const newValues = {
      leftInput: e.target.value * ratio[0],
      rightInput: e.target.value,
    };
    setCoinExchange(newValues);
  };

  return (
    <Box className={classes.inputs}>
      <PairConversionToken
        symbol={baseTokenSymbol}
        tokenAddress={baseTokenAddress}
        coinValue={coinExchange.leftInput}
        onChange={handleLeftExchange}
      />
      <Box padding={1}>
        <SyncAltIcon className={classes.syncIcon} />
      </Box>
      <PairConversionToken
        symbol={quoteTokenSymbol}
        tokenAddress={quoteTokenAddress}
        coinValue={coinExchange.rightInput}
        onChange={handleRightExchange}
      />
    </Box>
  );
};

export default TokenConversionWidget;
