import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { AppSkeleton } from 'src/components/templates';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { CardRoot } from 'src/ui/CardRoot';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';
import { PairFilterForm } from './components/PairFilterForm';
import { PairsTable } from './components/PairsTable';

const Pairs: FC = () => {
  const { t } = useTranslation();

  const filters = useSelector(selectFilterState(UITableID.pair_list));
  const tableId = UITableID.pair_list;

  return (
    <AppSkeleton>
      <Box display="grid" alignItems="center" justifyContent="space-between" gridTemplateColumns="1fr auto">
        <PageTitle title={t('Pairs')} />
      </Box>
      <Box display="grid" gridTemplateColumns="1fr auto" columnGap={3} marginBottom={2}>
        <Box>
          <FilterQuery placeholder="Search by pair name..." tableId={tableId} />
        </Box>
        <Box>
          <FilterButton tableId={tableId} />
        </Box>
      </Box>
      <FilterContainer topLeftBorder topRightBorder backgroundImage tableId={tableId} FilterForm={PairFilterForm}>
        <CardRoot noTopLeftBorder={filters.openFilter} noTopRightBorder={filters.openFilter}>
          <PairsTable tableId={tableId} />
        </CardRoot>
      </FilterContainer>
    </AppSkeleton>
  );
};

export default Pairs;
