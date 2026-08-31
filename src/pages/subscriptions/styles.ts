import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    item: {
      width: '32%',
      marginTop: '1rem',

      '@media (max-width: 1620px)': {
        width: '48%',
      },

      '@media (max-width: 768px)': {
        width: '100%',
      },
    },
    card: {
      borderRadius: '1.2rem',
      boxShadow: '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
      position: 'relative',
      padding: '2rem 0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    topBG: {
      width: '100%',
      height: '1.2rem',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    header: {
      minHeight: '196px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      textAlign: 'center',
    },
    title: {
      marginTop: '0.6rem',
      color: '#a1a6a7',
      fontSize: '0.96rem',
      fontWeight: 600,
    },
    price: {
      marginTop: '1rem',
      color: theme.palette.mode === 'dark' ? '#fff' : '#42526e',
      fontSize: '2rem',
      fontWeight: 500,
    },
    info: {
      marginTop: '0.4rem',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    sale: {
      marginTop: '0.6rem',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    desc: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: '0 3rem',
      fontSize: '0.92rem',
      fontWeight: 500,
      color: '#a1a6a7',
    },
    details: {
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 2rem',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 0',
      wordWrap: 'break-word',
      fontSize: '0.85rem',
      lineHeight: 1.4,
    },
    checkIcon: {
      display: 'inline-block',
      color: '#688eff',
      marginRight: '0.5rem',
      width: '20px',
      height: '20px',
    },
    undoIcon: {
      display: 'inline-block',
      color: '#688eff',
      marginRight: '0.5rem',
      width: '32px',
      height: '32px',
    },
    cardActions: {
      padding: '1rem 0',
      display: 'flex',
      justifyContent: 'center',
    },
    selectButton: {
      width: '50%',
      fontSize: '1rem',
      padding: '3px 0',
    },
    contrastText: {
      color: theme.palette.primary.contrastText,
    },
  }),
);
