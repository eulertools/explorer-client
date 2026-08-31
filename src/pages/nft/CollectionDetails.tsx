import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ScreenSpinner from 'src/components/ScreenSpinner/ScreenSpinner';
import { AppSkeleton } from 'src/components/templates';
import { CollectionDetailsFilterForm } from 'src/pages/nft/components/Collection/CollectionDetailsFilterForm';
import { NFTCard } from 'src/pages/nft/components/NFT/NFTCard';
import { mockCollection } from 'src/pages/nft/mockData';
import { selectFilterState } from 'src/selectors/filters';
import { selectCollectionDetail } from 'src/selectors/nft';
import { UITableID } from 'src/slices/filter.types';
import { getNFT } from 'src/slices/tables/nft';
import { useDispatch, useSelector } from 'src/store';
import { ICollectionDetail } from 'src/types/nft';
import { EulerAlert } from 'src/ui/EulerAlert';
import { PageTitle } from 'src/ui/PageTitle';
import { FilterButton } from 'src/ui/eulerFilter/FilterButton';
import { FilterContainer } from 'src/ui/eulerFilter/FilterContainer';
import { FilterGridSize } from 'src/ui/eulerFilter/FilterGridSize';
import { FilterPagination } from 'src/ui/eulerFilter/FilterPagination';
import { FilterQuery } from 'src/ui/eulerFilter/FilterQuery';

const useStyles = makeStyles((theme) => ({
  filterContainerGrid: {
    paddingTop: `${theme.spacing(0)} !important`,
  },
}));

interface CollectionDetailsProps {
  collection: ICollectionDetail;
}

const CollectionDetails: FC<CollectionDetailsProps> = ({ collection }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const tableId = UITableID.nft_list;
  const { openFilter } = useSelector(selectFilterState(tableId));

  return (
    <AppSkeleton>
      <PageTitle title={t('Collection Details')} />
      <Grid container display="flex" gridTemplateColumns="auto 1fr auto" spacing={2}>
        <Grid item xs={12} display="flex" gridTemplateColumns="1fr auto" columnGap={3} marginBottom={2}>
          <Grid item flexGrow={1}>
            <FilterQuery placeholder="Search by name or attribute" tableId={tableId} />
          </Grid>
          <Grid item>
            <FilterButton tableId={tableId} />
          </Grid>
          <Grid item>
            <FilterGridSize tableId={tableId} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.filterContainerGrid}>
          <FilterContainer
            tableId={tableId}
            FilterForm={CollectionDetailsFilterForm}
            backgroundImage
            topLeftBorder
            topRightBorder
            bottomBorders
          >
            <Grid container display="flex" pb={2} gap={2} pt={openFilter ? 2 : 0}>
              {collection.data.map((c) => (
                <NFTCard nft={c} key={c.token_id} />
              ))}
            </Grid>
          </FilterContainer>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <FilterPagination tableId={tableId} />
        </Grid>
      </Grid>
    </AppSkeleton>
  );
};

// TODO: Include proper guards and checks once API is ready.
const CollectionDetailsWrapper: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { address } = useParams();
  const { loading, error } = useSelector(selectCollectionDetail);

  useEffect(() => {
    if (address) dispatch(getNFT(address, '0'));
  }, [address]);

  if (loading) return <ScreenSpinner />;

  if (!error)
    return (
      <Box pt={2} pb={8} px={2}>
        <EulerAlert type="info" message={t('NFT.COLLECTION_NOT_FOUND')} customIcon />
      </Box>
    );

  return <CollectionDetails collection={{ data: mockCollection }} />;
};

export default CollectionDetailsWrapper;
