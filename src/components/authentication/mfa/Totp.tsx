import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import useAuth from 'src/hooks/useAuth';
import QRCodeDisplay from 'src/ui/QRCodeDisplay';
import { loggerException } from 'src/utils/logger';
import VerifyTotpCode from './VerifyTotpCode';

interface IProps {
  onCancelFlow: () => void;
}

const ConfigureTotp = ({ onCancelFlow }: IProps) => {
  const navigate = useNavigate();
  const { user, requestTotpCode, activateTotp } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [totpData, setTotpData] = useState<{ code: string; uri: string }>(null);

  useEffect(() => {
    async function getCode() {
      try {
        const code = await requestTotpCode();
        const uri = `otpauth://totp/Euler.tools:${user.username}?secret=${code}`;

        setTotpData({ code, uri });
      } catch (error) {
        loggerException(error);
      } finally {
        setLoading(false);
      }
    }

    getCode();
  }, []);

  async function onVerifyCode(code: string) {
    await activateTotp(code);

    navigate('/authentication/login');
  }

  if (loading) {
    return (
      <Box marginBottom={2} display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography fontSize={14} marginBottom={2}>
        Scan the following QR:
      </Typography>
      <Box marginBottom={2} display="flex" justifyContent="center">
        <QRCodeDisplay qrCodeValue={totpData.uri} />
      </Box>
      <Box>
        <Typography fontSize={14}>Or copy the code below:</Typography>
        <Box>
          <HashCopyToClipboard value={totpData.code}>
            <Typography component="span" fontSize={14} textOverflow="ellipsis" overflow="hidden">
              {totpData.code}
            </Typography>
          </HashCopyToClipboard>
        </Box>
      </Box>
      <Box>
        <VerifyTotpCode onCancelFlow={onCancelFlow} onVerifyCode={onVerifyCode} />
      </Box>
    </>
  );
};

export default ConfigureTotp;
