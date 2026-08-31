import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Tooltip, Typography, useTheme } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { ButtonSecondary } from 'src/pages/nftcreate/components/ButtonSecondary';
import { GlobalModalItem } from 'src/slices/ui/globalModal';
import { getEnv } from 'src/utils/env';
import { EulerModalContent } from '../components/EulerModalContent';
import { EulerModalTitle } from '../components/EulerModalTitle';

export const EulerModalNft = (props: GlobalModalItem) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const environment = getEnv();

  const nftUrl = `/${props.config.network}/nft/${props.config.address}/${props.config.token_id}`;
  const profileUrl = `/profile/me`;

  const copyUrl = `https://${environment}${nftUrl}`;

  const onButtonClick = () => (props.config.type === 'create' ? navigate(nftUrl) : navigate(profileUrl));

  return (
    <Box
      sx={{
        [theme.breakpoints.up('lg')]: {
          width: '30vw',
        },
        [theme.breakpoints.up('md')]: {
          width: '45vw',
        },
      }}
    >
      <EulerModalTitle
        layout="center"
        modal={props}
        title={props.config.type === 'create' ? t('You created an NFT') : t('Post ad')}
        showAddress={false}
      />
      <EulerModalContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} mb={1}>
          <img
            style={{
              borderRadius: theme.shape.borderRadius,
            }}
            src={props.config.file}
            alt="Nft"
            width="75%"
          />
          <Typography variant="h6" mb={1}>
            {props.config.type === 'create' ? props.config.name : t('Your NFT has been posted!')}
          </Typography>
          <Box width="100%" display="flex" flexDirection="column" gap={2} textAlign="center">
            <ButtonSecondary
              fullWidth
              endIcon={
                <Tooltip title={t('Copy to clipboard')}>
                  <FileCopyOutlinedIcon />
                </Tooltip>
              }
              onClick={() => {
                navigator.clipboard.writeText(copyUrl);
              }}
            >
              {t('Share')}
            </ButtonSecondary>

            <Button fullWidth onClick={onButtonClick}>
              {props.config.type === 'create' ? t('View Details') : t('View on my Profile')}
            </Button>
          </Box>
        </Box>
      </EulerModalContent>
    </Box>
  );
};
