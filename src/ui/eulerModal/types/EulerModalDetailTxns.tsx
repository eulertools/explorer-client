import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ReactTimeAgo from 'react-time-ago';
import { Box, Button, Card, Chip, useTheme } from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { selectTxnsDataByAddress } from 'src/selectors/txns';
import { getTxns } from 'src/slices/tables/txns';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerAddress, EulerAddressTypes } from 'src/ui/EulerAddress';
import { EulerLabelValueRow } from 'src/ui/EulerLabelValueRow';
import { EulerLoading } from 'src/ui/EulerLoading';
import { EulerModalContent } from '../components/EulerModalContent';
import { EulerModalFooter } from '../components/EulerModalFooter';
import { EulerModalTitle } from '../components/EulerModalTitle';

export const EulerModalDetailTxns = (props: GlobalModalItem) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { detail: txnsDetail } = useSelector(selectTxnsDataByAddress(props.identifier)) || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const href = `/${settings.network}/tx/${props.identifier}`;
  const handleConfirm = React.useCallback(
    (e) => {
      e.preventDefault();
      dispatch(closeModal(props));
      navigate(href);
    },
    [props.identifier],
  );
  React.useEffect(() => {
    dispatch(getTxns(props.identifier));
  }, []);
  return (
    <Box>
      <EulerModalTitle modal={props} title={t('Transaction Summary')} />
      <EulerModalContent>
        {!txnsDetail ? (
          <EulerLoading />
        ) : (
          <Box pt={2} width="100%">
            <Card>
              <Box p={1} pt={2}>
                <EulerLabelValueRow
                  label={t('Status')}
                  value={
                    txnsDetail.status === 1 ? (
                      <Chip color="primary" style={{ backgroundColor: theme.palette.success.main }} label="Success" />
                    ) : (
                      <Chip color="primary" style={{ backgroundColor: theme.palette.error.main }} label="Failure" />
                    )
                  }
                />
                <EulerLabelValueRow
                  label={t('Timestamp')}
                  value={<ReactTimeAgo date={new Date(txnsDetail.block_timestamp)} timeStyle="round" tooltip={false} />}
                />
                <EulerLabelValueRow label={t('Block')} value={txnsDetail.block_number} />
                <EulerLabelValueRow
                  label={t('From')}
                  value={<EulerAddress address={txnsDetail.from} addressType={EulerAddressTypes.address} />}
                />
                <EulerLabelValueRow
                  label={t('To')}
                  value={<EulerAddress address={txnsDetail.to} addressType={EulerAddressTypes.address} />}
                  showSeparator={false}
                />
              </Box>
            </Card>
          </Box>
        )}
      </EulerModalContent>
      <EulerModalFooter showClose modal={props}>
        <Button href={href} variant="contained" onClick={handleConfirm}>
          {t('VIEW DETAILS')}
        </Button>
      </EulerModalFooter>
    </Box>
  );
};
