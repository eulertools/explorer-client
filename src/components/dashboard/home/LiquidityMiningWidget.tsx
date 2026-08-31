import { FC } from 'react';
import { Button, createStyles, Grid, makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import waultIcon from '../../../assets/wault.png';

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadBottom: {
      paddingBottom: '0px',
    },
    active: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    stats: {
      marginTop: '0px',
    },
    actions: {
      display: 'block',
      textAlign: 'center',
    },
    iconPancake: {
      width: '20px',
      position: 'absolute',
      right: '10px',
    },
    button: {
      width: '100%',
      borderRadius: '0 0 15px 15px',
      textTransform: 'uppercase',
    },
  }),
);

const LiquidityMiningWidget: FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Grid
      item
      xs={12}
      style={{
        margin: 24,
        marginTop: 40,
        position: 'relative',
        backgroundColor: theme.palette.background.default,
        borderRadius: 16,
      }}
    >
      <img
        src={waultIcon}
        alt="wault-icon"
        height="50px"
        style={{ position: 'absolute', top: -25, left: 'calc(50% - 25px)', borderRadius: '50%' }}
      />
      <Grid
        item
        xs={12}
        style={{
          width: '100%',
          padding: 12,
          paddingTop: 30,
        }}
      >
        <Typography fontSize={14}>Liquidity Mining</Typography>
      </Grid>
      <Button
        className={classes.button}
        target="_blank"
        variant="contained"
        color="primary"
        href="https://app.wault.finance/#farm"
      >
        Mine Now
      </Button>
    </Grid>
  );
};

export default LiquidityMiningWidget;
