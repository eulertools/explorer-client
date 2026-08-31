import { makeStyles, Typography, Box } from '@material-ui/core';
import { GridColumnHeaderParams } from '@material-ui/data-grid';

const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 400,
    fontSize: '14px',
  },
}));

export interface EulerTableHeaderProps extends GridColumnHeaderParams {
  filterComponent?: React.ReactChild;
}

export const EulerTableHeader = (props: EulerTableHeaderProps) => {
  const classes = useStyles();
  const { colDef, filterComponent } = props;
  return (
    <Box display="grid" gridTemplateColumns={filterComponent ? '1fr 40px' : '1fr'}>
      <Box>
        <Typography className={classes.header}>{colDef.headerName}</Typography>
      </Box>
      {filterComponent ? <Box>{filterComponent}</Box> : null}
    </Box>
  );
};
