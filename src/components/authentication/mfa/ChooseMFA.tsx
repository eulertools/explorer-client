import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ConfigureTotp from './Totp';

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      width: 200,
      margin: theme.spacing(2, 'auto'),
      display: 'block',
    },
  }),
);

enum EMFAType {
  TOTP = 'TOTP',
}

const ChooseMFA = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [mfaType, setMfaType] = useState<EMFAType | null>(null);

  async function onConfigureTotp() {
    setMfaType(EMFAType.TOTP);
  }

  function onCancelFlow() {
    setMfaType(null);
  }

  return (
    <Grid container spacing={2}>
      {mfaType === null ? (
        <Grid item xs={12} marginTop={2}>
          <Typography marginBottom={4}>
            For an extra layer of security, set up multi-factor authentication with one of the following methods:
          </Typography>
          <Box>
            <Button className={classes.button} variant="contained" onClick={onConfigureTotp}>
              {t('AUTHENTICATOR APP')}
            </Button>
            <Button disabled className={classes.button} variant="contained">
              {t('SMS')}
            </Button>
          </Box>
        </Grid>
      ) : null}
      {mfaType === EMFAType.TOTP ? (
        <Grid item xs={12} marginTop={2}>
          <ConfigureTotp onCancelFlow={onCancelFlow} />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default ChooseMFA;
