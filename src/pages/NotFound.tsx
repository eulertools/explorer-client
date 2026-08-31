import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { PageTitle } from 'src/ui/PageTitle';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      minHeight: '100%',
      padding: `${theme.spacing(10)} ${theme.spacing(3)}`,
    },
    message: {
      marginTop: '4px',
    },
    underDevelopment: {
      height: 'auto',
      maxWidth: '100%',
      width: 400,
      marginLeft: '4.25em',
    },
  }),
);

const NotFound: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className={classes.root}>
      <PageTitle pageTitle="Error: Not Found" />
      <Container maxWidth="lg">
        <Typography align="center" color="textPrimary" variant={mobileDevice ? 'h4' : 'h1'}>
          {t('ERRORS.404')}
        </Typography>
        <Typography className={classes.message} align="center" color="textSecondary" variant="subtitle1">
          {t('ERRORS.404_MESSAGE')}
        </Typography>
        <Box display="flex" justifyContent="center" mt={6}>
          <Box
            className={classes.underDevelopment}
            alt="Under development"
            component="img"
            src={`/static/error/error404_${theme.palette.mode}.svg`}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={6}>
          <Button color="primary" component={RouterLink} to="/" variant="outlined">
            {t('Back to Home')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
