import React from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { ITokenSearchDetails } from 'src/slices/tables/tokens';
import { IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { EulerAddressTypes } from 'src/ui/EulerAddress';
import { addressColumn } from 'src/ui/eulerTable/addressColumn';

const getColumns = (onEditItem: React.Dispatch<React.SetStateAction<Partial<IPortfolioDetailsItem>>>) => [
  {
    field: '_id',
    headerName: 'Token',
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const { _source, identifier, name } = params.row as ITokenSearchDetails;
      const image = _source?.coin?.image?.thumb || _source?.coin?.image?.small;
      const label = _source?.name
        ? `${_source?.name}${_source?.symbol ? ` (${_source?.symbol?.toUpperCase()})` : ''}`
        : _source?.symbol?.toUpperCase();

      return (
        <Box display="flex" alignItems="center">
          <AvatarThumbnail alt={label || name} address={identifier} src={image} />
          <Typography paddingLeft={1} variant="body2">
            {label || name}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'name',
    flex: 1,
    headerName: 'Custom Name',
    renderCell: (params: GridCellParams) => (
      <Tooltip title={params.value}>
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} variant="body2">
          {params.value}
        </Typography>
      </Tooltip>
    ),
  },
  addressColumn({
    field: 'identifier',
    headerName: 'Contract',
    type: EulerAddressTypes.contract,
  }),
  {
    align: 'center' as GridAlignment,
    field: '',
    headerName: '',
    disableClickEventBubbling: true,
    renderCell: (params: GridCellParams) => {
      function onEditClick() {
        onEditItem((params.row as unknown) as IPortfolioDetailsItem);
      }

      return (
        <IconButton color="primary" aria-label="upload picture" component="span" onClick={onEditClick}>
          <EditIcon fontSize="small" />
        </IconButton>
      );
    },
  },
];

export default getColumns;
