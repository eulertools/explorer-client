import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveGlobalModals } from 'src/selectors/globalModals';
import { GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerModalType } from './types/EulerModalType';

export const EulerModal = () => {
  const activeModals = useSelector(selectActiveGlobalModals);
  return (
    <>
      {activeModals.map((props: GlobalModalItem) => (
        <EulerModalType key={props.identifier} {...props} />
      ))}
    </>
  );
};
