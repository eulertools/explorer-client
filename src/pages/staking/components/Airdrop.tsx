import moment from 'moment';
import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useModal } from 'src/components/modal';
import { EulerAlert } from 'src/ui/EulerAlert';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import PromoDialog, { DISMISS_LOCALSTORAGE_KEY } from './PromoDialog';
import { EULER_AIRDROP_MIN, IWeb3ContractsGrouped } from './shared';

interface IProps {
  contractsInformation: IWeb3ContractsGrouped | null;
}

function AirdropContent(props: IProps): JSX.Element {
  const { showModal } = useModal();

  const [dialogShown, setDialogShown] = React.useState<boolean>(false);
  const [isAirdropEligible, setIsAirDropEligible] = React.useState<boolean>(false);

  const { contractsInformation } = props;

  React.useEffect(() => {
    const promoDismissed = localStorage.getItem(DISMISS_LOCALSTORAGE_KEY);

    const bnUserStakingAmount =
      contractsInformation?.userInfo.amount !== '0' ? uint256ToDecimalBn(contractsInformation?.userInfo.amount) : null;

    const airdropEligible = bnUserStakingAmount?.isGreaterThanOrEqualTo(EULER_AIRDROP_MIN);

    setIsAirDropEligible(airdropEligible);

    if (!dialogShown && promoDismissed !== 'true' && contractsInformation) {
      const dismissableModal = showModal(PromoDialog, {
        airdropEligible,
        onClose: () => {
          dismissableModal.hide();
        },
      });

      setDialogShown(true);
    }
  }, [contractsInformation]);

  const daysUntilAirdrop = React.useMemo(() => {
    const utcNow = moment.utc();
    const dayOfTheMonth = utcNow.date();

    if (dayOfTheMonth === 16) {
      return 0;
    }

    if (dayOfTheMonth > 16) {
      const momentDate = moment(utcNow).add(1, 'month').set('date', 16);

      return momentDate.diff(utcNow, 'days');
    }

    return 16 - dayOfTheMonth;
  }, [isAirdropEligible]);

  return (
    <Box mt={2}>
      <EulerAlert
        type={isAirdropEligible ? 'success' : 'info'}
        message={
          isAirdropEligible ? (
            <Typography>
              {daysUntilAirdrop === 0
                ? 'Airdrop will be sent out today. Check your wallet to verify you received your $EULERs.'
                : `Only ${daysUntilAirdrop} day${daysUntilAirdrop === 1 ? '' : 's'} left until the airdrop`}
            </Typography>
          ) : (
            <Typography>
              Stake {EULER_AIRDROP_MIN} $EULER to be eligible for the airdrop. Only {daysUntilAirdrop} day
              {daysUntilAirdrop === 1 ? '' : 's'} left to participate.
            </Typography>
          )
        }
        customIcon
      />
    </Box>
  );
}

export default AirdropContent;
