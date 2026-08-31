import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { EMetamaskErrors, IWaultUserInfo, PID } from 'src/pages/staking/components/shared';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import SnackbarService from 'src/utils/snackbar';

enum EUnstakeSteps {
  UNSTAKE = 'UNSTAKE',
  CLAIM = 'CLAIM',
}

interface IProps extends DialogProps {
  onClose: () => void;
  waultStakingContract: any;
  userInfo: IWaultUserInfo;
  web3: Web3;
}

const WaultStakingDialog: React.FC<IProps> = ({ onClose, userInfo, waultStakingContract, web3, ...rest }) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();

  const [flowStep, setFlowStep] = useState<EUnstakeSteps>(EUnstakeSteps.UNSTAKE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onCloseDialog() {
    onClose();
  }

  const onUnstakeClick = React.useCallback(async () => {
    // Stake
    try {
      // Convert user input to uint256
      const amount = web3.utils.toWei(userInfo.amount.toString(), 'ether');

      await waultStakingContract.methods.withdraw(PID, amount).send({ from: account });

      setFlowStep(EUnstakeSteps.CLAIM);
    } catch (error) {
      let errorMessage = 'Unknown error, please try again.';

      if (error.code === EMetamaskErrors.USER_DENIED_TRANSACTION) {
        errorMessage = 'You cancelled the unstake';
      }

      SnackbarService.error(errorMessage, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 3500,
      });
    }

    if (isMountedRef.current) {
      setIsLoading(false);
    }
  }, [waultStakingContract, web3]);

  const onClaimRewards = React.useCallback(async () => {
    try {
      setIsLoading(true);

      await waultStakingContract.methods.claim(PID).send({ from: account });

      onClose();
    } catch (error) {
      let errorMessage = 'Unknown error, please try again.';

      if (error.code === EMetamaskErrors.USER_DENIED_TRANSACTION) {
        errorMessage = 'You cancelled the token claim';
      }

      SnackbarService.error(errorMessage, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 3500,
      });
    } finally {
      setIsLoading(false);
    }
  }, [waultStakingContract]);

  return (
    <Dialog {...rest} onClose={onCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} textAlign="center">
            {flowStep === EUnstakeSteps.UNSTAKE ? t('STAKING IS NOW LIVE IN EULER.TOOLS') : null}
            {flowStep === EUnstakeSteps.CLAIM ? t('CLAIM WAULT REWARDS') : null}
          </Box>
          <Box>
            <IconButton onClick={onCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        {flowStep === EUnstakeSteps.UNSTAKE ? (
          <Box>
            <Typography color="textPrimary">
              We noticed you are already staking EULER in our partner{' '}
              <Link href="https://app.wault.finance/bsc/#locked-staking" rel="noopener noreferrer" fontWeight="bold">
                Wault
              </Link>
              . To make this transition easier for you, you can unstake your EULERs from Wault by clicking
              &quot;Unstake&quot;
            </Typography>
            <Box mt={3} display="flex" justifyContent="center">
              <Button color="primary" disabled={isLoading} size="large" onClick={onUnstakeClick} variant="contained">
                {t('UNSTAKE')}
              </Button>
            </Box>
            <Typography color="textPrimary" pt={4}>
              Date of last claim:{' '}
              <b>
                {userInfo.lastClaim.toLocaleDateString()} at {userInfo.lastClaim.toLocaleTimeString()}
              </b>
            </Typography>
            <Typography color="textPrimary" pt={1}>
              EULER Staked in Wault: <b>{getBigNumberCurrencyLabel(userInfo.amount)}</b>
            </Typography>
          </Box>
        ) : null}
        {flowStep === EUnstakeSteps.CLAIM ? (
          <Box>
            <Typography color="textPrimary" pt={3}>
              Now it&apos;s time to claim your rewards! Please click &quot;Claim&quot; below to finish the process.
            </Typography>
            <Box mt={3} display="flex" justifyContent="center">
              <Button color="primary" disabled={isLoading} size="large" onClick={onClaimRewards} variant="contained">
                {t('CLAIM')}
              </Button>
            </Box>
            <Typography color="textPrimary" pt={3}>
              EULER rewards to be claimed: <b>{getBigNumberCurrencyLabel(userInfo.pendingRewards)}</b>
            </Typography>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default WaultStakingDialog;
