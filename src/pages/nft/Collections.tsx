import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppSkeleton } from 'src/components/templates';
import { CollectionsFilterForm } from 'src/pages/nft/components/Collection/CollectionsFilterForm';
import { CollectionsTable } from 'src/pages/nft/components/Collection/CollectionsTable';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { useSelector } from 'src/store';
import { CardRoot } from 'src/ui/CardRoot';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';

const useStyles = makeStyles((theme) => ({
  filterContainerGrid: {
    paddingTop: `${theme.spacing(0)} !important`,
  },
}));

const Collections: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const tableId = UITableID.collections;
  const { openFilter } = useSelector(selectFilterState(tableId));

  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  return (
    <AppSkeleton>
      <PageTitle title={t('Collections')} />
      <Grid container display="flex" gridTemplateColumns="auto 1fr auto" spacing={2}>
        <Grid item xs={12} display="flex" gridTemplateColumns="1fr auto" columnGap={3} marginBottom={2}>
          <Grid item flexGrow={1}>
            <FilterQuery placeholder="Search by name or attribute" tableId={tableId} />
          </Grid>
          <Grid item>
            <FilterButton tableId={tableId} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.filterContainerGrid}>
          <FilterContainer
            tableId={tableId}
            FilterForm={CollectionsFilterForm}
            backgroundImage
            topLeftBorder
            topRightBorder
          >
            <CardRoot noTopLeftBorder={openFilter} noTopRightBorder={openFilter} minWidth={!isMobile ? 1000 : null}>
              <CollectionsTable tableId={tableId} />
            </CardRoot>
          </FilterContainer>
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

export default Collections;
