import { ExtendedTheme } from '@eulertools/ui';
import clsx from 'clsx';
import { FC, memo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/core/AvatarGroup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { getAvatarSrc, getTokenSrc } from 'src/utils/avatar';

const useStyles = makeStyles((theme: Theme) => ({
  avatarSmall: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  avatarMedium: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: theme.palette.primary.contrastText,
    color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
  },
  avatarLarge: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  avatarExtraLarge: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  avatarSuperposed: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    // marginRight: theme.spacing(1),
    zIndex: 1,
    background: theme.palette.primary.contrastText,
    color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
  },
  avatarNextSuperposed: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    zIndex: 2,
    background: theme.palette.primary.contrastText,
    color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
  },
}));

interface IAvatarThumbnailProps {
  address?: string;
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | 'extra';
  isTestnet?: boolean;
}

export const AvatarThumbnail: FC<IAvatarThumbnailProps> = memo(
  ({ address, alt, src, size = 'medium', isTestnet }) => {
    const classes = useStyles();

    return (
      <Avatar
        alt={alt}
        src={src || getAvatarSrc(address, false, isTestnet)}
        className={clsx(
          classes.avatarMedium,
          { [classes.avatarSmall]: size === 'small' },
          { [classes.avatarLarge]: size === 'large' },
          { [classes.avatarExtraLarge]: size === 'extra' },
        )}
      />
    );
  },
  (prevProps, nextProps) => prevProps.address?.toLowerCase() === nextProps.address?.toLowerCase(),
);

interface IFarmIconProps {
  farm: string;
}

export const FarmIcon: FC<IFarmIconProps> = ({ farm }) => {
  const classes = useStyles();
  const [base, quote] = farm?.split('-');

  if (quote) {
    return (
      <AvatarGroup>
        <AvatarThumbnail alt={base} src={getTokenSrc(base)} />
        <Avatar alt={quote} src={getTokenSrc(quote)} className={classes.avatarSuperposed} />
      </AvatarGroup>
    );
  }

  return <AvatarThumbnail alt={farm} src={getTokenSrc(farm)} />;
};

interface ITokenTripleAvatarProps {
  firstTokenAddress: string;
  secondTokenAddress: string;
  thirdTokenAddress: string;
}

export const TokenTripleAvatar: FC<ITokenTripleAvatarProps> = ({
  firstTokenAddress,
  secondTokenAddress,
  thirdTokenAddress,
}) => {
  const classes = useStyles();

  return (
    <AvatarGroup>
      <Avatar alt={firstTokenAddress} src={getAvatarSrc(firstTokenAddress)} className={classes.avatarMedium} />
      <Avatar alt={secondTokenAddress} src={getAvatarSrc(secondTokenAddress)} className={classes.avatarSuperposed} />
      <Avatar alt={thirdTokenAddress} src={getAvatarSrc(thirdTokenAddress)} className={classes.avatarNextSuperposed} />
    </AvatarGroup>
  );
};

interface ITokenPairAvatarsProps {
  baseTokenAddress: string;
  quoteTokenAddress: string;
  altBase?: string;
  altQuote?: string;
  eulerView?: boolean;
}

const TokenPairAvatars: FC<ITokenPairAvatarsProps> = ({
  baseTokenAddress,
  altBase,
  quoteTokenAddress,
  altQuote,
  eulerView,
}) => {
  const classes = useStyles();

  return (
    <AvatarGroup>
      <Avatar alt={altBase} src={getAvatarSrc(baseTokenAddress, eulerView)} className={classes.avatarMedium} />
      <Avatar alt={altQuote} src={getAvatarSrc(quoteTokenAddress, eulerView)} className={classes.avatarSuperposed} />
    </AvatarGroup>
  );
};

export default TokenPairAvatars;
