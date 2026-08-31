import React, { useContext } from 'react';
import { Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import { GridCellParams } from '@material-ui/data-grid';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { ESupportedExchanges } from 'src/types/pair';
import { getExchangeInfoFromOwner } from 'src/utils/exchanges';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
  },
}));

interface EulerCellExchangeProps extends GridCellParams {
  showLink?: boolean;
  base_token_address?: string;
  quote_token_address?: string;
}

export const EulerCellExchange = (props: EulerCellExchangeProps) => {
  const classes = useStyles();
  const { showLink, value = '', base_token_address, quote_token_address } = props;
  const name = String(value);
  const { externalLinks } = useContext(ConfigurationContext);

  const { label, link, avatarSrc } = getExchangeInfoFromOwner(
    name as ESupportedExchanges,
    base_token_address,
    quote_token_address,
    externalLinks,
  );

  const content = React.useMemo(
    () => (
      <>
        <AvatarThumbnail alt={name} src={avatarSrc} />
        <Typography paddingLeft={1} variant="body2">
          {label}
        </Typography>
      </>
    ),
    [name, base_token_address, quote_token_address],
  );

  if (showLink)
    return (
      <MuiLink color="textPrimary" href={link} target="_blank" className={classes.link}>
        {content}
      </MuiLink>
    );
  return content;
};
