import { FC } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';

export interface IScreenSpinner {
  size?: number;
}

const ScreenSpinner: FC<IScreenSpinner> = ({ size = 50 }) => (
  <Grid container alignItems="center" justifyContent="center" display="flex" minHeight="50vh">
    <Grid item xs={12} display="flex" justifyContent="center">
      <CircularProgress size={size} />
    </Grid>
  </Grid>
);

export default ScreenSpinner;
