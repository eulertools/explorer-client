import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainCard: {
      border: 'none',
      boxShadow: 'none',
    },
    stats: {
      marginTop: '0px',
    },
    active: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    conversion: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      '& .MuiButton-outlined': {
        borderRadius: '100px',
      },
    },
  }),
);

interface ConversionWidgetProps {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
}

const ConversionWidget: FC<ConversionWidgetProps> = ({ symbol, setSymbol }) => {
  const classes = useStyles();
  return (
    <Card className={classes.mainCard}>
      <CardContent>
        <Typography variant="h6">Conversion</Typography>
        <ButtonGroup
          className={classes.conversion}
          color="primary"
          size="large"
          aria-label="outlined primary button group"
        >
          <Button
            size="large"
            className={`${symbol === 'BNB' ? classes.active : null}`}
            onClick={() => setSymbol('BNB')}
          >
            BNB
          </Button>
          <Button
            size="large"
            className={`${symbol === 'BUSD' ? classes.active : null}`}
            onClick={() => setSymbol('BUSD')}
          >
            BUSD
          </Button>
        </ButtonGroup>
        <Grid className={classes.stats} container spacing={2} alignItems="center">
          <Grid item xs={5}>
            Minimum Received
          </Grid>
          <Grid item xs={7} textAlign="right">
            <Box>--</Box>
          </Grid>
          <Grid item xs={5}>
            Price Impact
          </Grid>
          <Grid item xs={7} textAlign="right">
            <Box>--</Box>
          </Grid>
          <Grid item xs={4}>
            Liquidity Provider Fee
          </Grid>
          <Grid item xs={8} textAlign="right">
            <Box>--</Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConversionWidget;
