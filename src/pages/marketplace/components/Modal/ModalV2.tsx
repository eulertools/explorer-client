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
import { WalletRequiredGuard } from 'src/components/WalletRequiredGuard';
import { MarketplaceContext, initialPurchaseObject } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { PurchaseV2 } from 'src/pages/marketplace/components/Purchase/PurchaseV2';
import { SaleV2 } from 'src/pages/marketplace/components/Sale/SaleV2';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { useDispatch } from 'src/store';
import { EMarketContractSteps } from 'src/types/marketplace';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...(props as any)} />);

const ModalContentV2: FC<{ activeModal: string; error: string }> = ({ activeModal, error }) => {
  if (activeModal === 'sale') {
    return <SaleV2 />;
  }

  if (activeModal === 'purchase') {
    return <PurchaseV2 />;
  }

  return (
    <Box p={1} pt={2}>
      <Typography textAlign="center">{error}</Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  buyDialogMain: {
    '& > .MuiDialog-container > div': {
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
      [theme.breakpoints.up('sm')]: {
        maxWidth: '420px',
        borderRadius: '16px',
      },
    },
  },
  saleDialogMain: {
    '& > .MuiDialog-container > div': {
      [theme.breakpoints.down('sm')]: {
        borderRadius: 0,
      },
      maxWidth: '600px',
      minHeight: '569px',
    },
  },
}));

interface IModalProps extends DialogProps {
  onCancel: () => void;
}

export const ModalV2: FC<IModalProps> = ({ onCancel, ...dialogProps }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { sale } = useSelector(selectMarketplace);
  const { sale: saleModal, modal, updateModal, tab, purchaseState } = useContext(MarketplaceContext);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Dialog
      className={modal.activeModal === 'sale' ? classes.saleDialogMain : classes.buyDialogMain}
      {...dialogProps}
      {...dialogOptions}
      fullWidth={modal.activeModal === 'sale'}
    >
      <DialogTitle id="market-dialog" sx={{ padding: theme.spacing(2, 3, 0, 3) }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
          {tab === 1 ? (
            <>
              {modal.step === EMarketContractSteps.CONFIRMED ? (
                <Typography color="terciary.700" fontWeight={700} fontSize="18px">
                  {modal.activeModal === 'purchase' ? 'Congratulations' : ''}
                </Typography>
              ) : (
                <Typography color="terciary.700" fontWeight={700} fontSize="18px">
                  {modal.activeModal === 'purchase' ? 'Buy' : 'Post ad'}
                </Typography>
              )}
              <IconButton aria-label="close" color="inherit" size="medium" onClick={onCancel}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography color="terciary.700" fontWeight={700} fontSize="18px">
                {purchaseState.canCancel ? 'Ad detail' : 'Purchase detail'}
              </Typography>
              <IconButton aria-label="close" color="inherit" size="medium" onClick={onCancel}>
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>
      </DialogTitle>
      {modal.activeModal === 'sale' ? (
        <DialogContent>
          <ModalContentV2 activeModal={modal.activeModal} error={modal.error} />
        </DialogContent>
      ) : (
        <WalletRequiredGuard>
          <DialogContent>
            <ModalContentV2 activeModal={modal.activeModal} error={modal.error} />
          </DialogContent>
        </WalletRequiredGuard>
      )}
    </Dialog>
  );
};
