import { useFormik } from 'formik';
import numeral from 'numeral';
import { FC } from 'react';
import { IMaskMixin } from 'react-imask';
import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'src/lib/axios';

const useStyles = makeStyles((theme) =>
  createStyles({
    modalButton: {
      width: 124,
      height: 41,
    },
    customDialog: {
      '& div.MuiDialog-paperWidthSm': {
        maxWidth: 800,
      },
    },
    positiveButton: {
      color: theme.palette.success.main,
      margin: `0 ${theme.spacing(0.5)}`,
      fontWeight: theme.typography.fontWeightBold,
      border: `1px solid ${theme.palette.success.main}`,
      '&:hover': {
        backgroundColor: theme.palette.success.main,
        color: 'white',
      },
      '&:active': {
        color: 'white',
        backgroundColor: theme.palette.success.main,
      },
      '&:focus': {
        color: 'white',
        backgroundColor: theme.palette.success.main,
      },
    },
    buttonsContainer: {
      margin: `0 ${theme.spacing(2)}`,
    },
    negativeButton: {
      color: theme.palette.error.main,
      margin: `0 ${theme.spacing(0.5)}`,
      fontWeight: theme.typography.fontWeightBold,
      border: `1px solid ${theme.palette.error.main}`,
      '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: 'white',
      },
      '&:active': {
        color: 'white',
        backgroundColor: theme.palette.error.main,
      },
      '&:focus': {
        color: 'white',
        backgroundColor: theme.palette.error.main,
      },
    },
    separatedContent: {
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    priceLabelContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: '.5em',
      alignItems: 'center',
    },
    actionsContainer: {
      justifyContent: 'center',
    },
    centeredText: {
      textAlign: 'center',
    },
    menu: {
      width: 125,
    },
  }),
);

const MaskedStyledInput = IMaskMixin(({ inputRef, ...props }) => (
  <TextField
    {...props}
    autoFocus
    fullWidth
    margin="dense"
    id="price"
    name="price"
    variant="outlined"
    inputRef={inputRef} // bind internal input (if you use styled-components V4, use "ref" instead "innerRef")
  />
));

interface IPriceNotificationModalProps {
  open: boolean;
  handleClose: any;
  currentPrice: string;
  tokenHash?: string;
  symbol?: string;
  setSubscribed: Function;
}

const PriceNotificationModal: FC<IPriceNotificationModalProps> = ({
  open,
  handleClose,
  currentPrice,
  setSubscribed,
  tokenHash,
  symbol,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const handleSubmit = (values) => {
    const params = {
      priceToSub: values.price,
      tokenToSub: tokenHash || symbol,
      exchange: values.exchange,
    };

    axios.privateFetchClient
      .post(`TBD`, params)
      .then(() => {
        setSubscribed();
      })
      .catch(() => {})
      .finally(() => {
        handleClose();
      });
  };

  const formik = useFormik({
    initialValues: {
      price: '',
      exchange: 'usd',
    },
    onSubmit: handleSubmit,
  });

  const subToValue = (multiplier: number) => () => {
    if (!currentPrice || !Number(currentPrice)) return;

    const price = Number(currentPrice) * multiplier;
    formik.setFieldValue('price', Number(price));
  };

  // TODO: should we add react-number-format to display better the price field?

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      className={classes.customDialog}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          id="form-dialog-title"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              pt: 2,
              textAlign: 'center',
            }}
          >
            <Typography color="primary" variant="h6">
              ADD PRICE ALERT
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 1,
                top: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} className={classes.separatedContent}>
              <Typography color="primaryText">
                When the price hits the target price, an alert will be sent to you via browser notification.
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.centeredText}>
              <Typography fontWeight="fontWeightBold" color="primaryText">
                CURRENT PRICE IS {numeral(currentPrice).format('$0,0.00[00]')}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.priceLabelContainer}>
              <Typography fontWeight="fontWeightBold" color="primaryText">
                1 {symbol?.toUpperCase()}:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <MaskedStyledInput
                mask={Number}
                radix="."
                scale={4}
                unmask
                thousandsSeparator=","
                value={String(formik.values?.price) || ''}
                onAccept={
                  // depending on prop above first argument is
                  // `value` if `unmask=false`,
                  // `unmaskedValue` if `unmask=true`,
                  // `typedValue` if `unmask='typed'`
                  (value) => {
                    formik.setFieldValue('price', Number(value));
                  }
                }
                // ...and more mask props in a guide

                // input props also available
                placeholder="Enter number here"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl margin="dense" sx={{ marginLeft: 2 }}>
                <Select className={classes.menu} value={formik.values.exchange}>
                  <MenuItem value="usd">USD</MenuItem>
                  <MenuItem value="bnb">BNB</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container className={classes.separatedContent}>
              <Box className={classes.buttonsContainer}>
                <Button variant="outlined" size="large" className={classes.negativeButton} onClick={subToValue(0.8)}>
                  -20%
                </Button>
                <Button variant="outlined" size="large" className={classes.negativeButton} onClick={subToValue(0.9)}>
                  -10%
                </Button>
                <Button variant="outlined" size="large" className={classes.negativeButton} onClick={subToValue(0.95)}>
                  -5%
                </Button>
              </Box>
              <Box className={classes.buttonsContainer}>
                <Button variant="outlined" size="large" className={classes.positiveButton} onClick={subToValue(1.05)}>
                  +5%
                </Button>
                <Button variant="outlined" size="large" className={classes.positiveButton} onClick={subToValue(1.1)}>
                  +10%
                </Button>
                <Button variant="outlined" size="large" className={classes.positiveButton} onClick={subToValue(1.2)}>
                  +20%
                </Button>
              </Box>
            </Grid>
          </Grid>
          <DialogActions className={classes.actionsContainer}>
            <Button onClick={handleClose} color="primary" variant="outlined" className={classes.modalButton}>
              CANCEL
            </Button>
            <Button type="submit" variant="contained" color="primary" className={classes.modalButton}>
              SAVE
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default PriceNotificationModal;
