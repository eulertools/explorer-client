import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useConfigureTelegramStyles = makeStyles((theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      fontFamily: "'Montserrat', 'Roboto', sans-serif",
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);
