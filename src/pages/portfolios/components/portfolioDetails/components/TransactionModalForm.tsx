import { RED } from '@eulertools/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
import CloseIcon from '@material-ui/icons/Close';
import { addItemToPortfolio, IPortfolioDetailsItem, removeItemFromPortfolio } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';
import { isAddress, isTransaction } from 'src/utils/stringUtils';

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
  redButton: {
    color: RED,
  },
}));

interface ITransactionModalFormProps {
  onClose: () => void;
  item: Partial<IPortfolioDetailsItem>;
  headerLabel: string;
}

// TODO move to useCallback inside when we do translations
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required.'),
  identifier: Yup.string()
    .test('len', 'Input a valid Hash.', (value) => isAddress(value) || isTransaction(value))
    .required('Required'),
});

const TransactionModalForm: FC<ITransactionModalFormProps> = ({ onClose, item, headerLabel }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selected: selectedPortfolio = null } = useSelector((state) => state.portfolios);

  // If we are editing a portfolio item then we should have the identifier
  const isEdit = !!item.identifier;

  const handleSubmit = (values) => {
    const params = {
      name: values.name,
      order: 1,
      identifier: values.identifier,
      type: values.type,
    };

    dispatch(addItemToPortfolio(params, selectedPortfolio.identifier));
    onClose();
  };

  const handleDelete = () => {
    dispatch(removeItemFromPortfolio(item.identifier, selectedPortfolio.identifier));
    onClose();
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      identifier: item.identifier || '',
      name: item.name || '',
      type: item.type,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
          <Box textAlign="center">
            {headerLabel}
            <IconButton className={classes.iconButton} onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} mb={2}>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                id="hash-key"
                name="identifier"
                variant="outlined"
                label={t('Hash')}
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.identifier && formik.errors.identifier)}
                helperText={formik.touched.identifier && formik.errors.identifier}
                disabled={isEdit}
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
                onBlur={formik.handleBlur}
                error={!!(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Grid container>
            {isEdit ? (
              <Grid item display="flex" justifyContent="flex-start" flexGrow={1}>
                <Button variant="outlined" className={classes.redButton} onClick={handleDelete} color="secondary">
                  {t('REMOVE')}
                </Button>
              </Grid>
            ) : null}
            <Grid item display="flex" justifyContent="center" width={isEdit ? 'auto' : '100%'} gap={2}>
              <Button variant="outlined" onClick={onClose} color="primary">
                {t('CANCEL')}
              </Button>
              <Button variant="contained" type="submit" color="primary">
                {isEdit ? t('EDIT') : t('ADD')}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModalForm;
