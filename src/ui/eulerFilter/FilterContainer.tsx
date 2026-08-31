import clsx from 'clsx';
import { FC, ReactChild } from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilterIsOpen } from 'src/selectors/filters';
import { GlobalFilterProps } from 'src/slices/filter.types';

const useStyles = makeStyles((theme) => ({
  card: {
    background: theme.palette.background.paper,
    borderRadius: 0,
    padding: '1rem',
  },
  backgroundCard: {
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  },
  topRightBorder: {
    borderTopRightRadius: theme.spacing(2),
  },
  topLeftBorder: {
    borderTopLeftRadius: theme.spacing(2),
  },
  bottomBorders: {
    borderBottomLeftRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
}));

interface FilterContainerProps extends Pick<GlobalFilterProps, 'tableId'> {
  children: ReactChild;
  FilterForm: FC;
  backgroundImage?: boolean;
  topRightBorder?: boolean;
  topLeftBorder?: boolean;
  bottomBorders?: boolean;
}

export const FilterContainer = (props: FilterContainerProps) => {
  const {
    children,
    tableId,
    FilterForm,
    backgroundImage = false,
    topRightBorder = false,
    topLeftBorder = false,
    bottomBorders = false,
  } = props;
  const classes = useStyles();
  const isOpen = useSelector(selectFilterIsOpen(tableId));

  return (
    <Box display="grid" gridTemplateRows={isOpen ? 'auto auto' : 'auto 0px'} columnGap={isOpen ? 2 : 0}>
      {isOpen ? (
        <Box display="grid" height="100%">
          <Card
            className={clsx(
              classes.card,
              { [classes.backgroundCard]: backgroundImage },
              { [classes.topRightBorder]: topRightBorder },
              { [classes.topLeftBorder]: topLeftBorder },
              { [classes.bottomBorders]: bottomBorders },
            )}
          >
            <FilterForm />
          </Card>
        </Box>
      ) : null}
      {children}
    </Box>
  );
};
