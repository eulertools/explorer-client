import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import PairTradingWidget from 'src/pages/pairs/components/PairTradingWidget';
import PairTransactionContainer from 'src/pages/pairs/components/PairTransactionContainer';
import { selectPairDetailDataByAddress } from 'src/selectors/pairDetail';
import { useSelector } from 'src/store';

interface PairDetailsContainerProps {
  address: string;
}

const PairDetailsContainer = ({ address }: PairDetailsContainerProps) => {
  const { t } = useTranslation();
  const { detail: pairDetails, error: errorPair, loading } = useSelector(selectPairDetailDataByAddress(address));

  if (errorPair) {
    return <Typography color="textPrimary">{t('PAIRS.ERROR_WARNING')}</Typography>;
  }

  // Check if last State has been set properly.
  if (!pairDetails || loading) {
    return <ScreenSpinner />;
  }

  if (pairDetails === null) {
    return <Typography color="textPrimary">{t('PAIRS.PAIR_NOT_FOUND')}</Typography>;
  }
  return (
    <>
      <PairTradingWidget pairDetails={pairDetails} height="calc(100vh - 375px)" />
      <PairTransactionContainer pairDetails={pairDetails} />
    </>
  );
};

export default PairDetailsContainer;
