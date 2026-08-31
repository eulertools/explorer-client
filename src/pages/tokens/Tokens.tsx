import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles, Typography, createStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { AppSkeleton } from 'src/components/templates';
import useSettings from 'src/hooks/useSettings';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { CardRoot } from 'src/ui/CardRoot';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';
import { FilterVerifiedOnly } from 'src/ui/eulerFilter/FilterVerifiedOnly';
import { TokenFilterForm } from './components/TokenFilterForm';
import TokensTable from './components/TokensTable';

const Tokens: FC = () => {
  const { t } = useTranslation();

  const filters = useSelector(selectFilterState(UITableID.token_list));
  const tableId = UITableID.token_list;

  const { settings } = useSettings();

  const useStyles = makeStyles((theme) =>
    createStyles({
      textWhite: {
        color: 'white',
      },
      textNormal: {
        color: theme.palette.text.primary,
      },
      switch: {
        fontWeight: theme.typography.h6.fontWeight,
        fontSize: '15.5px',
      },
    }),
  );

  const classes = useStyles();

  return (
    <AppSkeleton>
      <Box display="grid" alignItems="center" justifyContent="space-between" gridTemplateColumns="1fr auto">
        <PageTitle title={t('Tokens')} />
      </Box>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Box display="flex" alignItems="center" columnGap={1} mt={0.5}>
          <Box>
            <Typography
              className={
                settings.theme === 'DARK'
                  ? `${classes.textWhite} ${classes.switch}`
                  : `${classes.textNormal}  ${classes.switch}`
              }
            >
              {t('Safe mode')}
            </Typography>
          </Box>
          <Box>
            <FilterVerifiedOnly tableId={tableId} />
          </Box>
        </Box>
        <Box>
          <FilterQuery placeholder="Search by name" tableId={tableId} />
        </Box>
      </Box>
      <FilterContainer tableId={tableId} FilterForm={TokenFilterForm} backgroundImage topLeftBorder topRightBorder>
        <CardRoot noTopLeftBorder={filters.openFilter} noTopRightBorder={filters.openFilter}>
          <TokensTable tableId={tableId} />
        </CardRoot>
      </FilterContainer>
    </AppSkeleton>
  );
};

export default Tokens;
