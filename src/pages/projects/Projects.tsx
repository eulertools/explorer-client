import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import { PageTitle } from 'src/ui/PageTitle';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100%',
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  }),
);

const Projects: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <Box className={classes.root}>
      <PageTitle pageTitle="Projects: Under Construction" />
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Grid display="flex" justifyContent="center" alignItems="center">
          {t('UNDER_CONSTRUCTION')}
        </Grid>
      </Container>
    </Box>
  );
};

export default Projects;
