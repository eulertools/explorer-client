import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@material-ui/core';
import { GridAlignment, GridCellParams, GridColDef, GridColumns } from '@material-ui/data-grid';
import { IconCopyToClipboard } from 'src/components/IconCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { TokenDetailFlatDTO } from 'src/types/token';
import { EulerPair } from 'src/ui/EulerPair';
import { EulerToken } from 'src/ui/EulerToken';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerCellQuantity } from 'src/ui/eulerTable/EulerCellQuantity';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { favoriteColumn } from 'src/ui/eulerTable/favoriteColumn';
import { portfolioColumn } from 'src/ui/eulerTable/portfolioColumn';
import { shortAddress } from 'src/utils/stringUtils';
import { EulerLink } from '../EulerLink';

export const favColumn: GridColDef = favoriteColumn({
  type: EPortfolioItemType.TOKEN,
  idKey: 'address',
});
export const portColumn: GridColDef = portfolioColumn({
  type: EPortfolioItemType.TOKEN,
  idKey: 'address',
  nameKeys: ['name', 'symbol'],
});

export const columns: GridColumns = [
  {
    align: 'left',
    field: 'name',
    headerName: 'Name',
    headerAlign: 'left',
    flex: 1.5,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const { t } = useTranslation();
      const {
        found,
        base_token_address,
        quote_token_address,
        base_token_name,
        quote_token_name,
        name,
        address,
        symbol,
      } = params.row as TokenDetailFlatDTO;
      if (found && base_token_address)
        return (
          <Box display="flex" pl={2} overflow="hidden" textOverflow="ellipsis">
            <EulerPair
              baseTokenAddress={base_token_address}
              quoteTokenAddress={quote_token_address}
              baseTokenName={base_token_name}
              quoteTokenName={quote_token_name}
            />
            <Typography fontSize={13} ml={1}>
              {symbol}
            </Typography>
          </Box>
        );
      if (found && name)
        return (
          <Box display="flex" pl={2} overflow="hidden" textOverflow="ellipsis">
            <EulerToken address={address} name={name} />
            <Typography fontSize={13} ml={1}>
              {symbol}
            </Typography>
          </Box>
        );
      return (
        <Box display="grid" gridTemplateColumns="auto" pl={2}>
          {t('Unknown')}
        </Box>
      );
    },
  },
  {
    align: 'left',
    field: 'address',
    headerName: 'Address',
    headerAlign: 'left',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params: GridCellParams) => {
      const { found, base_token_address, _id, name, address } = params.row as TokenDetailFlatDTO;
      const { settings } = useSettings();
      if (found && base_token_address)
        return (
          <Box fontWeight={500} fontSize={13}>
            <EulerLink href={`/${settings.network}/pair/${address}`}>{shortAddress(address)}</EulerLink>
            <IconCopyToClipboard text={address} />
          </Box>
        );
      if (found && name)
        return (
          <Box fontWeight={500} fontSize={13}>
            <EulerLink href={`/${settings.network}/address/${address}`}>{shortAddress(address)}</EulerLink>
            <IconCopyToClipboard text={address} />
          </Box>
        );
      return (
        <Box fontWeight={500} fontSize={13}>
          <EulerLink href={`/${settings.network}/address/${_id}`}>{_id}</EulerLink>
          <IconCopyToClipboard text={_id} />
        </Box>
      );
    },
  },
  {
    align: 'right' as GridAlignment,
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1,
    headerAlign: 'right',
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params) => <EulerCellQuantity {...params} customFontWeight={500} />,
  },
  {
    align: 'right' as GridAlignment,
    field: 'valueBNB',
    headerName: 'Value BNB',
    headerAlign: 'right',
    flex: 1,
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params) => (
      <EulerCellPrice {...params} currency="BNB" currencyPosition="right" customFontWeight={500} />
    ),
  },
  {
    align: 'right' as GridAlignment,
    field: 'value',
    headerName: 'Value USD',
    flex: 1,
    headerAlign: 'right',
    renderHeader: (params) => <EulerRenderHeader {...params} headerClassName="customHeader" />,
    renderCell: (params) => <EulerCellPrice {...params} customFontWeight={500} />,
  },
];
