import _isEmpty from 'lodash/isEmpty';
import { FC, useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import Alert from '@material-ui/core/Alert';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import { AppSkeleton } from 'src/components/templates';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import Project from 'src/pages/tokens/components/Project/Project';
import RubicWidget from 'src/pages/tokens/components/Token/RubicWidget';
import TokenCardHeader from 'src/pages/tokens/components/Token/TokenCardHeader';
import TokenPairTransactionContainer from 'src/pages/tokens/components/Token/TokenPairTransactionContainer';
import { TokenChart } from 'src/pages/tokens/components/TokenChart';
import { UITableID } from 'src/slices/filter.types';
import { getExchanges } from 'src/slices/tables/exchanges';
import slice, { getToken } from 'src/slices/tables/tokens';
import { setFilterValue } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';
import { ISource } from 'src/types/search';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerAlert } from 'src/ui/EulerAlert';
import { EulerTabs } from 'src/ui/EulerTabs';
import { EulerTokenCard } from 'src/ui/EulerTokenCard';
import { PageTitle } from 'src/ui/PageTitle';
import Security from './components/Security/Security';

interface ITokenDetailProps {
  token: ISource;
}

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

const TokenDetail: FC<ITokenDetailProps> = ({ token }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const projectDataNotFound = useMemo(() => _isEmpty(token.coin), [token.coin]);

  return (
    <AppSkeleton>
      <PageTitle pageTitle={`${token.name} (${token.symbol})`} />
      <Grid container display="flex" spacing={2}>
        <Grid item xs={12} lg={7} xl={9} display="flex" alignItems="center">
          <EulerTokenCard token={token} />
        </Grid>
        {token.rugged && token.rugged_message ? (
          <>
            <Grid item xs={12} mt={2} display="flex">
              <Box marginRight={2}>
                <Avatar alt="Remy Sharp" src="/static/rugzombie-logo.png" className={classes.large} />
              </Box>
              <Alert variant="filled" severity="error">
                {token.rugged_message}
              </Alert>
            </Grid>
          </>
        ) : null}
        <Grid item xs={12} lg={5} xl={3} display="flex" alignItems="center">
          <TokenCardHeader token={token} />
        </Grid>
        <EulerTabs titles={['Token', 'Project', 'Security']} selected={selectedTab} setSelected={setSelectedTab} />
        <Grid item xs={12}>
          <BasicTabPanel value={selectedTab} index={0}>
            <Box mt={2}>
              <RubicWidget token={token} />
              <Box height={550} mt={2}>
                <TokenChart name={token.name} symbol={token.symbol} tokenContract={token.address} />
              </Box>
              <TokenPairTransactionContainer address={token.address} />
            </Box>
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={1}>
            {projectDataNotFound ? (
              <Box pt={2}>
                <EulerAlert type="info" message={t('TOKEN.PROJECT_NOT_FOUND')} customIcon />
              </Box>
            ) : (
              <Project token={token} />
            )}
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={2}>
            <Security tokenAddress={token?.address} />
          </BasicTabPanel>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

const TokenDetailWrapper = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token = null, loading } = useSelector((state) => state.tokens);
  const { exchanges } = useSelector((state) => state.exchanges);
  const { address, network } = useParams();
  const navigate = useNavigate();
  const tableId = UITableID.token_trade_list;
  const { chain } = useContext(ConfigurationContext);

  const sortableExchanges = [...exchanges.hits];
  const sorted = sortableExchanges?.sort((a, b) => a._source.readable_update_date - b._source.readable_update_date);

  useEffect(() => {
    if (chain.bsc.tokens.euler.address === address) {
      navigate('/token/euler');

      return () => {};
    }

    dispatch(getToken(address));

    return () => {
      dispatch(slice.actions.setToken({ token: null }));
    };
  }, [address, network]);

  useEffect(() => {
    if (token && exchanges && sorted[0]) {
      dispatch(
        setFilterValue(tableId, {
          filterName: 'tradePair',
          filterValue: {
            pairAddress: sorted[0]._source.address,
            baseAddress: sorted[0]._source.base_token_address,
            base: sorted[0]._source.base_token_symbol,
            quote: sorted[0]._source.quote_token_symbol,
          },
        }),
      );
    }
  }, [exchanges]);

  useEffect(() => {
    if (token) {
      dispatch(getExchanges(token.address, null, { size: 20, page: 0 }));
    }
  }, [token]);

  if (loading) {
    return <ScreenSpinner />;
  }

  return !token ? (
    <Box py={4} px={2}>
      <EulerAlert type="info" message={t('TOKEN.TOKEN_NOT_FOUND')} customIcon />
    </Box>
  ) : (
    <TokenDetail token={token} />
  );
};

export default TokenDetailWrapper;
