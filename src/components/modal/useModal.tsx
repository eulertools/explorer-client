import { useCallback, useContext, useEffect, useRef } from 'react';
import ModalContext from './ModalContext';
import { ShowFn } from './types';
import { uid } from './utils';

type Options = {
  disableAutoDestroy?: boolean;
};

const defaultOptions: Options = {
  disableAutoDestroy: false,
};

export default function useModal(options: Options = defaultOptions) {
  const { disableAutoDestroy } = { ...defaultOptions, ...options };
  const { showModal, destroyModalsByRootId: destroy, ...otherContextProps } = useContext(ModalContext);
  const id = useRef<string>(uid(6));

  useEffect(
    () => () => {
      if (!disableAutoDestroy) {
        destroy(id.current);
      }
    },
    [disableAutoDestroy, destroy],
  );

  const handleShowModal = useCallback(
    (_id: string): ShowFn => (component, props, _options) => showModal(component, props, { rootId: _id, ..._options }),
    [showModal],
  );

  return {
    showModal: handleShowModal(id.current),
    ...otherContextProps,
  };
}
