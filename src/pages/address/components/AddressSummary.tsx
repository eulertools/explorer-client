import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import { selectAddressDetail } from 'src/selectors/address';
import { EulerLabelValueRow } from 'src/ui/EulerLabelValueRow';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

const AddressSummary = memo(() => {
  const { t } = useTranslation();
  const addressDetail = useSelector(selectAddressDetail);
  const [BUSDBalance, setBUSDBalance] = useState('');
  const [WBNBBalance, setWBNBBalance] = useState('');

  useEffect(() => {
    if (addressDetail) {
      const totalBUSD = getBigNumberCurrencyLabel(addressDetail.total);
      const totalWBNB = getBigNumberCurrencyLabel(addressDetail.balance);
      setBUSDBalance(totalBUSD);
      setWBNBBalance(totalWBNB);
    }
  }, [addressDetail]);

  if (!addressDetail) return null;

  return (
    <Box pt={1} pb={0} fontSize={13} fontWeight={500} color="terciary.700">
      <EulerLabelValueRow label={t('Balance')} value={BUSDBalance ? `${BUSDBalance} BUSD` : 'Not Available'} />
      <EulerLabelValueRow label={t('BNB Balance')} value={WBNBBalance ? `${WBNBBalance} BNB` : 'Not Available'} />
      <EulerLabelValueRow label={t('My Name Tag')} value={t('Not Available')} />
      <EulerLabelValueRow label={t('Blocks Validated')} value={t('Not Available')} />
    </Box>
  );
});

const AddressSummaryWrapper = () => (
  <CoinDataProvider>
    <AddressSummary />
  </CoinDataProvider>
);

export default AddressSummaryWrapper;
