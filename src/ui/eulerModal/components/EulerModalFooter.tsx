import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DialogActions, Button, Box } from '@material-ui/core';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { useStyles } from '../styles';

interface EulerModalFooterProps {
  leftAction?: React.ReactChild;
  showClose?: boolean;
  layout?: 'space-between' | 'center';
  modal: GlobalModalItem;
}

export const EulerModalFooter: React.FC<EulerModalFooterProps> = (props) => {
  const { children, leftAction, showClose, modal, layout = 'center' } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const handleClose = React.useCallback(() => dispatch(closeModal(modal)), [modal]);
  return (
    <DialogActions classes={{ root: classes.dialogActions }}>
      <Box mt={2} display="grid" gridTemplateColumns={leftAction ? 'auto 1fr' : '100%'} width="100%">
        {leftAction ? <Box>{leftAction}</Box> : null}
        <Box
          display="grid"
          alignItems={layout}
          justifyContent={layout}
          ml={leftAction ? 'auto' : undefined}
          gridTemplateColumns={showClose ? 'auto auto' : 'auto'}
          columnGap={showClose ? 2 : undefined}
        >
          <Box>
            {showClose ? (
              <Button variant="outlined" onClick={handleClose}>
                {t('Cancel').toUpperCase()}
              </Button>
            ) : null}
          </Box>
          <Box>{children}</Box>
        </Box>
      </Box>
    </DialogActions>
  );
};
