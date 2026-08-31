import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AppSkeleton } from 'src/components/templates';
import gtm from 'src/lib/gtm';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { CardRoot } from 'src/ui/CardRoot';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';
import { MarketFilterForm } from './components/MarketFilterForm';
import MarketsTable from './components/MarketsTable';

const Markets: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const filters = useSelector(selectFilterState(UITableID.market_list));
  const tableId = UITableID.market_list;

  const mobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  const eventPush = () => {
    gtm.push({ event: 'user_focused_search_input', category: 'Tokens', action: 'User Focused Search Input' });
  };

  return (
    <AppSkeleton>
      <FilterContainer tableId={tableId} FilterForm={MarketFilterForm} backgroundImage topLeftBorder topRightBorder>
        <CardRoot minWidth={1100} noTopLeftBorder={filters.openFilter} noTopRightBorder={filters.openFilter}>
          <>
            <Grid
              container
              display="flex"
              sx={{
                padding: `25px ${theme.spacing(2)}`,
              }}
            >
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  '& > h4': {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: '22px',
                    color: (theme as any).palette.terciary[700],
                    marginBottom: '0px',
                  },
                }}
              >
                <PageTitle title={t('Tokens')} />
              </Grid>
              <Grid item xs={12} md={4} mt={mobileScreen ? 2 : 0}>
                <FilterQuery
                  onFocus={eventPush}
                  captureEventsOf="tokens"
                  placeholder="Search by name or symbol"
                  tableId={tableId}
                />
              </Grid>
            </Grid>
            <MarketsTable tableId={tableId} />
          </>
        </CardRoot>
      </FilterContainer>
    </AppSkeleton>
  );
};

export default Markets;
