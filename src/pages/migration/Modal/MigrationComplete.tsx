import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { EulerToken } from 'src/ui/EulerToken';
import { BNBToken } from 'src/utils/marketplace';

interface MigrationCompleteProps extends DialogProps {
  onClose: () => void;
  amount: string;
}

export const MigrationComplete: FC<MigrationCompleteProps> = ({ onClose, amount, ...rest }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { chain } = useContext(ConfigurationContext);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const migrationContractAddress = useMemo(() => chain?.bsc?.products?.token, [chain?.bsc?.products?.token]);

  return (
    <Dialog onClose={onClose} maxWidth="xs" fullWidth={!isSmallScreen} sx={{ width: '100%' }} {...rest}>
      <DialogTitle style={{ paddingRight: 4, paddingLeft: 4 }}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} textAlign="left" ml={3}>
            {t('Congratulations')}
          </Box>
          <Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(4),
            '& > div': {
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(0),
            },
            '& > div > div': {
              width: '150px',
              height: '150px',
            },
            '& > div > a > p': {
              fontSize: theme.spacing(4),
              fontWeight: 600,
              marginLeft: theme.spacing(3),
            },
          }}
        >
          <EulerToken address={migrationContractAddress} name="" addressLink={BNBToken} avatarSize="extra" />
          <Typography variant="h5" fontWeight={600} textAlign="center">
            {amount ? `${amount} EULER` : 'N/A'}
          </Typography>
          <Typography variant="subtitle1" textAlign="center" fontWeight={600}>
            {t('Migrated successfully')}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{
              background: theme.palette.primary[50],
              boxShadow: 'none',
              color: theme.palette.primary[400],
              '&:hover': {
                color: theme.palette.primary[400],
                background: theme.palette.primary[100],
                boxShadow: 'none',
              },
            }}
          >
            {t('Continue')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
