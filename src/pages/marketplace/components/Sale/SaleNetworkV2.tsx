import { ExtendedTheme, EulerIconWallet2, EulerIconInfoCircle } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import { FC, useMemo, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useMediaQuery, Alert } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip, { tooltipClasses } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import useWalletConnected from 'src/hooks/useWalletConnected';
import { getSelectedNetworkFromLocalstorage } from 'src/lib/axios';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { selectAddressDetail, selectAddressDetailLoading } from 'src/selectors/address';
import { getAddressDetail } from 'src/slices/entities/address';
import { settingsSupportedNetworks, supportedChains } from 'src/types/blockchain';
import { getConnectorSrc } from 'src/utils/avatar';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { metamaskWallet, walletConnect } from 'src/utils/connectWallet';
import { setNetwork } from 'src/utils/network';
import { shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  walletGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
  infoIcon: {
    background: theme.palette.text.secondary,
    color: theme.palette.primary.contrastText,
    borderRadius: '50%',
  },
  imgButton: {
    width: '30px',
    paddingRight: '5px',
  },
  tooltipPopper: {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      borderRadius: theme.spacing(1),
      boxShadow: `2px 2px 4px ${theme.palette.divider}`,
    },
  },
  tooltipArrow: {
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.background.paper,
      '&::before': {
        boxShadow: `2px 2px 4px ${theme.palette.divider}`,
      },
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1.5),
    },
    '& .Mui-disabled': {
      '-webkit-text-fill-color': theme.palette.grey[600],
    },
  },
}));

interface IProps {
  onWalletConnected?: (acc?: string) => void;
}

export const SaleNetworkV2: FC<IProps> = ({ onWalletConnected }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { settings } = useSettings();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const addressDetail = useSelector(selectAddressDetail);
  const loading = useSelector(selectAddressDetailLoading);
  const isShortAddress = useMediaQuery(theme.breakpoints.down(600));
  const currentNetwork = useMemo(() => settingsSupportedNetworks.find((n) => n.value === settings.network), [
    settings.network,
  ]);
  const { updateIsBalance } = useContext(MarketplaceContext);
  const walletConnected = useWalletConnected();
  const { activate } = useWeb3React();
  let { network: paramNetwork } = useParams();

  if (!paramNetwork) {
    paramNetwork = getSelectedNetworkFromLocalstorage();
  }

  const network = supportedChains.find((n) => n.value === paramNetwork);

  const onWalletConnect = useCallback(async () => {
    await walletConnect(activate, onWalletConnected, network.chainId);
  }, [onWalletConnected, network]);

  const onMetamaskConnect = useCallback(async () => {
    await metamaskWallet(activate, onWalletConnected);
    const provider = window.ethereum;
    if (provider) {
      await setNetwork(paramNetwork);
    }
  }, [onWalletConnected]);

  useEffect(() => {
    dispatch(getAddressDetail(account));
  }, [account]);

  useEffect(() => {
    if (!addressDetail || addressDetail.total === 0) {
      updateIsBalance(false);
    } else {
      updateIsBalance(true);
    }
  });

  return (
    <Grid container display="flex" justifyContent="space-between">
      {walletConnected === 1 ? (
        <>
          <Grid item xs={12} className={classes.walletGrid} marginY={1}>
            <Box
              sx={{
                background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
                padding: theme.spacing(3),
                borderRadius: '50%',
              }}
            >
              <EulerIconWallet2 size={72} colorLight="primary-400" />
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.walletGrid} mt={3}>
            <Typography fontWeight={600} color="neutral.500" fontSize={13} alignSelf="center">
              Balance
            </Typography>
            <Tooltip
              title={
                <Typography fontSize="11px" fontWeight={500} textAlign="center" paddingY={1.5} paddingX={2}>
                  The balance expressed may vary depending on market fluctuation
                </Typography>
              }
              placement="top"
              arrow
              sx={{
                marginLeft: theme.spacing(0.5),
                marginTop: theme.spacing(0.5),
                fontSize: 'small',
              }}
              classes={{ tooltipArrow: classes.tooltipArrow, popper: classes.tooltipPopper }}
            >
              <Box
                sx={{ transform: 'rotate(180deg)', marginLeft: theme.spacing(0.5), marginBottom: theme.spacing(0.5) }}
              >
                <EulerIconInfoCircle size="s" colorLight="neutral-500" />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginBottom: theme.spacing(1) }}>
            <Typography fontWeight={700} color="neutral.600" fontSize={20}>
              {!addressDetail || loading ? '--' : `$${getBigNumberCurrencyLabel(addressDetail.total)}`}
            </Typography>
          </Grid>
          {addressDetail && addressDetail.total === 0 ? (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                border: 1,
                borderColor: 'warning.700',
                marginY: theme.spacing(2),
                borderRadius: theme.spacing(1),
                color: 'neutral.600',
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              You do not have balance.
            </Alert>
          ) : null}

          <Grid item xs={12} className={classes.walletGrid} marginY={2}>
            {account ? (
              <TextField
                id="input-with-icon-textfield"
                label="My wallet"
                defaultValue={isShortAddress ? shortAddress(account) : account}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconCopyToClipboard text={account} isNestedButton iconColor="neutral-500" />
                    </InputAdornment>
                  ),
                }}
                className={classes.input}
                disabled
                fullWidth
                size="small"
                sx={{
                  background: '#F3F3F3',
                  borderRadius: theme.spacing(1.5),
                }}
              />
            ) : null}
          </Grid>

          <Grid container color="terciary.700">
            <Grid item xs={6}>
              <Typography fontWeight={700} fontSize={13}>
                Network
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="end">
              <Typography fontWeight={600} fontSize={11}>
                {currentNetwork.label}
              </Typography>
            </Grid>
            <Grid item xs={6} pt={2}>
              <Typography fontWeight={700} fontSize={13}>
                Wallet
              </Typography>
            </Grid>
            <Grid item xs={6} pt={2} textAlign="end">
              <Typography fontWeight={600} fontSize={11}>
                Metamask
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container spacing={2} mb={5}>
          <Typography fontWeight={400} fontSize="13px" mt={3} ml={3} color="neutral-500">
            In order to create an ad needs to connect your wallet.
          </Typography>
          <Grid item display="flex" xs={12}>
            <Button
              fullWidth
              sx={{
                borderRadius: theme.spacing(1.25),
                border: 'none',
                background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                padding: theme.spacing(1),
                fontSize: '16px',
                fontWeight: 600,
              }}
              onClick={onMetamaskConnect}
            >
              <img className={classes.imgButton} src={getConnectorSrc('metamask')} alt="MetaMask" />
              MetaMask
            </Button>
          </Grid>
          <Grid item display="flex" xs={12}>
            <Button
              fullWidth
              sx={{
                borderRadius: theme.spacing(1.25),
                border: 'none',
                background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                padding: theme.spacing(1),
                fontSize: '16px',
                fontWeight: 600,
              }}
              onClick={onWalletConnect}
            >
              <img className={classes.imgButton} src={getConnectorSrc('walletconnect')} alt="MetaMask" />
              Wallet Connect
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
