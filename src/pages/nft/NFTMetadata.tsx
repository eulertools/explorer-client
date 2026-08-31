import { EulerIconArrowDown } from '@eulertools/ui';
import { FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import { INFTItem, IAttribute } from 'src/types/nft';
import { getAge, localeDate, parseAPIDate } from 'src/utils/moment';

interface MetadataItemProps {
  metadata: IAttribute;
}

const MetadataItem: FC<MetadataItemProps> = ({ metadata }) => {
  const theme = useTheme();
  const [displayAge, setDisplayAge] = useState<boolean>(false);

  const onToggle = () => setDisplayAge((prev) => !prev);

  const metadataValueComponent = useMemo(() => {
    switch (metadata.display_type) {
      case 'date':
        return (
          <Typography
            onClick={onToggle}
            sx={{
              color: (theme as any).palette.terciary[600],
              fontSize: '13px !important',
              lineHeight: '17px',
              fontWeight: '500',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            {displayAge
              ? getAge(parseAPIDate(metadata.value).toISOString())
              : localeDate(parseAPIDate(metadata.value).toISOString())}
          </Typography>
        );
      case 'boolean':
        if (metadata.value === 'true') return <CheckCircleOutline sx={{ color: theme.palette.success.main }} />;
        return <CancelOutlinedIcon sx={{ color: theme.palette.error.main }} />;
      case 'url':
        return (
          <Link target="_blank" href={metadata.value} rel="noreferrer">
            {metadata.value}
          </Link>
        );
      default:
        return (
          <Typography
            variant="h6"
            sx={{
              color: (theme as any).palette.terciary[600],
              fontSize: '13px !important',
              lineHeight: '17px',
              fontWeight: '500',
            }}
          >
            {metadata.value}
          </Typography>
        );
    }
  }, [metadata, displayAge]);

  return (
    <>
      <Grid item xs={12} pb={1}>
        <Typography
          variant="h6"
          sx={{
            color: (theme as any).palette.terciary[700],
            fontSize: '11px !important',
            lineHeight: '15px',
            fontWeight: '600',
          }}
        >
          {metadata.trait_type}
        </Typography>
      </Grid>
      <Grid item xs={12} pb={1}>
        {metadataValueComponent}
      </Grid>
    </>
  );
};

interface NFTMetadataProps {
  nft: INFTItem;
}

export const NFTMetadata: FC<NFTMetadataProps> = ({ nft }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Accordion
      sx={{
        background: theme.palette.background.default,
        boxShadow: 'none',
      }}
    >
      <AccordionSummary
        expandIcon={<EulerIconArrowDown size="s" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography
          variant="h6"
          sx={{
            color: (theme as any).palette.terciary[700],
            fontSize: '13px !important',
            lineHeight: '17px',
            fontWeight: '600',
          }}
        >
          {t('Metadata')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid item xs={12} display="flex">
          {nft?.metadata?.settings ? (
            <Grid item xs={12} display="flex">
              <Grid container display="flex" flexDirection="row" spacing={0.5}>
                <Grid item xs={12} pb={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme as any).palette.terciary[700],
                      fontSize: '13px !important',
                      lineHeight: '17px',
                      fontWeight: '600',
                    }}
                  >
                    {t('Event')}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme as any).palette.terciary[700],
                      fontSize: '11px !important',
                      lineHeight: '15px',
                      fontWeight: '600',
                    }}
                  >
                    {t('Start Date')}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[600],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '500',
                      }}
                    >
                      {nft.metadata.settings?.start_date_mint
                        ? parseAPIDate(nft.metadata.settings?.start_date_mint).toLocaleString()
                        : '--'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme as any).palette.terciary[700],
                      fontSize: '11px !important',
                      lineHeight: '15px',
                      fontWeight: '600',
                    }}
                  >
                    {t('End Date')}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[600],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '500',
                      }}
                    >
                      {nft.metadata.settings?.start_date_mint
                        ? parseAPIDate(nft.metadata.settings?.start_date_mint).toLocaleString()
                        : '--'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme as any).palette.terciary[700],
                      fontSize: '11px !important',
                      lineHeight: '15px',
                      fontWeight: '600',
                    }}
                  >
                    {t('Total Supply')}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme as any).palette.terciary[600],
                        fontSize: '13px !important',
                        lineHeight: '17px',
                        fontWeight: '500',
                      }}
                    >
                      {nft.metadata.settings?.max_total_supply}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          {nft.metadata?.attributes ? (
            <Grid item xs={12} display="flex">
              <Grid container spacing={0.5}>
                {nft.metadata?.attributes?.map((metadata) => (
                  <MetadataItem key={metadata.trait_type} metadata={metadata} />
                ))}
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
