import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { GridCellParams } from '@material-ui/data-grid';
import { AvatarThumbnail, FarmIcon } from 'src/components/TokenPairAvatars';
import { IFarmsDTO, ITvl, IYieldInfo } from 'src/types/yield';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { getPlatformSrc, getTokenSrc } from 'src/utils/avatar';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

export const farmsTableColumns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.5,
    renderCell: ({ row }: GridCellParams) => {
      const { name, token } = row as IFarmsDTO;

      if (!name && !token) {
        return null;
      }

      return (
        <>
          <FarmIcon farm={token || name} />
          <TruncatedTooltipText
            value={
              <Typography
                variant="body2"
                textOverflow="ellipsis"
                overflow="hidden"
                marginLeft={(token || name).includes('-') ? 0 : 1}
              >
                {name}
              </Typography>
            }
            title={name}
          />
        </>
      );
    },
    sortComparator: (v1, v2) => {
      if (!v1) {
        return -1;
      }

      if (!v2) {
        return 1;
      }

      return (v1 as string).localeCompare(v2);
    },
  },
  {
    field: 'tvl',
    headerName: 'TVL',
    flex: 1,
    type: 'number',
    renderCell: ({ value, ...restProps }: GridCellParams) => {
      const _value = (value as ITvl)?.usd;

      return _value ? <EulerCellPrice value={_value} {...restProps} /> : null;
    },
  },
  {
    field: 'yield',
    headerName: 'Yield',
    flex: 1,
    type: 'number',
    renderCell: ({ value }: GridCellParams) => {
      const _value = (value as IYieldInfo)?.apy;

      if (_value) {
        const bnValue = getBigNumberCurrencyLabel(_value);

        return (
          <TruncatedTooltipText
            value={
              <Typography variant="body2" textOverflow="ellipsis" overflow="hidden">
                {bnValue}%
              </Typography>
            }
            title={`${bnValue}%`}
          />
        );
      }

      return null;
    },
    sortComparator: (v1, v2) => {
      if (!v2?.apy) {
        return 1;
      }

      if (!v1?.apy) {
        return -1;
      }

      return v1.apy - v2.apy;
    },
  },
  {
    field: 'earns',
    headerName: 'Earns',
    flex: 1.5,
    renderCell: (params: GridCellParams) => (
      <Box display="flex">
        {(params.value as string[])?.map((v) => (
          <Box key={v} marginRight={1} display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="textPrimary">
              {v?.toUpperCase()}
            </Typography>
            <AvatarThumbnail alt={v} src={getTokenSrc(v)} size="small" />
          </Box>
        ))}
      </Box>
    ),
    sortComparator: (v1, v2) => {
      if (!v2?.length) {
        return 1;
      }

      if (!v1?.length) {
        return -1;
      }

      return v1[0].localeCompare(v2[0]);
    },
  },
  {
    field: 'provider',
    headerName: 'Platform',
    flex: 1,
    renderCell: (params: GridCellParams) => {
      const value = params.value as string;

      if (value) {
        return (
          <>
            <AvatarThumbnail alt={value} src={getPlatformSrc(value)} />
            <TruncatedTooltipText
              value={
                <Typography paddingLeft={1} variant="body2" textOverflow="ellipsis" overflow="hidden">
                  {value.toUpperCase()}
                </Typography>
              }
              title={value}
            />
          </>
        );
      }

      return null;
    },
  },
  {
    field: '',
    width: 8,
  },
];
