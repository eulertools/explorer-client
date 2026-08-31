import { useMemo } from 'react';
import { Box, Typography } from '@material-ui/core';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import useSettings from 'src/hooks/useSettings';
import { EulerLink } from 'src/ui/EulerLink';

interface EulerPairProps {
  baseTokenAddress: string;
  baseTokenName: string;
  quoteTokenAddress: string;
  quoteTokenName: string;
  addressLink?: string;
  eulerView?: boolean;
}

export const EulerPair = (props: EulerPairProps) => {
  const { baseTokenAddress, baseTokenName, quoteTokenAddress, quoteTokenName, addressLink, eulerView } = props;
  const { settings } = useSettings();

  const displayName = useMemo(
    () => (
      <Typography variant="body2" fontWeight="bold">
        {`${baseTokenName}/${quoteTokenName}`}
      </Typography>
    ),
    [baseTokenName, quoteTokenName],
  );

  return (
    <Box display="grid" gridTemplateColumns="auto auto" alignItems="center">
      <TokenPairAvatars
        altBase={baseTokenName}
        baseTokenAddress={baseTokenAddress}
        altQuote={quoteTokenName}
        quoteTokenAddress={quoteTokenAddress}
        eulerView={eulerView}
      />

      {addressLink ? (
        <EulerLink href={`/${settings.network}/pair/${addressLink}`}>{displayName}</EulerLink>
      ) : (
        displayName
      )}
    </Box>
  );
};
