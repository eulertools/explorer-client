import { useContext, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useSettings from 'src/hooks/useSettings';
import { EulerLink } from 'src/ui/EulerLink';
import { isBNBToken } from 'src/utils/marketplace';

interface EulerPairProps {
  address: string;
  name: string;
  addressLink?: string;
  isTestnet?: boolean;
  avatarSize?: 'small' | 'medium' | 'large' | 'extra';
  image?: string;
}

export const EulerToken = (props: EulerPairProps) => {
  const { address, name, addressLink, isTestnet = false, avatarSize = 'medium', image } = props;
  const { settings } = useSettings();
  const { featureFlags } = useContext(ConfigurationContext);

  const label = useMemo(
    () => (
      <Typography marginLeft={1} variant="body2" fontWeight="bold">
        {`${name}`}
      </Typography>
    ),
    [name],
  );

  return (
    <Box display="grid" gridTemplateColumns="auto auto" alignItems="center">
      <AvatarThumbnail src={image} address={address} alt={name} isTestnet={isTestnet} size={avatarSize} />
      {addressLink && !isBNBToken(addressLink) ? (
        <EulerLink
          href={featureFlags.marketsDisabled ? `/${settings.network}/token/${addressLink}` : `/tokens/${addressLink}`}
        >
          {label}
        </EulerLink>
      ) : (
        <a>{label}</a>
      )}
    </Box>
  );
};
