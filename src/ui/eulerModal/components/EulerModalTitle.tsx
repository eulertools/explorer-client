import React from 'react';
import { useDispatch } from 'react-redux';
import { DialogTitle, Typography, IconButton, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { useStyles } from '../styles';

interface EulerModalTitleProps {
  layout?: 'center' | 'flex-start';
  title: string;
  modal: GlobalModalItem;
  showAddress?: boolean;
}

export const EulerModalTitle = (props: EulerModalTitleProps) => {
  const { showAddress = true } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const handleClose = React.useCallback(() => {
    dispatch(closeModal(props.modal));
    props.modal.config.onClose?.();
  }, [props.modal]);

  return (
    <DialogTitle id="preview-popup-modal-title">
      <Box display="grid" justifyContent={props.layout} pb={1} classes={classes.header} minWidth="calc(400px, 100%)">
        <Typography color="terciary.700" fontSize={18} fontWeight={700} pr={2}>
          {props.title}
        </Typography>
      </Box>
      {showAddress ? (
        <Box display="grid" justifyContent={props.layout || 'flex-start'} pb={1}>
          <EulerAddress
            address={props.modal.identifier}
            addressRender={EulerAddressRenderTypes.truncate_right}
            showSeeDetailLink={false}
            hashColor={theme.palette.text.primary}
            hashIconColor={theme.palette.primary.main}
          />
        </Box>
      ) : null}
      <IconButton aria-label="close" size="medium" onClick={handleClose} classes={{ root: classes.closeButton }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};
