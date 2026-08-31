import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import ChevronDown from 'src/icons/ChevronDown';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';

const RouteRoad: React.FC = () => {
  const classes = swapperStyles();
  const [open, setOpen] = React.useState(false);

  const {
    fromToken,
    toToken,
    routeInfo: { protocols },
  } = React.useContext(SwapperContext);

  const toggleCollapse = () => {
    setOpen((curr) => !curr);
  };

  if (!protocols?.length) {
    return null;
  }

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" ml={2}>
        <Typography variant="subtitle2" color="textSecondary">
          Route
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2" color="textSecondary">
            {fromToken.symbol}
          </Typography>
          <ChevronRightIcon className={classes.routeIcon} />
          <Typography variant="subtitle2" color="textSecondary" paddingRight={1}>
            {toToken.symbol}
          </Typography>
          <IconButton onClick={toggleCollapse}>
            {open ? <CloseIcon className={classes.routeIcon} /> : <ChevronDown className={classes.routeIcon} />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={open}>
        {protocols?.map((r) =>
          r.pools?.map((pool, idx) => (
            <Box key={pool} display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" color="textSecondary">
                {idx === 0 ? <b>{getBigNumberCurrencyLabel(r.amountIn, false, 4)}</b> : null} {r.tokenLabel[idx]}{' '}
                {idx === 0 ? (
                  <>
                    (<i>{r.percentage} %</i>)
                  </>
                ) : null}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                <b>{'>'}</b>
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                <b>{r.factoryLabel[idx] || pool}</b>
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                <b>{'>'}</b>
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {idx === r.pools.length - 1 ? <b>{getBigNumberCurrencyLabel(r.amountOut, false, 4)}</b> : null}{' '}
                {r.tokenLabel[idx + 1]}
              </Typography>
            </Box>
          )),
        )}
      </Collapse>
    </Box>
  );
};

export default RouteRoad;
