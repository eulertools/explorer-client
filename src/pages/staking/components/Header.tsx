import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { getBigNumberCurrencyLabel, uint256ToDecimalBn } from 'src/utils/bigNumber';
import { BSC_BLOCKS_PER_DAY, DEFAULT_LABEL, IWeb3ContractsGrouped } from './shared';
import { stakingStyles } from './styles';

interface IProps {
  eulerUSDPrice: BigNumber;
  contractsInformation: IWeb3ContractsGrouped | null;
}

function StakingHeader(props: IProps): JSX.Element {
  const { t } = useTranslation();
  const classes = stakingStyles();

  const { eulerUSDPrice, contractsInformation } = props;

  const gainsPercentage = React.useMemo(() => {
    if (contractsInformation) {
      // Get the total of eulers given per day
      const eulerPerBlockBN = uint256ToDecimalBn(contractsInformation?.userInfo?.eulerPerBlock);
      const totalEulerGivenPerDay = eulerPerBlockBN.multipliedBy(BSC_BLOCKS_PER_DAY);

      // Get the percentage of the total staked, if user has no euler staked then consider the minimum
      const userStakedOrMinimum =
        contractsInformation?.userInfo?.amount !== '0'
          ? uint256ToDecimalBn(contractsInformation?.userInfo?.amount)
          : contractsInformation?.minDepositAmount;
      const percentageOfTVL = userStakedOrMinimum.dividedBy(uint256ToDecimalBn(contractsInformation?.userInfo?.tvl));

      // Eulers user will get per day
      const eulersWonPerDay = percentageOfTVL.multipliedBy(totalEulerGivenPerDay);

      // Total EULER won by user if staking the whole year
      const totalEulersWonByUser = eulersWonPerDay.multipliedBy(365);

      // Finally get the hypothetical % of gains
      const finalPercentage = totalEulersWonByUser.dividedBy(userStakedOrMinimum).multipliedBy(100);
      return finalPercentage.isFinite() ? finalPercentage : null;
    }

    return null;
  }, [contractsInformation]);

  const { userInfo } = contractsInformation || {};

  const isStaking = userInfo && userInfo.amount !== '0';
  const unstakeDate = isStaking ? new Date(+userInfo?.withdrawAvaliable * 1000) : null;
  const canUnstakeNow = unstakeDate ? Date.now() > unstakeDate.getTime() : false;

  return (
    <Grid className={classes.cardHeaderContainer} container spacing={2} pb={2}>
      <Grid item xs={12} md={4} display="flex" alignItems="center">
        <Box display="flex" pr={1}>
          <Logo format="euler-home" heightValue={75} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography color="textPrimary" variant="h5" my={1}>
            {t('EULER 30 DAYS')}
          </Typography>
          {isStaking ? (
            <Typography color="textPrimary" variant="subtitle2">
              Unstake Available{' '}
              {canUnstakeNow
                ? 'Now'
                : `After ${unstakeDate.toLocaleDateString()} at ${unstakeDate.toLocaleTimeString()}`}
            </Typography>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          {contractsInformation?.totalUsersStaking ? contractsInformation.totalUsersStaking : DEFAULT_LABEL}
        </Typography>
        <Typography color="textPrimary" variant="subtitle2">
          Users Staking
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          {gainsPercentage ? gainsPercentage.toFixed(0) : DEFAULT_LABEL}%
        </Typography>
        <Typography color="textPrimary" variant="subtitle2">
          APR
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          {contractsInformation?.poolInfo
            ? getBigNumberCurrencyLabel(uint256ToDecimalBn(contractsInformation.poolInfo.depositedAmount), false, 2)
            : DEFAULT_LABEL}
        </Typography>
        <Typography color="textPrimary" variant="subtitle2">
          $EULER Locked
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} display="flex" flexDirection="column" alignItems="center">
        <Typography color="textPrimary" variant="h5" my={1}>
          $
          {contractsInformation?.poolInfo
            ? getBigNumberCurrencyLabel(
                uint256ToDecimalBn(contractsInformation.poolInfo.depositedAmount).multipliedBy(eulerUSDPrice),
                false,
                2,
              )
            : DEFAULT_LABEL}
        </Typography>
        <Typography color="textPrimary" variant="subtitle2">
          {t('Liquidity')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default StakingHeader;
