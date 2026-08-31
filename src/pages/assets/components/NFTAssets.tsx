import { FC, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AssetsContext } from 'src/pages/assets/AssetsContext';
import { NFTAssetsTable } from 'src/pages/assets/components/NFTAssetsTable';
import { selectFilterState } from 'src/selectors/filters';
import { selectAssetsNFTList } from 'src/selectors/nft';
import { UITableID } from 'src/slices/filter.types';
import { getAssetsNFTList } from 'src/slices/tables/nft';
import { useSelector, useDispatch } from 'src/store';
import { FilterNFTPagination } from 'src/ui/eulerFilter/FilterNFTPagination';
import { isAddress } from 'src/utils/stringUtils';

const NFTAssets: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const tableId = UITableID.assets_nft_list;
  const filters = useSelector(selectFilterState(tableId));
  const { loading, nfts } = useSelector(selectAssetsNFTList);

  const { selectedAddress } = useContext(AssetsContext);

  const showNFTAssets = useMemo(() => !loading && nfts.length > 0, [loading, nfts]);

  useEffect(() => {
    if (isAddress(selectedAddress?.address)) {
      dispatch(getAssetsNFTList({ ...filters.filter }, selectedAddress.address));
    }
  }, [filters.filter, selectedAddress.identifier]);

  const smallScreen = useMediaQuery(theme.breakpoints.down(400));

  if (!showNFTAssets) return null;

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} display="flex" px={4} py={3} justifyContent="space-between">
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '22px',
              color: (theme as any).palette.terciary[700],
            }}
          >
            {t('NFT Assets')}
          </Typography>
          <Box display="flex" alignItems="flex-start" width="auto">
            {!smallScreen ? <FilterNFTPagination tableId={tableId} /> : null}
          </Box>
        </Grid>
        {smallScreen ? <FilterNFTPagination tableId={tableId} /> : null}
        <Grid item xs={12} display="flex" px={4}>
          <NFTAssetsTable assets={nfts} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default NFTAssets;
