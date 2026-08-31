import Web3 from 'web3';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import TokenPairAvatars from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { ISource } from 'src/types/search';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { getAvatarSrc } from 'src/utils/avatar';

const useStyles = makeStyles((theme) =>
  createStyles({
    mainGrid: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
      },
      '& .MuiAvatarGroup-root > div': {
        background: '#fff',
        border: `2px solid ${theme.palette.grey[500]}`,
      },
    },
    mainText: {
      display: 'flex',
      alignItems: 'baseline',
    },
    addressGrid: {
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'center',
      '& > div': {
        justifyContent: 'center',
        alignItems: 'end',
        width: 'auto',
        '& > p': {
          display: 'flex',
        },
        '& > button > span': {
          marginBottom: '2px',
        },
      },
    },
    avatarSmall: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1),
      display: 'inline-flex',
      verticalAlign: 'middle',
    },
    buttonGrid: {
      display: 'flex',
      textTransform: 'uppercase',
      justifyContent: 'center',
      alignItems: 'flex-end',
      '& > button': {
        textTransform: 'uppercase',
        maxWidth: 120,
      },
      '&.MuiGrid-item': {
        paddingTop: 0,
        [theme.breakpoints.down('md')]: {
          paddingTop: '16px',
        },
      },
    },
  }),
);

interface RowProps {
  source: ISource;
  onClose: () => void;
  path: string;
}

const Row: FC<RowProps> = ({ source, onClose, path }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { chain } = useContext(ConfigurationContext);

  const handleViewButton = () => {
    if (source.address.toLowerCase() === chain.bsc.tokens.euler.address.toLowerCase()) {
      navigate('/token/euler');
    } else {
      navigate(`${path}`);
    }

    onClose();
  };

  const getWeb3Address = (address) => Web3.utils.toChecksumAddress(address);

  const getLogoURL = () => {
    const newAddress = Web3.utils.toChecksumAddress(source.address);
    const logo = getAvatarSrc(newAddress);
    return logo;
  };

  return (
    <Grid container spacing={2} mt={1} mb={1}>
      <Hidden mdDown>
        <Grid className={classes.mainGrid} item xs={12} md={4}>
          {source.base_token_address ? (
            <TokenPairAvatars
              baseTokenAddress={getWeb3Address(source.base_token_address)}
              quoteTokenAddress={getWeb3Address(source.quote_token_address)}
            />
          ) : (
            <Avatar alt={source.symbol} className={classes.avatarSmall} src={getLogoURL()} />
          )}
          {source.category === 'token' ? (
            <Typography className={classes.mainText} color="textPrimary" variant="subtitle2">
              {source.url ? (
                <Link href={source.url} target="_blank" variant="subtitle2" color="textPrimary">
                  {source.name}
                </Link>
              ) : (
                source.name
              )}
            </Typography>
          ) : (
            <Typography color="textPrimary" variant="subtitle2">
              {source.name}
            </Typography>
          )}
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid className={classes.mainGrid} item xs={12} md={4}>
          {source.base_token_address ? (
            <TokenPairAvatars
              baseTokenAddress={getWeb3Address(source.base_token_address)}
              quoteTokenAddress={getWeb3Address(source.quote_token_address)}
            />
          ) : (
            <Avatar alt={source.symbol} className={classes.avatarSmall} src={getLogoURL()} />
          )}
          {source.category === 'token' ? (
            <Typography className={classes.mainText} color="textPrimary" variant="subtitle2">
              {`${source.symbol} - `}
              {source.url ? (
                <Link href={source.url} target="_blank" variant="subtitle2">
                  {source.name}
                </Link>
              ) : (
                source.name
              )}
            </Typography>
          ) : (
            <Typography color="textPrimary" variant="subtitle2">
              {source.name}
            </Typography>
          )}
        </Grid>
      </Hidden>
      <Grid className={classes.addressGrid} item xs={12} md={4}>
        {source.address && (
          <HashCopyToClipboard value={source.address}>
            <TruncatedTooltipText value={source.address} />
          </HashCopyToClipboard>
        )}
      </Grid>
      <Grid className={classes.buttonGrid} item xs={12} md={2}>
        <Button fullWidth color="primary" size="small" variant="contained" onClick={handleViewButton}>
          View
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default Row;
