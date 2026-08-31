import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { getReadableCurrency } from 'src/hooks/useIntl';
import { UITableSort } from 'src/slices/filter.types';
import { getTokens, resetTokens } from 'src/slices/tables/tokens';
import { useDispatch, useSelector } from 'src/store';
import { ISource } from 'src/types/search';
import DashboardCard from 'src/ui/DashboardCard';

const useStyles = makeStyles(() => ({
  viewButton: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  trendingList: {
    '& > div': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
}));

export const TrendingCard = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { network } = useParams();

  const { tokens, loading } = useSelector((state) => state.tokens);

  useEffect(() => {
    // Get trending tokens
    dispatch(
      getTokens(
        {
          verified: true,
          page: 0,
          size: 10,
          orderBy: ['update_date', 'market_cap'],
          orderDir: UITableSort.desc,
          kind: ['token'],
        },
        ['name', 'price_usd', 'market_cap', 'address'],
      ),
    );

    return () => dispatch(resetTokens());
  }, [network]);

  const getSortedTokens = useMemo(() => [...tokens]?.sort((a, b) => b.market_cap - a.market_cap), [tokens]);

  return (
    <DashboardCard
      trendingCard
      cardActions={
        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
          <Button className={classes.viewButton} fullWidth variant="contained" href={`/${network}/token`}>
            {t('VIEW MORE')}
          </Button>
        </Box>
      }
    >
      <>
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
          <Typography paddingRight={1} color="textPrimary" fontWeight={700} fontSize="20px">
            {t('Trending')}
          </Typography>
        </Box>
        <Divider variant="fullWidth" flexItem />
        {tokens && !loading ? (
          <Box mt={2} display="flex" justifyContent="space-between" flexDirection="column">
            <List className={classes.trendingList}>
              {getSortedTokens.map((token, idx) => (
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                <TrendingItem key={token.identifier} token={token} index={idx + 1} network={network} />
              ))}
            </List>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        )}
      </>
    </DashboardCard>
  );
};

interface ITrendingItemProps {
  index: number;
  token: ISource;
  network: string;
}

const TrendingItem: FC<ITrendingItemProps> = ({ index, token, network }) => {
  const navigate = useNavigate();
  const marketCapValue = getReadableCurrency(token.market_cap);
  const marketCapLabel = marketCapValue ? `$${marketCapValue}` : '--';

  const onItemClick = () => {
    navigate(`/${network}/token/${token.address}`);
  };

  return (
    <ListItem button onClick={onItemClick}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={2}>
          <Typography marginRight={2} color="textPrimary" fontWeight={700} fontSize="18px">
            {index}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography marginRight={2} color="textPrimary" fontSize="16px" overflow="hidden" textOverflow="ellipsis">
            {token.name.length > 20 ? `${token.name.substr(0, 19)}...` : token.name || token.symbol}
          </Typography>
        </Grid>
        <Grid item xs={3} display="flex" justifyContent="flex-end">
          <Typography color="textPrimary" fontSize="16px" overflow="hidden" textOverflow="ellipsis">
            {marketCapLabel}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};
