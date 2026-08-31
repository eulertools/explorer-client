import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { marketContractStepOptions } from 'src/types/marketplace';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(0.75, 3),
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: `${theme.palette.error.dark} !important`,
    },
  },
}));

interface IPurchaseActionsProps {
  callToAction: () => void;
  buttonText: string;
}

export const PurchaseActions: FC<IPurchaseActionsProps> = ({ callToAction, buttonText }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { modal, purchaseState } = useContext(MarketplaceContext);

  const contractStep = useMemo(() => marketContractStepOptions.find((i) => i.key === modal.step)?.label, [modal.step]);

  const disabledClaim = useMemo(() => {
    if (buttonText === 'CLAIM' && !purchaseState.allClaimed && !purchaseState.canClaim) {
      return true;
    }
    return false;
  }, [buttonText, purchaseState]);

  return (
    <LoadingButton
      classes={{ root: buttonText === 'CANCEL' ? classes.cancelButton : null }}
      loading={modal.loading}
      loadingPosition="end"
      endIcon={<></>}
      fullWidth
      onClick={callToAction}
      className={classes.button}
      color="primary"
      size="large"
      variant="contained"
      disabled={disabledClaim}
    >
      {!modal.loading ? t(buttonText) : `${contractStep}`}
    </LoadingButton>
  );
};
