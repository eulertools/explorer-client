import { ExtendedTheme } from '@eulertools/ui';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { marketContractStepOptions } from 'src/types/marketplace';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.spacing(1.25),
    fontSize: '16px',
    fontWeight: 600,
    backgroundColor: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    boxShadow: 'none',
  },
  cancelButton: {
    color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    backgroundColor: 'transparent',
    boxShadow: 'none',
    fontSize: '16px',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'inherit',
      color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    },
  },
}));

interface IPurchaseActionsProps {
  callToAction: () => void;
  buttonText: string;
  endIcon: React.ReactNode;
}

export const PurchaseActionsV2: FC<IPurchaseActionsProps> = ({ callToAction, buttonText, endIcon }) => {
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
      classes={{ root: buttonText === 'Delete' ? classes.cancelButton : classes.button }}
      loading={modal.loading}
      loadingPosition="end"
      endIcon={endIcon}
      fullWidth
      onClick={callToAction}
      className={classes.button}
      color="primary"
      size="large"
      variant="contained"
      disabled={disabledClaim}
    >
      {modal.loading ? `${contractStep}` : t(buttonText)}
    </LoadingButton>
  );
};
