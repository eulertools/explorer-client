import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import { localeDate } from 'src/utils/moment';

interface NFTBuySuccessProps extends DialogProps {
  onClose: () => void;
  imageURL: string;
  name: string;
}

export const NFTBuySuccess: FC<NFTBuySuccessProps> = ({ onClose, imageURL, name, ...rest }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const nftUrl = `${window.location.toString()}`;

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog {...rest} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography color="terciary.700" component="span" fontSize={18} fontWeight={700}>
          Congratulations
        </Typography>
        <IconButton
          onClick={onCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <img
            style={{
              border: `1px solid ${theme.palette.divider}`,
              borderWidth: '0px 1px 2px 0px',
              borderRadius: theme.spacing(1),
              padding: theme.spacing(0.5),
              width: '181px',
              height: '176px',
              margin: theme.spacing(3),
            }}
            src={imageURL}
            alt="Nft"
          />
          <Typography fontSize={20} fontWeight={700} color="neutral.600" mb={2}>
            You bought {name}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2} width="100%" px={theme.spacing(1)}>
            <Typography fontSize={11} fontWeight={600} color="terciary.700">
              Transaction date
            </Typography>
            <Typography fontSize={11} fontWeight={500} color="terciary.700">
              {localeDate(new Date().toISOString())}
            </Typography>
          </Box>
          <Box width="100%" display="flex" flexDirection="column" gap={2} textAlign="center">
            <Button
              fullWidth
              endIcon={<IconCopyToClipboard text="0xb5b2cb9f1da6efe7ba48ea267f0cb39d11a9d6cb" />}
              sx={{
                height: '36px',
                padding: '8px 12px',
                fontSize: '16px',
                backgroundColor: theme.palette.primary[50],
                color: theme.palette.primary[400],
                boxShadow: 'none',
                borderRadius: theme.spacing(1.25),
                width: '100%',
                '&:hover': {
                  backgroundColor: theme.palette.primary[100],
                  color: theme.palette.primary[500],
                  boxShadow: 'none',
                },
              }}
              onClick={() => {
                navigator.clipboard.writeText(nftUrl);
              }}
            >
              {t('Share')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
