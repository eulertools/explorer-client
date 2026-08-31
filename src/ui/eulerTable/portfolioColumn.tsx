import _get from 'lodash/get';
import { GridAlignment, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import { ButtonPortfolio } from 'src/ui/ButtonPortfolio';

interface PortfolioColumnConfig extends Partial<GridColDef> {
  type: EPortfolioItemType;
  idKey: string;
  nameKeys: string | string[];
  network?: string;
}

export const portfolioColumn = ({ type, idKey, nameKeys, network, ...config }: PortfolioColumnConfig): GridColDef => ({
  field: 'portfolios',
  width: 24,
  align: 'center' as GridAlignment,
  sortable: false,
  ...config,
  renderHeader: () => <></>,
  renderCell: (params: GridCellParams) => {
    const identifier = _get(params.row, idKey);
    const currentNetwork = network ? settingsSupportedNetworks.find((n) => n.value === network).value : null;
    let name;
    if (Array.isArray(nameKeys)) {
      nameKeys.forEach((e) => {
        const candidate = _get(params.row, e);
        if (!name && candidate) name = candidate;
      });
    } else name = _get(params.row, nameKeys);

    return (
      <ButtonPortfolio
        item={{
          identifier,
          name,
          type,
          network: currentNetwork || ESupportedNetworks.BNB,
        }}
      />
    );
  },
});
