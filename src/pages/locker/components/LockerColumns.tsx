import Typography from '@material-ui/core/Typography';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import { LockToken } from 'src/types/locker';
import { ButtonLock } from 'src/ui/ButtonLock';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { EulerToken } from 'src/ui/EulerToken';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerCellQuantity } from 'src/ui/eulerTable/EulerCellQuantity';
import { EulerCellToggleTime, TimeDisplayType } from 'src/ui/eulerTable/EulerCellToggleTime';
import { EulerHeaderToggleTime } from 'src/ui/eulerTable/EulerHeaderToggle';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { isBNBToken } from 'src/utils/marketplace';

export const lockerColumns = ({ displayAge, toggleDisplayAge }) => [
  {
    field: 'buttons',
    sortable: false,
    align: 'center' as GridAlignment,
    width: 30,
    renderHeader: () => <></>,
    renderCell: (params: GridCellParams) => <ButtonLock token={params.row as LockToken} iconButton />,
  },
  {
    align: 'left' as GridAlignment,
    field: 'name',
    headerName: 'Token Name',
    headerAlign: 'left' as GridAlignment,
    flex: 0.8,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const { name, address } = params.row as LockToken;
      return <EulerToken address={address} name={name} />;
    },
  },
  {
    align: 'right' as GridAlignment,
    field: 'address',
    headerName: 'Address',
    headerAlign: 'right' as GridAlignment,
    flex: 1,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const { address } = params.row as LockToken;
      if (isBNBToken(address)) return <Typography>N/A</Typography>;
      return <EulerAddress address={address} addressRender={EulerAddressRenderTypes.truncate_right} />;
    },
  },
  {
    align: 'center' as GridAlignment,
    field: 'symbol',
    headerName: 'Symbol',
    flex: 0.5,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => <TruncatedTooltipText value={params.value} title={String(params.value)} />,
  },
  {
    align: 'center' as GridAlignment,
    field: 'price_usd',
    headerName: 'Price',
    flex: 1,
    headerAlign: 'right' as GridAlignment,
    renderHeader: EulerRenderHeader,
    renderCell: EulerCellPrice,
  },
  {
    align: 'center' as GridAlignment,
    field: 'balance',
    headerName: 'Balance',
    flex: 1,
    headerAlign: 'right' as GridAlignment,
    renderHeader: EulerRenderHeader,
    renderCell: EulerCellQuantity,
  },
  {
    align: 'center' as GridAlignment,
    field: 'total_usd',
    headerName: 'Value in USD',
    headerAlign: 'right' as GridAlignment,
    flex: 1,
    renderHeader: EulerRenderHeader,
    renderCell: (params) => <EulerCellPrice {...params} />,
  },
  {
    align: 'center' as GridAlignment,
    field: 'locked',
    headerName: 'Locked',
    flex: 1,
    headerAlign: 'right' as GridAlignment,
    renderHeader: EulerRenderHeader,
    renderCell: EulerCellQuantity,
  },
  {
    align: 'center' as GridAlignment,
    field: 'deadline',
    headerName: 'Deadline',
    flex: 1,
    renderHeader: (params) => <EulerHeaderToggleTime {...params} toggle={toggleDisplayAge} />,
    renderCell: (params) => {
      if (params.value !== 0) {
        return (
          <EulerCellToggleTime
            {...params}
            value={params.value * 1000}
            displayType={displayAge ? TimeDisplayType.ago : TimeDisplayType.time}
          />
        );
      }
      return <Typography>N/A</Typography>;
    },
  },
];
