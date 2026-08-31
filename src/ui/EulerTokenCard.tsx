import { useWeb3React } from '@web3-react/core';
import { FC, useContext } from 'react';
import { useParams } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { useIntl } from 'src/hooks/useIntl';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import TokenSocialMedia from 'src/pages/tokens/components/TokenSocialMedia';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import { ISource } from 'src/types/search';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';
import EulerAddTokenToWallet from 'src/ui/EulerAddTokenToWallet';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { getAvatarSrc } from 'src/utils/avatar';
import { shortString } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainCard: {
    width: '100%',
  },
  cardContentRoot: {
    paddingBottom: theme.spacing(2),
  },
  socialButtonsGrid: {
    '& > div': {
      justifyContent: 'flex-start',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(700)]: {
      justifyContent: 'center',
    },
  },
  addressContainer: {
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    '&> div:first-of-type': {
      paddingTop: theme.spacing(1),
    },
    [theme.breakpoints.down(700)]: {
      marginTop: 0,
      justifyContent: 'center',
    },
  },
}));

interface IEulerTokenCardProps {
  token: ISource;
}

export const EulerTokenCard: FC<IEulerTokenCardProps> = ({ token }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { account } = useWeb3React();
  const { network } = useParams();
  const intl = useIntl();
  const { chain } = useContext(ConfigurationContext);

  const currentNetwork = network ? settingsSupportedNetworks.find((n) => n.value === network).value : null;

  const isMobilePrice = useMediaQuery(theme.breakpoints.between(1280, 1700));
  const isSmallPrice = useMediaQuery(theme.breakpoints.up(900));
  const isMobileButtons = useMediaQuery(theme.breakpoints.down(700));

  return (
    <Card className={classes.mainCard}>
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Grid container spacing={2}>
          <Grid item pl={1} pt={2} display="flex" flexDirection="row" flexGrow={1}>
            <Grid item xs={12}>
              <Grid className={classes.titleContainer}>
                <Grid display="flex" flexDirection="row">
                  <Box pr={1} display="flex" alignItems="center">
                    <Avatar alt={token.name} src={getAvatarSrc(token.address)} />
                  </Box>
                  <Typography mb={0} mr={2} variant="h5" color="textPrimary" display="flex" alignItems="center">
                    {token ? shortString(token?.name, 22) : ''}
                  </Typography>
                  {!isMobileButtons ? (
                    <>
                      <Divider variant="middle" orientation="vertical" flexItem />
                      <Typography
                        mb={0}
                        ml={2}
                        mr={2}
                        variant="h5"
                        color="textPrimary"
                        display="flex"
                        alignItems="center"
                      >
                        {token ? shortString(token?.symbol.toUpperCase(), 15) : ''}
                      </Typography>
                      <Divider variant="middle" orientation="vertical" flexItem />
                      <ButtonFavorite
                        idFavorite={token.name}
                        addFavoriteItem={{
                          address: token.address,
                          symbol: token.symbol,
                          name: token.name,
                          type: EPortfolioItemType.TOKEN,
                          network: currentNetwork || ESupportedNetworks.BNB,
                        }}
                      />
                      {account ? (
                        <EulerAddTokenToWallet
                          address={token.address}
                          symbol={token.symbol}
                          decimals={token.decimals || 18}
                        />
                      ) : null}
                    </>
                  ) : null}
                </Grid>
                {!isMobilePrice && isSmallPrice ? (
                  <Grid>
                    <Typography ml={2} mb={0} fontSize={22} variant="h5" color="textPrimary" display="flex">
                      {`${intl.formatNumber(+token.price_usd, { maximumFractionDigits: 7 })} ${
                        chain.bsc.tokens.stable.symbol
                      }`}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
              {isMobileButtons ? (
                <Grid display="flex" flexDirection="row" justifyContent="center">
                  <Typography mb={0} ml={2} mr={2} variant="h5" color="textPrimary" display="flex" alignItems="center">
                    {token ? shortString(token?.symbol.toUpperCase(), 15) : ''}
                  </Typography>
                  <Divider variant="middle" orientation="vertical" flexItem />
                  <ButtonFavorite
                    idFavorite={token.name}
                    addFavoriteItem={{
                      address: token.address,
                      symbol: token.symbol,
                      name: token.name,
                      type: EPortfolioItemType.TOKEN,
                      network: currentNetwork || ESupportedNetworks.BNB,
                    }}
                  />
                  {account ? (
                    <EulerAddTokenToWallet
                      address={token.address}
                      symbol={token.symbol}
                      decimals={token.decimals || 18}
                    />
                  ) : null}
                </Grid>
              ) : null}
              <Grid pl={1} display="flex" flexDirection="row" className={classes.addressContainer}>
                <EulerAddress
                  address={token.address}
                  addressRender={EulerAddressRenderTypes.truncate_right}
                  showSeeDetailLink={false}
                  hashColor={theme.palette.text.primary}
                  hashIconColor={theme.palette.primary.main}
                />
                <Box ml={1} className={classes.socialButtonsGrid}>
                  <TokenSocialMedia token={token} isMobile />
                </Box>
              </Grid>
              {isMobilePrice || !isSmallPrice ? (
                <Grid display="flex" justifyContent="center">
                  <Typography ml={2} mb={0} fontSize={22} variant="h5" color="textPrimary" display="inline-block">
                    {`${intl.formatNumber(+token.price_usd, { minimumFractionDigits: 7 })} ${
                      chain.bsc.tokens.stable.symbol
                    }`}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
