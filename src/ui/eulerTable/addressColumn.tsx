import React from 'react';
import { GridAlignment, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { isAddress } from 'src/utils/stringUtils';
import { EulerAddress, EulerAddressTypes } from '../EulerAddress';

interface AddressColumnConfig extends Partial<GridColDef> {
  type: EulerAddressTypes;
  field: string;
  headerName: string;
}

export const addressColumn = ({ type, field, headerName, ...config }: AddressColumnConfig): GridColDef => ({
  width: 240,
  headerAlign: 'center' as GridAlignment,
  field,
  headerName,
  align: 'right' as GridAlignment,
  ...config,
  renderCell: (params: GridCellParams) =>
    isAddress(params.value as string) ? (
      <EulerAddress addressType={type} address={params.value as string} showModal />
    ) : (
      <>Not a known BNB address.</>
    ),
});
