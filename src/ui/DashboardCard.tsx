import { ExtendedTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { FC, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import Logo from 'src/components/Logo';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import VerifiedIcon from 'src/icons/svg-icons/VerifiedIcon';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import EulerTokenLinkIcon from './EulerTokenLinkIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    cardRoot: {
      height: '100%',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
    },
    cardHeaderRoot: {
      background: theme.palette.primary.main,
      padding: theme.spacing(1),
    },
    cardHeaderRootMobile: {
      paddingLeft: '22px',
    },
    cardHeaderUserRoot: {
      background: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    },
    cardTitle: {
      color: theme.palette.primary.contrastText,
    },
    cardContent: {
      paddingBottom: 0,
    },
    cardContentMobile: {
      padding: 0,
    },
    eulerContent: {
      paddingLeft: theme.spacing(4),
    },
    cardAction: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
    cardActionMobile: {
      padding: 0,
    },
    typographyRoot: {
      fontWeight: 700,
      fontSize: '20px',
    },
    actionLogo: {
      marginRight: theme.spacing(1),
      marginTop: '1px',
    },
    avatarLogo: {},
    eulerLogo: {
      position: 'absolute',
      '& > img': {
        position: 'relative',
        top: 0,
        left: '-50%',
      },
    },
    buyButton: {
      width: '100%',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      background: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    },
    flexibleCard: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  }),
);

interface IDashboardCardProps {
  userCard?: boolean;
  actionLogo?: ReactNode;
  eulerLogo?: boolean;
  avatarLogo?: ReactNode;
  title?: string;
  cardActions?: ReactNode;
  mobileView?: boolean;
  trendingCard?: boolean;
}

const DashboardCard: FC<IDashboardCardProps> = ({
  children,
  userCard = false,
  title,
  actionLogo,
  eulerLogo = false,
  avatarLogo,
  cardActions,
  mobileView = false,
  trendingCard = false,
}) => {
  const classes = useStyles();

  return (
    <Card classes={{ root: clsx(classes.cardRoot, trendingCard ? classes.flexibleCard : null) }} variant="elevation">
      <CardHeader
        classes={{
          root: clsx(
            classes.cardHeaderRoot,
            { [classes.cardHeaderUserRoot]: userCard },
            { [classes.cardHeaderRootMobile]: mobileView },
          ),
          action: clsx({ [classes.actionLogo]: !!actionLogo }),
          avatar: clsx({ [classes.eulerLogo]: eulerLogo }, { [classes.avatarLogo]: !!actionLogo }),
          title: clsx(classes.cardTitle, { [classes.eulerContent]: eulerLogo }),
        }}
        action={actionLogo || eulerLogo || null}
        title={title}
        avatar={avatarLogo || null}
      />
      <CardContent
        classes={{
          root: clsx(
            classes.cardContent,
            mobileView ? classes.cardContentMobile : null,
            trendingCard ? classes.flexibleCard : null,
          ),
        }}
      >
        {children}
      </CardContent>
      <CardActions className={clsx(classes.cardAction, mobileView ? classes.cardActionMobile : null)}>
        {cardActions || null}
      </CardActions>
    </Card>
  );
};

export default DashboardCard;

interface ITokenDashboardCardProps {
  base: string;
  quote: string;
  price: string | number;
  baseAddress: string;
}

export const TokenDashboardCard: FC<ITokenDashboardCardProps> = ({ base, baseAddress, quote, price }) => {
  const classes = useStyles();

  return (
    <DashboardCard
      title={base}
      actionLogo={<EulerTokenLinkIcon tokenAddress={baseAddress} contrastLogo />}
      avatarLogo={<AvatarThumbnail address={baseAddress} alt={base} />}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography marginLeft={1} color="textPrimary" className={classes.typographyRoot}>
            {`${quote} $${getBigNumberCurrencyLabel(price, false, 3)}`}
          </Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export const EulerTokenDashboardCard = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { poolDataBUSD } = useCoinData();
  const { chain } = useContext(ConfigurationContext);

  const poolInfoFetched = poolDataBUSD.eulerBalance !== null;
  const usdPrice = new BigNumber(poolDataBUSD.busdBalance).dividedBy(poolDataBUSD.eulerBalance);

  return (
    <DashboardCard
      avatarLogo={<Logo format="euler-home" heightValue={75} />}
      eulerLogo
      actionLogo={
        <Box display="flex" mt="2px">
          <HashCopyToClipboard value={chain.bsc.tokens.euler.address} iconColor={theme.palette.primary.contrastText} />
          <Box ml={1} mr={0} display="flex" alignItems="center">
            <EulerTokenLinkIcon contrastLogo tokenAddress={chain.bsc.tokens.euler.address} />
          </Box>
          <Box ml={1} mr={0} display="flex" alignItems="center">
            <VerifiedIcon fill={theme.palette.primary.contrastText} />
          </Box>
        </Box>
      }
      title="EULER"
      cardActions={
        <Button
          className={classes.buyButton}
          target="_blank"
          variant="contained"
          color="primary"
          href={`https://swap.wault.finance/bsc/index.html#/swap?outputCurrency=${chain.bsc.tokens.euler.address}`}
        >
          {t('BUY')}
        </Button>
      }
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography marginRight={1} color="textPrimary" fontWeight={700} fontSize="20px">
          BUSD {poolInfoFetched ? usdPrice.toFixed(6) : '-'}
        </Typography>
      </Box>
    </DashboardCard>
  );
};
