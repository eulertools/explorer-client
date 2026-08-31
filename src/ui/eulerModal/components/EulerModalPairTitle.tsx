import React from 'react';
import { useDispatch } from 'react-redux';
import { DialogTitle, IconButton, Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { closeModal, GlobalModalItem } from 'src/slices/ui/globalModal';
import { EulerEntityTitle } from 'src/ui/EulerEntityTitle';
import { useStyles } from '../styles';

interface EulerModalPairTitleProps {
  layout?: 'center' | 'flex-start';
  modal: GlobalModalItem;
  details: any;
}

export const EulerModalPairTitle = (props: EulerModalPairTitleProps) => {
  const { details } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleClose = React.useCallback(() => {
    dispatch(closeModal(props.modal));
  }, [props.modal]);

  return (
    <DialogTitle id="preview-popup-modal-title">
      <Grid container pb={1}>
        <Grid item xs={12}>
          <EulerEntityTitle
            title={details?.symbol?.replace('-', '/')}
            address={details?.address}
            layout={props.layout}
            logo={
              <TokenPairAvatars
                baseTokenAddress={details?.base_token_address}
                quoteTokenAddress={details?.quote_token_address}
              />
            }
            showButtons
            symbol={details?.symbol}
            favoriteId={details?.identifier}
            portfolioName={details?.name}
            portfolioId={details?.address}
            portfolioEntity={EPortfolioItemType.PAIR}
          />
        </Grid>
      </Grid>
      <IconButton aria-label="close" size="medium" onClick={handleClose} classes={{ root: classes.miniCloseButton }}>
        <CloseIcon />
      </IconButton>
      <Divider />
    </DialogTitle>
  );
};
