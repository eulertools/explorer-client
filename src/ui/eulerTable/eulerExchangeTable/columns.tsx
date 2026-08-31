import BigNumber from 'bignumber.js';
import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { GridAlignment, GridCellParams } from '@material-ui/data-grid';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useSettings from 'src/hooks/useSettings';
import { ITokenExchangeDataSource } from 'src/slices/entities/token-exchange';
import { toggleExchangesDisplayAge } from 'src/slices/tables/exchanges';
import { EulerPair } from 'src/ui/EulerPair';
import { EulerCellPrice } from 'src/ui/eulerTable/EulerCellPrice';
import { EulerCellToggleTime, TimeDisplayType } from 'src/ui/eulerTable/EulerCellToggleTime';
import { EulerHeaderToggleTime } from 'src/ui/eulerTable/EulerHeaderToggle';
import { EulerRenderHeader } from 'src/ui/eulerTable/EulerRenderHeader';
import { getExchangeInfoFromOwner } from 'src/utils/exchanges';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
  },
}));

export const columnsCommonExchanges = ({ displayAge, eulerView }) => [
  {
    headerName: 'Exchange',
    field: '_source.owner',
    sortable: false,
    headerAlign: 'left' as GridAlignment,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      const { externalLinks } = useContext(ConfigurationContext);
      const { owner, base_token_address: baseAddress, quote_token_address: quoteAddress } = params.row?._source;

      const { label, link, avatarSrc } = getExchangeInfoFromOwner(owner, baseAddress, quoteAddress, externalLinks);

      return (
        <MuiLink color="textPrimary" href={link} target="_blank" className={classes.link}>
          <AvatarThumbnail alt={owner[0].toUpperCase()} src={avatarSrc} />
          <Typography paddingLeft={1} variant="body2">
            {label}
          </Typography>
        </MuiLink>
      );
    },
    flex: 1.5,
  },
  {
    headerName: 'Pair',
    field: '_source.symbol',
    sortable: false,
    headerAlign: 'left' as GridAlignment,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const classes = useStyles();
      const location = useLocation();
      const { settings } = useSettings();

      // Only show Pair Links if we are in the same Network for Euler Page (BSC)
      if (eulerView && settings.network === 'bsc') {
        return (
          <Link to={`/${settings.network}/pair/${params.row._source.address}`} className={classes.link}>
            <EulerPair
              baseTokenAddress={params.row._source.base_token_address}
              quoteTokenAddress={params.row._source.quote_token_address}
              baseTokenName={params.row._source.base_token_name}
              quoteTokenName={params.row._source.quote_token_name}
              eulerView={eulerView}
            />
          </Link>
        );
      }

      if (eulerView) {
        return (
          <EulerPair
            baseTokenAddress={params.row._source.base_token_address}
            quoteTokenAddress={params.row._source.quote_token_address}
            baseTokenName={params.row._source.base_token_name}
            quoteTokenName={params.row._source.quote_token_name}
            eulerView={eulerView}
          />
        );
      }

      // Prevent user from clicking same Pair they are already in.
      return location.pathname === `/${settings.network}/pair/${params.row._source.address}` ? (
        <EulerPair
          baseTokenAddress={params.row._source.base_token_address}
          quoteTokenAddress={params.row._source.quote_token_address}
          baseTokenName={params.row._source.base_token_name}
          quoteTokenName={params.row._source.quote_token_name}
        />
      ) : (
        <Link to={`/${settings.network}/pair/${params.row._source.address}`} className={classes.link}>
          <EulerPair
            baseTokenAddress={params.row._source.base_token_address}
            quoteTokenAddress={params.row._source.quote_token_address}
            baseTokenName={params.row._source.base_token_name}
            quoteTokenName={params.row._source.quote_token_name}
          />
        </Link>
      );
    },
    flex: 2,
  },
  {
    headerName: 'Price',
    field: '_source.price',
    type: 'number',
    flex: 2,
    sortable: false,
    renderHeader: EulerRenderHeader,
    renderCell: (params: GridCellParams) => {
      const { base_token_balance, quote_token_balance, symbol, quote_token_name } = params.row
        ._source as ITokenExchangeDataSource;
      const bnPrice = quote_token_balance === 0 ? 0 : new BigNumber(quote_token_balance).dividedBy(base_token_balance);

      return (
        <EulerCellPrice
          currencyPosition="right"
          currency={symbol?.split('/')?.[1] || quote_token_name}
          {...params}
          value={bnPrice}
        />
      );
    },
  },
  {
    align: 'center' as GridAlignment,
    headerAlign: 'left' as GridAlignment,
    field: '_source.readable_update_date',
    headerName: displayAge ? 'Age' : 'Date',
    flex: 1.5,
    sortable: false,
    renderHeader: (params) => {
      const dispatch = useDispatch();
      const toggle = useCallback(() => dispatch(toggleExchangesDisplayAge()), []);
      return <EulerHeaderToggleTime {...params} toggle={toggle} />;
    },
    renderCell: (params) => (
      <EulerCellToggleTime
        key={params.row._id}
        {...params}
        value={params.row._source.readable_update_date}
        displayType={displayAge ? TimeDisplayType.ago : TimeDisplayType.time}
      />
    ),
  },
];
