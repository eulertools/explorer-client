import clsx from 'clsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FC, useRef, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import CloseIcon from '@material-ui/icons/Close';
import ContentCopyOutlinedIcon from '@material-ui/icons/ContentCopyOutlined';
import ArrowLeft from '@material-ui/icons/KeyboardBackspace';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { AssetsContext, TrackedAddress } from 'src/pages/assets/AssetsContext';
import { editFavorite, removeFavorite } from 'src/slices/user/favorites';
import { useDispatch } from 'src/store';
import { getConnectorSrc } from 'src/utils/avatar';
import { hexToRGB, isAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  dialog: {
    width: '100%',
  },
  divider: {
    width: '35%',
    height: 0,
  },
  menu: {
    minWidth: '100px',
  },
  iconButton: {
    borderRadius: '10px',
  },
  optionIconsGroup: {
    '& > button': {
      padding: theme.spacing(1),
    },
  },
  optionIconButton: {
    '&:hover': {
      opacity: 0.5,
    },
  },
  iconColor: {
    color: theme.palette.primary.main,
  },
  iconButtonBackground: {
    background: 'rgba(232, 234, 254, 1)',
  },
  iconButtonBackgroundDark: {
    background: theme.palette.background.default,
  },
  importWalletButton: {
    borderRadius: '10px',
    padding: `8px ${theme.spacing(3)}`,
  },
  connectButton: {
    border: 'none',
    borderRadius: '10px',
    padding: `8px ${theme.spacing(3)}`,
    color: theme.palette.primary.main,
  },
  connectButtonLight: {
    background: 'rgba(232, 234, 254, 1)',
    '&:hover': {
      background: 'rgba(232, 234, 254, 0.5)',
    },
  },
  connectButtonDark: {
    background: theme.palette.background.default,
    '&:hover': {
      background: hexToRGB(theme.palette.background.default, 0.5),
    },
  },
  imgButton: {
    width: '30px',
    paddingRight: '5px',
  },
  walletTextField: {
    '& > div > input': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  tooltipText: {
    left: 0,
    top: theme.spacing(-2),
  },
}));

enum EWalletSteps {
  MANAGE = 'MANAGE',
  IMPORT = 'IMPORT',
}

interface AddressMenuProps {
  address: TrackedAddress;
}

const AddressMenu: FC<AddressMenuProps> = ({ address }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const initialValues = {
    formName: address.name,
  };

  const validationSchema = Yup.object().shape({
    formName: Yup.string().required('Address is required.'),
  });

  const handleEditMenuToggle = () => setOpen((prev) => !prev);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setOpen(false);
  };

  const handlePinWallet = () => {};

  const handleRemoveFavorite = useCallback(() => {
    dispatch(removeFavorite(address.identifier));
  }, [address]);

  const onSubmit = useCallback(async (values): Promise<void> => {
    handleEditToggle();
    const editedFavorite = {
      ...address,
      name: values.formName,
    };
    dispatch(editFavorite(editedFavorite));
  }, []);

  return (
    <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-end">
      {!editMode ? (
        <>
          <Grid item>
            {!isAddress(address.name) ? (
              <Typography className={classes.tooltipText} variant="subtitle2" fontWeight="bold">
                {address.name}
              </Typography>
            ) : null}
            <Typography noWrap>{address.address}</Typography>
          </Grid>
          <Grid item className={classes.optionIconsGroup}>
            <Tooltip title={t('Pin wallet')}>
              <IconButton className={classes.optionIconButton} onClick={handlePinWallet}>
                <PushPinOutlinedIcon />
              </IconButton>
            </Tooltip>
            <IconCopyToClipboard
              text={address.address}
              icon={<ContentCopyOutlinedIcon />}
              iconColor=""
              copyText={t('Copy wallet')}
            />
            <Tooltip title="Options" placement={open ? 'top' : 'bottom'}>
              <IconButton className={classes.optionIconButton} ref={anchorRef} onClick={handleEditMenuToggle}>
                <MoreVertOutlinedIcon />
                <Menu
                  className={classes.menu}
                  anchorEl={anchorRef.current}
                  variant="menu"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  open={open}
                  onClose={handleEditMenuToggle}
                  onClick={handleEditMenuToggle}
                >
                  <MenuItem className={classes.menu} onClick={handleEditToggle}>
                    <Typography>{t('Rename')}</Typography>
                  </MenuItem>
                  <MenuItem className={classes.menu} onClick={handleRemoveFavorite}>
                    <Typography>{t('Remove')}</Typography>
                  </MenuItem>
                </Menu>
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      ) : (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ errors, touched, isSubmitting, values, handleBlur, handleChange, handleSubmit }): JSX.Element => (
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                className={classes.walletTextField}
                fullWidth
                name="formName"
                size="medium"
                margin="dense"
                variant="outlined"
                label={!isAddress(address.name) ? address.address : null}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.formName}
                error={Boolean(touched.formName && errors.formName)}
                helperText={touched.formName && errors.formName}
              />
              <Box display="flex" gap={1} pl={1}>
                <Tooltip title="Confirm">
                  <IconButton
                    className={clsx(
                      classes.iconButton,
                      settings.theme === 'DARK' ? classes.iconButtonBackgroundDark : classes.iconButtonBackground,
                    )}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <CheckOutlinedIcon className={classes.iconColor} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    className={clsx(
                      classes.iconButton,
                      settings.theme === 'DARK' ? classes.iconButtonBackgroundDark : classes.iconButtonBackground,
                    )}
                    disabled={isSubmitting}
                    onClick={handleEditToggle}
                  >
                    <ClearOutlinedIcon className={classes.iconColor} />
                  </IconButton>
                </Tooltip>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Grid>
  );
};

