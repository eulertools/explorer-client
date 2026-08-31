import _get from 'lodash/get';
import { GridAlignment, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';

interface FavoriteColumnConfig extends Partial<GridColDef> {
  type: EPortfolioItemType;
  idKey: string;
  network?: string;
}

export const favoriteColumn = ({ type, idKey, network, ...config }: FavoriteColumnConfig): GridColDef => ({
  field: 'favorites',
  width: 36,
  align: 'center' as GridAlignment,
  sortable: false,
  ...config,
  renderHeader: () => <></>,
  renderCell: (params: GridCellParams) => {
    const pairIdentifier = _get(params.row, idKey);
    const currentNetwork = network ? settingsSupportedNetworks.find((n) => n.value === network).value : null;
    return (
      <ButtonFavorite
        idFavorite={pairIdentifier}
        addFavoriteItem={{
          name: pairIdentifier,
          address: params.row.address,
          symbol: params.row.symbol,
          network: currentNetwork || ESupportedNetworks.BNB,
          type: EPortfolioItemType.PAIR,
        }}
      />
    );
  },
});
