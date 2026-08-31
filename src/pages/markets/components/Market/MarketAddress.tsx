import { EulerIconDocumentCopy, EulerIconCopySuccess, EulerIconProp } from '@eulertools/ui';
import { FC, useState, useEffect, MouseEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import gtm from 'src/lib/gtm';
import { shortAddress } from 'src/utils/stringUtils';

interface MarketAddressProps {
  address: string;
  color?: EulerIconProp['colorLight'];
  background?: boolean;
  truncate?: boolean;
  link?: boolean;
}

export const MarketAddress: FC<MarketAddressProps> = ({
  address,
  color = 'terciary-700',
  background = true,
  truncate,
  link,
}) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [colorName, colorCode] = color.split('-');

  useEffect(() => {
    if (showSuccess) {
      const timeoutId = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {};
  }, [showSuccess]);

  const onCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
    gtm.push({ event: 'user_copy_address', category: 'tokens', action: 'User copy address' });
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard.writeText(address);
    setShowSuccess(true);
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        borderRadius: background ? '9px' : 'auto',
        backgroundColor: background ? (theme as any).palette.terciary[50] : 'none',
        padding: '6px',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          display: 'inline-block',
          paddingRight: theme.spacing(1),
          fontWeight: 500,
          fontSize: '11px',
          lineHeight: '15px',
          width: '100%',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          color: (theme as any).palette[colorName][colorCode],
        }}
      >
        {link ? (
          <Link
            color="primary"
            component="a"
            href={`/${settings.network}/tx/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncate ? shortAddress(address) : address}
          </Link>
        ) : (
          <>{truncate ? shortAddress(address) : address}</>
        )}
      </Typography>
      {showSuccess ? (
        <Tooltip title="&nbsp;Copied!">
          <Typography fontSize="small" color="textPrimary" display="flex" alignItems="center">
            <EulerIconCopySuccess size="s" colorLight={color} colorDark={color} />
          </Typography>
        </Tooltip>
      ) : (
        <Tooltip title="Copy">
          <IconButton
            onClickCapture={onCopyToClipboard}
            sx={{
              padding: 0,
              color: (theme as any).palette.terciary[700],
              '&:hover': {
                backgroundColor: 'unset',
                opacity: 0.5,
              },
            }}
          >
            <EulerIconDocumentCopy size="s" colorLight={color} colorDark={color} />
          </IconButton>
        </Tooltip>
      )}
    </Grid>
  );
};