interface WalletManagementProps extends DialogProps {
  onClose: () => void;
}

export const WalletManagement: FC<WalletManagementProps> = ({ onClose, ...rest }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addresses } = useContext(AssetsContext);

  const [flowStep, setFlowStep] = useState<EWalletSteps>(EWalletSteps.MANAGE);

  const onCloseDialog = () => {
    onClose();
  };

  const onImportWalletClick = () => {
    setFlowStep(EWalletSteps.IMPORT);
  };

  const onBackButtonClick = () => {
    setFlowStep(EWalletSteps.MANAGE);
  };

  return (
    <Dialog {...rest} classes={{ paper: classes.dialog }} onClose={onCloseDialog} maxWidth="sm" fullWidth={!isMobile}>
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Box display="flex" alignItems="center">
          {flowStep === EWalletSteps.IMPORT ? (
            <Box pl={1}>
              <IconButton onClick={onBackButtonClick}>
                <ArrowLeft />
              </IconButton>
            </Box>
          ) : null}
          <Box flexGrow={1} textAlign="left" paddingLeft={flowStep === EWalletSteps.MANAGE ? 2 : 0}>
            {flowStep === EWalletSteps.MANAGE ? t('Wallet Management') : null}
            {flowStep === EWalletSteps.IMPORT ? t('Import Wallet') : null}
          </Box>
          <Box>
            <IconButton onClick={onCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        {flowStep === EWalletSteps.MANAGE ? (
          <Grid container spacing={2}>
            {addresses.map((i) => (
              <AddressMenu key={i.identifier} address={i} />
            ))}
            <Grid item xs={12} pt={3}>
              <Button
                className={classes.importWalletButton}
                fullWidth
                variant="contained"
                onClick={onImportWalletClick}
              >
                {t('Import Wallet')}
              </Button>
            </Grid>
            {/* Preload img assets to avoid awkward loading in next flowStep */}
            <img
              className={classes.imgButton}
              style={{ display: 'none' }}
              src={getConnectorSrc('metamask')}
              alt="MetaMask"
            />
            <img
              className={classes.imgButton}
              style={{ display: 'none' }}
              src={getConnectorSrc('walletconnect')}
              alt="MetaMask"
            />
          </Grid>
        ) : null}
        {flowStep === EWalletSteps.IMPORT ? (
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex">
              <TextField
                fullWidth
                margin="dense"
                id="import-wallet"
                variant="outlined"
                placeholder="Paste Wallet Address"
              />
            </Grid>
            <Grid item xs={12} display="flex">
              <Button className={classes.importWalletButton} fullWidth variant="contained">
                {t('Import Wallet')}
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Divider className={classes.divider} />
              <Typography
                textAlign="center"
                fontWeight="400"
                lineHeight="20px"
                fontSize="15px"
                color={theme.palette.text.secondary}
                width="150px"
                padding="0 5px"
              >
                {t('Or import from')}
              </Typography>
              <Divider className={classes.divider} />
            </Grid>
            <Grid item xs={12} sm={6} display="flex">
              <Button
                className={clsx(
                  classes.connectButton,
                  settings.theme === 'DARK' ? classes.connectButtonDark : classes.connectButtonLight,
                )}
                fullWidth
                variant="outlined"
              >
                <img className={classes.imgButton} src={getConnectorSrc('metamask')} alt="MetaMask" />
                MetaMask
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} display="flex">
              <Button
                className={clsx(
                  classes.connectButton,
                  settings.theme === 'DARK' ? classes.connectButtonDark : classes.connectButtonLight,
                )}
                fullWidth
                variant="outlined"
              >
                <img className={classes.imgButton} src={getConnectorSrc('walletconnect')} alt="MetaMask" />
                Wallet Connect
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
