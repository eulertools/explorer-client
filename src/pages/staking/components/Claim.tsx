import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useModal } from 'src/components/modal';
import { getBigNumberCurrencyLabel, uint256ToBNBCurrency } from 'src/utils/bigNumber';
import ConfirmClaimDialog from './ConfirmClaimDialog';
import { DEFAULT_LABEL, IWeb3ContractsGrouped } from './shared';
import { stakingStyles } from './styles';

interface IProps {
  eulerUSDPrice: BigNumber;
  contractsInformation: IWeb3ContractsGrouped;
}

function StakingEarned(props: IProps): JSX.Element {
  const { t } = useTranslation();
  const classes = stakingStyles();
  const { showModal } = useModal();

  const { eulerUSDPrice, contractsInformation } = props;

  function onClaimRewards() {
    const unlinkPrimaryWalletModal = showModal(ConfirmClaimDialog, {
      contractsInformation,
      onCancel: () => {
        unlinkPrimaryWalletModal.hide();
      },
    });
  }

  const pendingRewards = contractsInformation?.userInfo?.pendingRewards || DEFAULT_LABEL;
  const disableButton = pendingRewards === DEFAULT_LABEL || (pendingRewards as string) === '0';

  return (
    <>
      <Box>
        <Typography color="textPrimary" variant="h6" marginBottom={1}>
          $EULER {t('Earned')}
        </Typography>
        <Typography color="textPrimary" variant="h5">
          {getBigNumberCurrencyLabel(pendingRewards, true, 4)}
        </Typography>
        {pendingRewards !== DEFAULT_LABEL && pendingRewards !== '0' ? (
          <Typography color="textSecondary" variant="overline">
            {eulerUSDPrice
              ? getBigNumberCurrencyLabel(eulerUSDPrice.multipliedBy(uint256ToBNBCurrency(pendingRewards)), false, 4)
              : DEFAULT_LABEL}{' '}
            USD
          </Typography>
        ) : null}
      </Box>
      <Grid container spacing={3} display="flex" alignItems="center" marginTop={1}>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button
            disabled={disableButton}
            className={classes.button}
            color="primary"
            size="large"
            onClick={onClaimRewards}
            variant="contained"
          >
            {t('CLAIM')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default StakingEarned;
