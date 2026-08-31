import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import Dialog from '@material-ui/core/Dialog';
import { closeModal, GlobalModalItem, UIModal } from 'src/slices/ui/globalModal';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { EulerModalDetailAddress } from './EulerModalDetailAddress';
import { EulerModalDetailContract } from './EulerModalDetailContract';
import { EulerModalDetailPair } from './EulerModalDetailPair';
import { EulerModalDetailTxns } from './EulerModalDetailTxns';
import { EulerModalNft } from './EulerModalNft';
import { EulerModalSubscription } from './EulerModalSubcription';

export const EulerModalType = (props: GlobalModalItem) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const ref = React.useRef(false);
  const handleClose = React.useCallback(() => {
    dispatch(closeModal(props));
  }, []);
  React.useEffect(() => {
    if (ref.current) dispatch(closeModal(props));
    else ref.current = true;
  }, [pathname]);

  const Component = React.useMemo(() => {
    switch (props.type) {
      // Entities
      case EulerAddressTypes.contract:
        return EulerModalDetailContract;
      case EulerAddressTypes.txns:
        return EulerModalDetailTxns;
      case EulerAddressTypes.address:
        return EulerModalDetailAddress;
      case EulerAddressTypes.lptoken:
        return EulerModalDetailPair;
      // ui
      case UIModal.subscription:
        return EulerModalSubscription;
      case UIModal.nft:
        return EulerModalNft;
      default:
        return EulerModalDetailContract;
    }
  }, [props]);

  return (
    <Dialog key={props.identifier} open id={props.identifier} onClose={handleClose} maxWidth="lg">
      <Component key={props.identifier} {...props} />
    </Dialog>
  );
};
