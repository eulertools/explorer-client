import React from 'react';
import { Box } from '@material-ui/core';
import { GridAlignment, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { shortAddress } from 'src/utils/stringUtils';
import { EulerAddressTypes } from '../EulerAddress';
import { EulerLink } from '../EulerLink';

interface TxnsColumnConfig extends Partial<GridColDef> {
  type: EulerAddressTypes;
  field: string;
  headerName: string;
}

export const txnsColumn = ({ type, field, headerName, ...config }: TxnsColumnConfig): GridColDef => ({
  width: 240,
  headerAlign: 'left' as GridAlignment,
  field,
  headerName,
  align: 'left' as GridAlignment,
  ...config,
  renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
  renderCell: (params: GridCellParams) => {
    const { settings } = useSettings();
    return (
      <Box pl={2}>
        <EulerLink href={`/${settings.network}/address/${params.value as string}`}>
          {shortAddress(params.value as string)}
        </EulerLink>
        <IconCopyToClipboard text={params.value as string} />
      </Box>
    );
  },
});
