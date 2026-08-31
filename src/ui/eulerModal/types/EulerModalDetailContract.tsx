import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Box, Button } from '@material-ui/core';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import useSettings from 'src/hooks/useSettings';
import AddressSummaryWrapper from 'src/pages/address/components/AddressSummary';
import { selectAddressDetailTokensWithQuantity } from 'src/selectors/address';
import { getAddressDetail } from 'src/slices/entities/address';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerModalContent } from '../components/EulerModalContent';
import { EulerModalFooter } from '../components/EulerModalFooter';
import { EulerModalTitle } from '../components/EulerModalTitle';

export const EulerModalDetailContract = (props: GlobalModalItem) => {
  const dispatch = useDispatch();
  const addressDetailTokens = useSelector(selectAddressDetailTokensWithQuantity);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const handleConfirm = useCallback(() => {
    dispatch(closeModal(props));
    navigate(`/${settings.network}/address/${props.identifier}`);
  }, [props.identifier]);

  useEffect(() => {
    dispatch(getAddressDetail(props.identifier));
  }, []);
  return (
    <Box>
      <EulerModalTitle modal={props} title={t('Contract Summary')} />
      <EulerModalContent>
        {!addressDetailTokens ? (
          <EulerLoading />
        ) : (
          <CoinDataProvider>
            <AddressSummaryWrapper />
          </CoinDataProvider>
        )}
      </EulerModalContent>
      <EulerModalFooter showClose modal={props}>
        <Button variant="contained" onClick={handleConfirm}>
          {t('View detail')}
        </Button>
      </EulerModalFooter>
    </Box>
  );
};
