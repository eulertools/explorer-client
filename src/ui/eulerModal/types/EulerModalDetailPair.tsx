import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import PairCard from 'src/pages/pairs/components/PairCard';
import PairTradingWidget from 'src/pages/pairs/components/PairTradingWidget';
import { selectPairDetailDataByAddress } from 'src/selectors/pairDetail';
import { selectPoolDetailDataByAddress } from 'src/selectors/poolDetail';
import { getPair } from 'src/slices/entities/pairDetail';
import { getPool } from 'src/slices/entities/poolDetail';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { BasicTabPanel } from 'src/ui/BasicTabPanel';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerTabs } from 'src/ui/EulerTabs';
import { EulerModalContent } from 'src/ui/eulerModal/components/EulerModalContent';
import { EulerModalFooter } from 'src/ui/eulerModal/components/EulerModalFooter';
import { EulerModalPairTitle } from 'src/ui/eulerModal/components/EulerModalPairTitle';

const useStyles = makeStyles(() => ({
  mainContainer: {
    '& > #preview-popup-modal-title': {
      paddingBottom: 0,
    },
  },
  mainGrid: {
    '& > div:first-child': {
      paddingTop: 0,
      marginTop: 0,
      '& > div': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
    },
  },
}));

export const EulerModalDetailPair = (props: GlobalModalItem) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { detail: pairDetails, error: errorPair } = useSelector(selectPairDetailDataByAddress(props.identifier));
  const { detail: poolDetails, error: errorPool } = useSelector(selectPoolDetailDataByAddress(props.identifier));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const { settings } = useSettings();

  const handleConfirm = useCallback(() => {
    dispatch(closeModal(props));
    navigate(`/${settings.network}/pair/${props.identifier}`);
  }, [props.identifier]);

  useEffect(() => {
    dispatch(getPair(props.identifier));
    dispatch(getPool(props.identifier));
  }, []);
  return (
    <Box className={classes.mainContainer}>
      <EulerModalPairTitle modal={props} layout="flex-start" details={pairDetails} />
      <EulerModalContent>
        {errorPair || errorPool ? <EulerError error={errorPair || errorPool} /> : null}
        {!pairDetails || !poolDetails ? (
          <EulerLoading />
        ) : (
          <Box minWidth="min(400px, 100%)">
            <Grid className={classes.mainGrid} container display="flex" spacing={2}>
              <EulerTabs titles={['Pair', 'Chart']} selected={selectedTab} setSelected={setSelectedTab} />
              <Grid item xs={12}>
                <BasicTabPanel value={selectedTab} index={0}>
                  <PairCard
                    pairDetails={pairDetails}
                    baseValue={poolDetails.price}
                    quoteValue={poolDetails.token1.balance / poolDetails.token2.balance}
                    liquidityBase={poolDetails.token1.balance}
                    liquidityQuote={poolDetails.token2.balance}
                    lpPrice={0}
                  />
                </BasicTabPanel>
                <BasicTabPanel value={selectedTab} index={1}>
                  <PairTradingWidget pairDetails={pairDetails} height="calc(100vh - 625px)" />
                </BasicTabPanel>
              </Grid>
            </Grid>
          </Box>
        )}
      </EulerModalContent>
      <EulerModalFooter showClose modal={props} layout="center">
        <Button variant="contained" onClick={handleConfirm}>
          {t('VIEW DETAILS')}
        </Button>
      </EulerModalFooter>
    </Box>
  );
};
