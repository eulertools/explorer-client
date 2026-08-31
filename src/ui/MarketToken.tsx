import { useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import gtm from 'src/lib/gtm';
import { EulerLink } from 'src/ui/EulerLink';

interface MarketProps {
  image: string;
  identifier: string;
  name: string;
  avatarSize?: 'small' | 'medium' | 'large' | 'extra';
}

export const MarketToken = (props: MarketProps) => {
  const { image, identifier, name, avatarSize = 'medium' } = props;

  const label = useMemo(
    () => (
      <Typography marginLeft={1} variant="body2" fontWeight="bold">
        {`${name}`}
      </Typography>
    ),
    [name],
  );

  const eventPush = () => {
    gtm.push({ event: 'user_clicked_token_name', category: 'Tokens', action: 'User Clicked Tokens Name' });
  };

  return (
    <Box display="grid" gridTemplateColumns="auto auto" alignItems="center">
      <AvatarThumbnail src={image} alt={name} isTestnet={false} size={avatarSize} />
      <EulerLink href={`/tokens/${identifier}`} onClick={eventPush}>
        {label}
      </EulerLink>
    </Box>
  );
};
