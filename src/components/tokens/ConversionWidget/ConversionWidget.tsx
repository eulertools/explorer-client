import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { NetworkTokenMap, setConversion, Token } from 'src/slices/tables/tokens';
import { useDispatch } from 'src/store';

const useStyles = makeStyles((theme) =>
  createStyles({
    active: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  }),
);

interface ConversionWidgetProps {
  token: Token;
}

const ConversionWidget: FC<ConversionWidgetProps> = (props: ConversionWidgetProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [base, setBase] = useState('BNB');
  const [quote] = useState('USD');
  const [symbol, setSymbol] = useState(quote);
  const [network, setNetwork] = useState(null);
  const {
    token: { asset_platform_id: assetPlatform = null, platforms = {}, market_data: marketData = {}, id = null },
  } = props;

  useEffect(() => {
    // try to establish which network this token belongs to
    const platform = assetPlatform || (platforms['binance-smart-chain' || 'binancecoin'] && 'binancecoin');

    setNetwork(platform);
  }, [assetPlatform, platforms]);

  useEffect(() => {
    // define local params for conversion
    setBase(NetworkTokenMap[network]);
  }, [network]);

  useEffect(() => {
    // update redux state with conversion params
    dispatch(
      setConversion({
        base,
        quote,
        selected: symbol,
        basePrice: marketData?.current_price[base?.toLowerCase()],
        quotePrice: marketData?.current_price[quote?.toLowerCase()],
      }),
    );
  }, [base, quote, symbol, id]);

  return (
    (network && (
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button size="small" className={`${symbol === base ? classes.active : null}`} onClick={() => setSymbol(base)}>
          {base}
        </Button>
        <Button size="small" className={`${symbol === quote ? classes.active : null}`} onClick={() => setSymbol(quote)}>
          {quote}
        </Button>
      </ButtonGroup>
    )) || <></>
  );
};

export default ConversionWidget;
