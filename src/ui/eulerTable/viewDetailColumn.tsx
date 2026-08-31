import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { GridAlignment, GridCellParams, GridColDef } from '@material-ui/data-grid';
import Visibility from '@material-ui/icons/Visibility';

interface ViewDetailColumnConfig extends Partial<GridColDef> {
  handleClick: (params: GridCellParams) => void;
}

export const viewDetailColumn = ({ handleClick, ...config }: ViewDetailColumnConfig): GridColDef => ({
  field: 'address',
  width: 36,
  align: 'center' as GridAlignment,
  sortable: false,
  ...config,
  renderHeader: () => <></>,
  renderCell: (params: GridCellParams) => {
    const { t } = useTranslation();
    const click = React.useCallback(() => handleClick(params), [params]);
    return (
      <Tooltip title={t('View Details')}>
        <IconButton onClick={click} aria-label={t('View Details')}>
          <Visibility />
        </IconButton>
      </Tooltip>
    );
  },
});
