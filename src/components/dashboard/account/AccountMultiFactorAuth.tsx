import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChooseMFA from 'src/components/authentication/mfa/ChooseMFA';
import { EMFATypes } from 'src/contexts/AmplifyContext';
import useAuth from 'src/hooks/useAuth';

const AccountMultiFactorAuth = () => {
  const { t } = useTranslation();
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    user: { preferred_mfa },
    disableMfa,
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  async function onDisableMFA() {
    setLoading(true);
    await disableMfa();
    setLoading(false);
  }

  return (
    <Grid container paddingX={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" fontWeight="700">
          {t('Multi-factor Authentication')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {preferred_mfa === null || preferred_mfa === EMFATypes.NOMFA ? <ChooseMFA /> : null}
        {preferred_mfa === EMFATypes.TOTP ? (
          <>
            <Typography marginTop={2} marginBottom={4}>
              Two step verification is configured via Authenticator App (Google Authenticator, Authy, etc.). Click
              disable if you no longer want to rely on this method:
            </Typography>
            <Box textAlign="center">
              <Button variant="contained" onClick={onDisableMFA} disabled={loading}>
                {t('DISABLE MFA')}
              </Button>
            </Box>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default AccountMultiFactorAuth;
