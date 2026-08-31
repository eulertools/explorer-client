import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Box, useTheme } from '@material-ui/core';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import useSettings from 'src/hooks/useSettings';
import AddressSummaryWrapper from 'src/pages/address/components/AddressSummary';
import { ButtonSecondary } from 'src/pages/nftcreate/components/ButtonSecondary';
import { selectAddressDetailTokensWithQuantity } from 'src/selectors/address';
import { getAddressDetail } from 'src/slices/entities/address';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerModalContent } from '../components/EulerModalContent';
import { EulerModalTitle } from '../components/EulerModalTitle';

export const EulerModalDetailAddress = (props: GlobalModalItem) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const addressDetailTokens = useSelector(selectAddressDetailTokensWithQuantity);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const handleConfirm = React.useCallback(() => {
    dispatch(closeModal(props));
    navigate(`/${settings.network}/address/${props.identifier}`);
  }, [props.identifier]);

  useEffect(() => {
    dispatch(getAddressDetail(props.identifier));
  }, []);

  return (
    <Box
      width="100%"
      sx={{
        [theme.breakpoints.up('xl')]: {
          minWidth: '20vw',
        },
        [theme.breakpoints.up('lg')]: {
          minWidth: '25vw',
        },
        [theme.breakpoints.up('md')]: {
          minWidth: '30vw',
        },
      }}
    >
      <EulerModalTitle modal={props} title={t('Address Summary')} showAddress={false} />
      <EulerModalContent>
        {!addressDetailTokens ? (
          <EulerLoading />
        ) : (
          <CoinDataProvider>
            <AddressSummaryWrapper />
          </CoinDataProvider>
        )}
      </EulerModalContent>
      <Box margin={3}>
        <ButtonSecondary onClick={handleConfirm} fullWidth>
          {t('View detail')}
        </ButtonSecondary>
      </Box>
    </Box>
  );
};
