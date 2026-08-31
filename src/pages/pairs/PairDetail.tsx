import { FC, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import { AppSkeleton } from 'src/components/templates';
import PairCardHeader from 'src/pages/pairs/components/PairCardHeader';
import PairDetailsContainer from 'src/pages/pairs/components/PairDetailsContainer';
import PairExchangeContainer from 'src/pages/pairs/components/PairExchangeContainer';
import { selectPairDetailDataByAddress } from 'src/selectors/pairDetail';
import { getPair } from 'src/slices/entities/pairDetail';
import { useDispatch, useSelector } from 'src/store';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerPairCard } from 'src/ui/EulerPairCard';
import { EulerTabs } from 'src/ui/EulerTabs';
import { PageTitle } from 'src/ui/PageTitle';

const useStyles = makeStyles((theme) => ({
  tokenGrids: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginLeft: '1px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      marginLeft: 0,
    },
  },
  pairCardGrid: {
    marginTop: 0,
  },
}));

const PairDetail: FC = () => {
  const classes = useStyles();
  const { pair, network } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { detail: pairDetails } = useSelector(selectPairDetailDataByAddress(pair));

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (pair) {
      dispatch(getPair(pair));
    }
  }, [pair, network]);

  useEffect(() => {
    setSelectedTab(0);
  }, [location]);

  if (!pairDetails) return <ScreenSpinner />;

  return (
    <AppSkeleton>
      <PageTitle pageTitle={`${pairDetails?.symbol || pair} Pair`} />
      <Grid container display="flex" spacing={2}>
        <Grid item xs={12} lg={7} xl={5} display="flex" flexDirection="column" justifyContent="center">
          <EulerPairCard pair={pairDetails} />
        </Grid>
        <Grid className={classes.pairCardGrid} item xs={12} lg={5} xl={7}>
          <PairCardHeader pairDetails={pairDetails} />
        </Grid>
        <EulerTabs titles={['Pair', 'Exchange']} selected={selectedTab} setSelected={setSelectedTab} />
        <Grid item xs={12}>
          <BasicTabPanel value={selectedTab} index={0}>
            <PairDetailsContainer address={pair} />
          </BasicTabPanel>
          <BasicTabPanel value={selectedTab} index={1}>
            <PairExchangeContainer address={pair} />
          </BasicTabPanel>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

export default PairDetail;
