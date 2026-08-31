import { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { GridToolbarContainer } from '@material-ui/data-grid';

type GridToolbarProps = {
  title: string;
  subtitle?: string;
};

const AccountsGridToolbar: FC<GridToolbarProps> = ({ title, subtitle }) => (
  <GridToolbarContainer>
    <Grid container display="flex" justifyContent="space-between" paddingX={4} paddingTop={5} paddingBottom={4}>
      <Typography color="textPrimary" variant="h5">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="textPrimary" variant="body2">
          {subtitle}
        </Typography>
      )}
    </Grid>
  </GridToolbarContainer>
);

export default AccountsGridToolbar;
