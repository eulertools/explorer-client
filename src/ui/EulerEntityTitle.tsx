import { ExtendedTheme } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import { FC, ReactNode } from 'react';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';
import { ButtonPortfolio } from 'src/ui/ButtonPortfolio';
import EulerAddTokenToWallet from 'src/ui/EulerAddTokenToWallet';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& > hr': {
        margin: `0 ${theme.spacing(1)}`,
      },
      '& > hr:nth-of-type(1)': {
        marginRight: theme.spacing(1),
      },
      '& > hr:nth-last-of-type(1)': {
        marginRight: 0,
      },
      '& > button': {
        padding: theme.spacing(1),
      },
    },
    addressContainer: {
      marginTop: '2px',
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 16%)',
      },
    },
    extra: {
      color: ((theme as unknown) as ExtendedTheme).palette.terciary[600],
      fontWeight: 600,
    },
  }),
);

interface IEulerEntityTitleProps {
  title: string;
  extra?: string;
  address?: string;
  logo?: ReactNode;
  favoriteId?: string;
  portfolioId?: string;
  portfolioName?: string;
  showButtons?: boolean;
  portfolioEntity?: EPortfolioItemType;
  layout?: 'center' | 'flex-start';
  symbol?: string;
  truncateAddress?: boolean;
  showAddToken?: boolean;
  decimals?: number;
}

export const EulerEntityTitle: FC<IEulerEntityTitleProps> = ({
  title,
  extra,
  address,
  logo,
  favoriteId,
  portfolioId,
  portfolioName,
  showButtons,
  portfolioEntity,
  layout,
  symbol,
  truncateAddress,
  showAddToken,
  decimals,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { account } = useWeb3React();
  const { network } = useParams();

  const currentNetwork = network ? settingsSupportedNetworks.find((n) => n.value === network).value : null;

  return (
    <Grid container>
      <Grid
        className={classes.container}
        item
        xs={12}
        display="flex"
        justifyContent={layout || undefined}
        alignItems="center"
      >
        {logo || null}
        <Typography ml={1} mb={1} fontSize={14} color="terciary.600" fontWeight={600} display="inline-block">
          {title} {extra ? <span className={classes.extra}>{extra}</span> : null}
        </Typography>
        {address ? (
          <>
            <Divider variant="fullWidth" orientation="vertical" flexItem />
            <Box className={classes.addressContainer}>
              <EulerAddress
                address={address}
                addressRender={
                  truncateAddress ? EulerAddressRenderTypes.truncate_center : EulerAddressRenderTypes.truncate_right
                }
                showSeeDetailLink={false}
                hashColor={theme.palette.text.primary}
                hashIconColor={theme.palette.primary.main}
              />
            </Box>
          </>
        ) : null}
        {showButtons ? (
          <>
            <Divider variant="fullWidth" orientation="vertical" flexItem />
            <ButtonFavorite
              idFavorite={favoriteId}
              addFavoriteItem={{
                address,
                symbol,
                name: favoriteId,
                type: portfolioEntity,
                network: currentNetwork || ESupportedNetworks.BNB,
              }}
            />
            <ButtonPortfolio
              item={{
                identifier: portfolioId,
                name: portfolioName,
                type: portfolioEntity,
                network: currentNetwork || ESupportedNetworks.BNB,
              }}
            />
          </>
        ) : null}
        {showAddToken && account ? (
          <EulerAddTokenToWallet address={address} symbol={symbol} decimals={decimals} />
        ) : null}
      </Grid>
    </Grid>
  );
};
