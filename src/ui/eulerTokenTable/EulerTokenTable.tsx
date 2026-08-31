import { ExtendedTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import useCoinData from 'src/hooks/useCoinData';
import { TokenDTO } from 'src/types/token';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { getAmountPriceToken } from 'src/utils/price';
import { columns, favColumn, portColumn } from './columns';

const useStyles = makeStyles((theme) => ({
  table: {
    '& .MuiDataGrid-root': {
      fontSize: '13px',
      color: ((theme as unknown) as ExtendedTheme).palette.terciary[700],
    },
  },
}));

interface EulerTokenTableProps extends Partial<EulerTableProps> {
  tokens: TokenDTO[];
  showFavorite?: boolean;
  showPortfolio?: boolean;
}
const EulerTokenTable = (props: EulerTokenTableProps) => {
  const classes = useStyles();
  const { bnbData } = useCoinData();
  const { tokens = [], showFavorite = false, showPortfolio = false, ...otherTableProps } = props;

  // flat
  const rows = React.useMemo(
    () =>
      tokens.map((t, index) => {
        const value = getAmountPriceToken(t);
        const valueBNB = new BigNumber(value).div(bnbData?.price ?? 1);

        return {
          value,
          valueBNB,
          id: index,
          name: t.name || t.token?._source?.base_token_name,
          quantity: t.quantity,
          // flat
          _id: t.token?._id,
          found: t.token?.found,
          // flat
          ...(t.token?._source || {}),
        };
      }),
    [tokens, bnbData],
  );
  const customColumns = React.useMemo(() => {
    const newColumns = [...columns];
    if (showPortfolio) newColumns.unshift(portColumn);
    if (showFavorite) newColumns.unshift(favColumn);
    return newColumns;
  }, [columns, portColumn, favColumn, showPortfolio, showFavorite]);

  return (
    <Box width="100%" overflow="auto">
      <Box>
        <EulerTable {...otherTableProps} rows={rows} columns={customColumns} classes={{ root: classes.table }} />
      </Box>
    </Box>
  );
};

const EulerTokenTableWrapper = (props: EulerTokenTableProps) => (
  <CoinDataProvider>
    <EulerTokenTable {...props} />
  </CoinDataProvider>
);

export default EulerTokenTableWrapper;
