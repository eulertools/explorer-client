import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Toolbar, Typography } from '@material-ui/core';

const DashboardLegalFooter: FC = () => {
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        height: '50px',
        position: 'sticky',
        top: '100%',
        paddingBottom: '12px',
        '@media (max-width: 768px)': {
          height: '200px',
        },
      }}
    >
      <Box>
        <Typography
          fontWeight={400}
          fontSize="10px"
          lineHeight="11px"
          sx={{
            color: (theme) => (theme as any).palette.terciary[700],
          }}
        >
          {t('legal_footer')}
        </Typography>
      </Box>
    </Toolbar>
  );
};

export default DashboardLegalFooter;
