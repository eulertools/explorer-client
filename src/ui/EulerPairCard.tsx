import { FC } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TokenPairAvatars, { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import { useIntl } from 'src/hooks/useIntl';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { ESupportedNetworks, settingsSupportedNetworks } from 'src/types/blockchain';
import { IPairSource } from 'src/types/pair';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';
import { ButtonPortfolio } from 'src/ui/ButtonPortfolio';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { shortString } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  mainCard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContentRoot: {
    paddingBottom: theme.spacing(2),
    height: 'inherit',
    width: 'inherit',
  },
  titleContainer: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  addressContainer: {
    marginTop: '2px',
    display: 'flex',
    alignItems: 'baseline',
  },
  tokenContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  tokenGrids: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginLeft: '1px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      marginLeft: 0,
    },
  },
  tokenLinks: {
    cursor: 'pointer',
  },
}));

interface IEulerPairCardProps {
  pair: IPairSource;
}

export const EulerPairCard: FC<IEulerPairCardProps> = ({ pair }) => {
  const classes = useStyles();
  const theme = useTheme();
  const intl = useIntl();
  const { network } = useParams();
  const navigate = useNavigate();

  const handleNavigation = (address: string) => {
    navigate(`/${network}/token/${address}`);
  };

  const currentNetwork = network ? settingsSupportedNetworks.find((n) => n.value === network).value : null;

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Card className={classes.mainCard}>
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Grid container spacing={2}>
          <Grid item pl={1} pt={2} display="flex" flexDirection="row" flexGrow={1}>
            <Grid item xs={12}>
              <Grid className={classes.titleContainer} pl={1} display="flex" alignItems="center">
                <Box pr={1}>
                  <TokenPairAvatars
                    baseTokenAddress={pair?.base_token_address}
                    quoteTokenAddress={pair?.quote_token_address}
                  />
                </Box>
                <Typography mb={0} variant="h5" color="textPrimary" display="inline-block">
                  {pair ? shortString(pair.symbol?.replace('-', '/'), 22) : ''}
                </Typography>
                <Grid ml={1} display="flex" flexDirection="row">
                  <Divider variant="middle" orientation="vertical" flexItem />
                  <ButtonFavorite
                    idFavorite={pair?.identifier}
                    addFavoriteItem={{
                      address: pair?.address,
                      name: pair?.identifier,
                      type: EPortfolioItemType.PAIR,
                      network: currentNetwork || ESupportedNetworks.BNB,
                    }}
                  />
                  <ButtonPortfolio
                    item={{
                      identifier: pair?.address,
                      name: pair?.name,
                      type: EPortfolioItemType.PAIR,
                      network: currentNetwork || ESupportedNetworks.BNB,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid pl={1} display="flex" flexDirection="column" className={classes.addressContainer}>
                <EulerAddress
                  address={pair?.address}
                  addressRender={
                    isMobile ? EulerAddressRenderTypes.truncate_center : EulerAddressRenderTypes.truncate_right
                  }
                  showSeeDetailLink={false}
                  hashColor={theme.palette.text.primary}
                  hashIconColor={theme.palette.primary.main}
                />
              </Grid>
              <Grid className={classes.tokenContainer} container mt={1} mb={2} spacing={1} gap={1}>
                <Grid className={classes.tokenGrids} item>
                  <Box
                    className={classes.tokenLinks}
                    display="flex"
                    alignItems="center"
                    onClick={() => handleNavigation(pair?.base_token_address)}
                  >
                    <AvatarThumbnail address={pair?.base_token_address} />
                    <Typography variant="h6" color="primary" marginLeft={1}>
                      {shortString(pair?.base_token_symbol, 15)} :{' '}
                      {intl.formatNumber(pair?.base_token_price, { minimumFractionDigits: 7 })}{' '}
                      {shortString(pair?.quote_token_symbol, 15)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid className={classes.tokenGrids} item>
                  <Box
                    className={classes.tokenLinks}
                    display="flex"
                    alignItems="center"
                    onClick={() => handleNavigation(pair?.quote_token_address)}
                  >
                    <AvatarThumbnail address={pair?.quote_token_address} />
                    <Typography variant="h6" color="primary" marginLeft={1}>
                      {shortString(pair?.quote_token_symbol, 15)} :{' '}
                      {intl.formatNumber(pair?.quote_token_price, {
                        maximumFractionDigits: 7,
                      })}{' '}
                      {shortString(pair?.base_token_symbol, 15)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
