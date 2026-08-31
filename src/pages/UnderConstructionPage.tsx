import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { PageTitle } from 'src/ui/PageTitle';
import useSettings from '../hooks/useSettings';

const UnderConstructionPage: FC = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <Box minHeight="100%" py="80px" sx={{ backgroundColor: 'background.default' }}>
      <PageTitle pageTitle="Under Construction" />
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <Typography color="textPrimary">{t('UNDER_CONSTRUCTION')}</Typography>
        </Grid>
      </Container>
    </Box>
  );
};

export default UnderConstructionPage;
