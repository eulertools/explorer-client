import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { FC, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import LogoutIcon from '@material-ui/icons/Logout';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { useIntl } from 'src/hooks/useIntl';
import useSettings from 'src/hooks/useSettings';
import WalletIcon from 'src/icons/svg-icons/WalletIcon';
import { UserAvatar } from 'src/ui/UserAvatar';
import { getBalance } from 'src/utils/locker';
import { BNBToken } from 'src/utils/marketplace';
import { shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    '& > div > div': {
      minWidth: 'auto',
    },
  },
  card: {
    background: theme.palette.background.default,
  },
  cardHeader: {
    paddingRight: 0,
  },
  cardHeaderContainer: {
    background: theme.palette.primary.light,
  },
  dialogContent: {
    marginBottom: theme.spacing(3),
  },
  dialogTitle: {
    padding: '20px 4px 5px 4px',
  },
  iconButton: {
    padding: 0,
    background: 'unset !important',
  },
  cardContent: {
    paddingBottom: '10px !important',
  },
  contDisconnect: {
    display: 'flex',
    marginTop: '10px',
    justifyContent: 'flex-end',
    marginRight: '10px',
    [theme.breakpoints.down(830)]: {
      justifyContent: 'center',
      marginRight: '0',
    },
  },
}));

interface WalletMenuDialogProps extends DialogProps {
  onClose: () => void;
  onDisconnect: () => void;
}

const WalletMenuDialog: FC<WalletMenuDialogProps> = ({ onClose, onDisconnect, ...dialogProps }) => {
  const { t } = useTranslation();
  const intl = useIntl();
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();
  const { account, library, active } = useWeb3React();
  const { chain } = useContext(ConfigurationContext);

  const web3 = new Web3(library?.provider);

  const [networkBalance, setNetworkBalance] = useState<BigNumber>(null);

  const isShortAddress = useMediaQuery(theme.breakpoints.down(600));

  const onCloseDialog = () => {
    onClose();
  };

  const onDisconnectWallet = () => {
    onDisconnect();
    onClose();
  };

  useEffect(() => {
    const init = async () => {
      const balance = await getBalance(BNBToken, account, web3);
      const BNBalance = new BigNumber(balance);
      setNetworkBalance(BNBalance);
    };
    if (active) init();
  }, [account]);

  useEffect(() => {
    if (!active) {
      onCloseDialog();
    }
  }, [active]);

  return (
    <Dialog {...dialogProps} onClose={onCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        <Box>
          <Box textAlign="center">{t('WALLET DETAIL')}</Box>
        </Box>
      </DialogTitle>
      <Box position="absolute" right="8px" top="7.5px">
        <IconButton onClick={onCloseDialog}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className={classes.dialogContent}>
        <Grid container display="flex" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} className={classes.mainGrid}>
            <Card className={classes.card}>
              <CardHeader
                className={classes.cardHeader}
                title={
                  <Grid className={classes.cardHeaderContainer} container spacing={2} pb={2}>
                    <Grid item xs={12} md={2} display="flex" justifyContent="center" alignItems="flex-end">
                      <UserAvatar withoutActions size="medium" />
                    </Grid>
                    <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                      <Typography color="textPrimary" variant="body2" my={1} fontWeight="bold">
                        {t('BALANCE')}
                      </Typography>
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Typography color="textPrimary" variant="subtitle1">
                          {networkBalance
                            ? intl.formatNumber(networkBalance.toNumber(), { maximumFractionDigits: 7 })
                            : 'N/A'}
                          {chain ? ` ${chain?.[settings.network]?.chain_token_symbol}` : ''}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                      <Typography color="textPrimary" variant="body2" my={1} fontWeight="bold">
                        {t('NETWORK')}
                      </Typography>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Typography color="textPrimary" variant="subtitle1" whiteSpace="nowrap">
                          {chain ? ` ${chain?.[settings.network]?.chain_token_name}` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                      <Typography color="textPrimary" variant="body2" my={1} fontWeight="bold">
                        {t('WALLET')}
                      </Typography>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Typography color="textPrimary" variant="subtitle1">
                          Metamask
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                }
              />
              <CardContent className={classes.cardContent}>
                <Grid container justifyContent="space-evenly" pb={1} rowGap={2}>
                  <Grid item xs={12} display="flex" flexDirection="column" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      startIcon={<WalletIcon fill={theme.palette.primary.main} />}
                      endIcon={<IconCopyToClipboard text={account} isNestedButton />}
                    >
                      {isShortAddress ? shortAddress(account) : account}
                    </Button>
                  </Grid>
                  <Grid item xs={12} ml={1} className={classes.contDisconnect}>
                    <Box>
                      <IconButton
                        disableRipple
                        color="primary"
                        onClick={onDisconnectWallet}
                        className={classes.iconButton}
                      >
                        <LogoutIcon />
                        <Typography color="primary" variant="subtitle1" fontWeight="bold" fontSize={14} ml={1}>
                          {t('Disconnect')}
                        </Typography>
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WalletMenuDialog;
