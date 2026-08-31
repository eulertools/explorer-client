import { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box, Link } from '@material-ui/core';
import { GridCellParams } from '@material-ui/data-grid';
import useSettings from 'src/hooks/useSettings';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';

interface EulerCelTnxHashProps extends GridCellParams {
  title?: string;
  explorer?: boolean;
  contrast?: boolean;
  eulerView?: boolean;
}

export const EulerCelTnxHash: FC<EulerCelTnxHashProps> = ({
  title,
  explorer,
  contrast,
  eulerView = false,
  ...rest
}) => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  let appViewUrl = `${window.location.origin}/${settings.network || 'bsc'}/tx/${rest.value}`;

  if (eulerView) {
    appViewUrl = `${window.location.origin}/bsc/tx/${rest.value}`;
  }

  let explorerHref = 'https://bscscan.com/tx/';
  let explorerName = 'BNB';

  if (settings.network === 'eth' && !eulerView) {
    explorerHref = 'https://etherscan.io/tx/';
    explorerName = 'ETH';
  }

  const handleLink = (e) => {
    e.preventDefault();
    navigate(`/${settings.network}/tx/${rest.value}`);
  };

  return (
    <TruncatedTooltipText
      value={
        <Box display="flex" justifyContent="space-evenly">
          {/* Removed Link for Euler Page to avoid errors in case of ETH Network */}
          {!eulerView || settings.network === 'bsc' ? (
            <Link
              href={appViewUrl}
              onClick={handleLink}
              color={contrast ? 'textPrimary' : 'primary'}
              style={contrast ? { fontWeight: 700 } : null}
            >
              {title || rest.value}
            </Link>
          ) : null}
          {explorer ? (
            <Link
              href={`${explorerHref}${rest.value}`}
              target="_blank"
              color={contrast ? 'textPrimary' : 'primary'}
              style={contrast ? { fontWeight: 700 } : null}
            >
              {explorerName}
            </Link>
          ) : null}
        </Box>
      }
      title={rest.value as string}
    />
  );
};
