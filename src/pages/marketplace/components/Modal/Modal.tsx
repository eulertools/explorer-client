import { FC, useMemo, forwardRef, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from '@material-ui/icons/Link';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import { WalletRequiredGuard } from 'src/components/WalletRequiredGuard';
import { MarketplaceContext, initialPurchaseObject } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { Purchase } from 'src/pages/marketplace/components/Purchase/Purchase';
import { Sale } from 'src/pages/marketplace/components/Sale/Sale';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { useDispatch } from 'src/store';
import { marketSaleTypeOptions, EMarketContractSteps } from 'src/types/marketplace';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...(props as any)} />);

const ModalContent: FC<{ activeModal: string; error: string }> = ({ activeModal, error }) => {
  if (activeModal === 'sale') {
    return <Sale />;
  }

  if (activeModal === 'purchase') {
    return <Purchase />;
  }

  return (
    <Box p={1} pt={2}>
      <Typography textAlign="center">{error}</Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogMain: {
    '& > .MuiDialog-container > div': {
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
      borderRadius: '50px',
      [theme.breakpoints.down('sm')]: {
        borderRadius: 0,
      },
    },
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    fontFamily: theme.typography.fontFamily,
  },
  dialogTitle: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
  },
  dialogTitleText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.2rem',
    fontWeight: 600,
  },
}));

interface IModalProps extends DialogProps {
  onCancel: () => void;
}

export const Modal: FC<IModalProps> = ({ onCancel, ...dialogProps }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { sale } = useSelector(selectMarketplace);
  const { sale: saleModal, modal, updateModal, purchase } = useContext(MarketplaceContext);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const modalTitle = useMemo(() => marketSaleTypeOptions.find((i) => i.key === modal.kind)?.label.toUpperCase(), [
    modal.kind,
  ]);

  const dialogOptions: Partial<DialogProps> = useMemo(
    () =>
      isMobile ? { fullScreen: true, TransitionComponent: Transition as any } : { maxWidth: 'lg', fullWidth: true },
    [isMobile],
  );

  useEffect(() => {
    if (modal.id && modal.step === EMarketContractSteps.CONFIRMED) {
      dispatch(getSale(modal.id.toString()));
    }
  }, [modal.step]);

  useEffect(() => {
    if (sale !== initialPurchaseObject) {
      updateModal((prev) => ({
        ...prev,
        loading: false,
        data: sale,
      }));
    }
  }, [sale]);

  useEffect(() => {
    if (modal.activeModal === 'sale') {
      updateModal((prev) => ({ ...prev, kind: saleModal.kind }));
    }
  }, [saleModal.kind, modal.activeModal]);

  return (
    <Dialog className={classes.dialogMain} {...dialogProps} {...dialogOptions}>
      <DialogTitle id="market-dialog" className={classes.dialogTitle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" pb={1} minWidth="calc(400px, 100%)">
          <Typography color="primary" className={classes.dialogTitleText}>
            {modal.activeModal === 'purchase' ? `${modalTitle} DETAILS` : `CREATING ${modalTitle}`}
            {modal.activeModal === 'purchase' ? (
              <>
                {' #'}
                {purchase.identifier}
                <IconCopyToClipboard
                  text={`${window.location.toString()}/${purchase.identifier}`}
                  copyText="Copy Share Link"
                  icon={<LinkIcon />}
                />
              </>
            ) : null}
          </Typography>
          <IconButton aria-label="close" color="primary" size="medium" onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <WalletRequiredGuard>
        <DialogContent className={classes.dialogContent}>
          <ModalContent activeModal={modal.activeModal} error={modal.error} />
        </DialogContent>
      </WalletRequiredGuard>
    </Dialog>
  );
};
