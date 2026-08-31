import { ExtendedTheme } from '@eulertools/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Create';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { selectWallet } from 'src/selectors/wallets';
import {
  addNewWallet,
  deleteWallet,
  editWallet,
  WalletCreateRequest,
  WalletItem,
  WalletResponse,
} from 'src/slices/user/wallet';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { checkValidAddress } from 'src/utils/validators';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  dialogActions: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
  },
  iconButton: {
    position: 'absolute',
    right: 1,
    top: 1,
  },
  eulerButton: {
    background: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required.'),
  address: Yup.string()
    .test('len', 'Input a valid Address.', (value) => checkValidAddress(value))
    .required('Required'),
});

export interface WalletsFormModalProps {
  currentWallet?: WalletItem;
}

export const WalletsFormModal = (props: WalletsFormModalProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const isMountedRef = useIsMountedRef();
  const onClose = useCallback(() => isMountedRef.current && setOpen(!open), [open]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { creatingLoading, errorCreatingEdit } = useSelector(selectWallet);
  const edit = !!(props.currentWallet && props.currentWallet.address);

  const onDelete = useCallback(async () => {
    await dispatch(deleteWallet(props.currentWallet?.identifier));
    onClose();
  }, [props.currentWallet?.address]);
  const onSubmit = useCallback(
    async (values: WalletCreateRequest) => {
      if (edit) await dispatch(editWallet(values));
      else await dispatch(addNewWallet(values));
      onClose();
    },
    [edit],
  );
  const formik = useFormik<WalletCreateRequest>({
    validateOnChange: false,
    initialValues: edit
      ? { ...props.currentWallet }
      : ({
          address: '',
          name: '',
        } as WalletResponse),
    validationSchema,
    onSubmit,
  });
  const { errors, touched } = formik;

  const pureBtn = useMemo(
    () =>
      edit ? (
        <IconButton sx={{ marginRight: 1 }} size="small" onClick={onClose}>
          <EditIcon fontSize="small" />
        </IconButton>
      ) : (
        <Button className={classes.eulerButton} variant="contained" color="primary" size="large" onClick={onClose}>
          <AddIcon fontSize="small" />
          {t('CREATE WALLET')}
        </Button>
      ),
    [edit],
  );

  return (
    <Box>
      {pureBtn}
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        {creatingLoading ? (
          <EulerLoading />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle className={classes.dialogTitle}>
              {edit ? `${t('EDIT WALLET')}: ${props.currentWallet.name}` : t('CREATE WALLET')}
            </DialogTitle>
            <IconButton className={classes.iconButton} onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <DialogContent>
              <Grid container mt={1}>
                <Grid item xs={12} mb={2}>
                  <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    name="address"
                    variant="outlined"
                    label={t('Address')}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={touched.address && Boolean(errors.address)}
                    helperText={errors.address}
                    disabled={edit}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    id="name"
                    name="name"
                    variant="outlined"
                    label={t('Name')}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={errors.name}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            {errorCreatingEdit && <EulerError error={errorCreatingEdit} minHeight="60px" />}
            <DialogActions className={classes.dialogActions}>
              <Grid container>
                {edit ? (
                  <Grid item display="flex" justifyContent="flex-start" flexGrow={1}>
                    <Button variant="outlined" onClick={onDelete} color="secondary">
                      {t('DELETE')}
                    </Button>
                  </Grid>
                ) : null}
                <Grid item display="flex" justifyContent="center" width={edit ? 'auto' : '100%'} gap={2}>
                  <Button variant="outlined" onClick={onClose} color="primary">
                    {t('CANCEL')}
                  </Button>
                  <Button variant="contained" type="submit" color="primary">
                    {edit ? t('EDIT') : t('CREATE')}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Box>
  );
};
