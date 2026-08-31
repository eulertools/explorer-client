import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import WalletIcon from 'src/icons/svg-icons/WalletIcon';
import { settingsSupportedNetworks } from 'src/types/blockchain';
import { shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  networkGrid: {
    display: 'flex',
    paddingTop: theme.spacing(0),
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  walletGrid: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: 'center',
  },
  description: {
    display: 'flex',
    fontWeight: 700,
  },
  networkLogo: {
    marginRight: theme.spacing(1),
  },
  iconButton: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
      opacity: 0.5,
    },
  },
}));

export const SaleNetwork = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { settings } = useSettings();
  const { account } = useWeb3React();

  const isShortAddress = useMediaQuery(theme.breakpoints.down(600));
  const currentNetwork = useMemo(() => settingsSupportedNetworks.find((n) => n.value === settings.network), [
    settings.network,
  ]);

  return (
    <Grid container display="flex" justifyContent="space-between">
      <Grid item xs={12} pt={2} className={classes.networkGrid}>
        <Typography className={classes.description}>The app is currently pointing to :</Typography>
        <Button variant="outlined">
          <img className={classes.networkLogo} src={currentNetwork.iconSrc} alt="network-logo" width={24} height={24} />{' '}
          {currentNetwork.label}
        </Button>
      </Grid>
      <Grid item xs={12} className={classes.walletGrid}>
        {account ? (
          <Button
            variant="outlined"
            startIcon={<WalletIcon fill={theme.palette.primary.main} />}
            endIcon={<IconCopyToClipboard text={account} isNestedButton />}
          >
            {isShortAddress ? shortAddress(account) : account}
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};
