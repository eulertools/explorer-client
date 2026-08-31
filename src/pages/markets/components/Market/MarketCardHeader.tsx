import { EulerIconStar1 } from '@eulertools/ui';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { FC, useMemo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import LinearProgress, { linearProgressClasses } from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useIntl } from 'src/hooks/useIntl';
import { MarketAddress } from 'src/pages/markets/components/Market/MarketAddress';
import { EPortfolioItemType } from 'src/pages/portfolios/components/portfolioDetails/types';
import { ESupportedNetworks } from 'src/types/blockchain';
import { IMarketSource } from 'src/types/market';
import { ButtonFavorite } from 'src/ui/ButtonFavorite';
import EulerAddTokenToWallet from 'src/ui/EulerAddTokenToWallet';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { shortString } from 'src/utils/stringUtils';

interface IMarketCardHeaderProps {
  market: IMarketSource;
}

export const MarketCardHeader: FC<IMarketCardHeaderProps> = ({ market }) => {
  const theme = useTheme();
  const { account } = useWeb3React();
  const intl = useIntl();

  const mediumScreen = useMediaQuery(theme.breakpoints.down(1670));
  const mobileScreen = useMediaQuery(theme.breakpoints.down(1200));
  const smallScreen = useMediaQuery(theme.breakpoints.down(550));

  const linearProgressPercentage = useMemo(
    () =>
      new BigNumber(new BigNumber(market?.price_usd?.cg).minus(market?.low_24h?.cg))
        .dividedBy(new BigNumber(market?.high_24h?.cg).minus(market?.low_24h?.cg))
        .multipliedBy(100)
        .toNumber(),
    [market?.price_usd?.cg, market?.high_24h?.cg, market?.low_24h?.cg],
  );

  const marketCapVariationPercentage = useMemo(
    () =>
      new BigNumber(market?.market_cap_change_24h?.cg)
        .multipliedBy(100)
        .dividedBy(market?.market_cap?.cg)
        .absoluteValue(),
    [market?.market_cap_change_24h?.cg, market?.market_cap?.cg],
  );

  const marketCapVariationValue = useMemo(
    () => new BigNumber(market?.market_cap?.cg).minus(market?.market_cap_change_24h?.cg).toNumber(),
    [market?.market_cap?.cg, market?.market_cap_change_24h?.cg],
  );

  const marketCapVariationLabel = marketCapVariationValue
    ? `${intl.formatNumber(marketCapVariationPercentage.toNumber(), {
        notation: 'compact',
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 3,
      })}% (${intl.formatNumber(marketCapVariationValue, {
        notation: 'compact',
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 3,
      })})`
    : 'N/A';

  return (
    <Card sx={{ width: '100%', boxShadow: 'none' }}>
      <CardContent sx={{ padding: `${theme.spacing(3)} !important` }}>
        <Grid
          container
          spacing={4}
          sx={{
            display: 'flex',
            justifyContent: mobileScreen ? 'center' : 'space-between',
          }}
        >
          <Grid
            item
            xs={mobileScreen ? 12 : null}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(1),
              flex: 1,
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: mobileScreen ? 'center' : 'flex-start',
                gap: theme.spacing(1),
              }}
            >
              <Grid display="flex">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& > div': {
                      width: '35px',
                      height: '35px',
                    },
                  }}
                >
                  <Avatar alt={market.name} src={market.image.cg.small} />
                </Box>
                <Tooltip title={market?.name}>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: `0px ${theme.spacing(1)}`,
                      color: (theme as any).palette.terciary[700],
                      fontSize: '28px',
                      fontWeight: 600,
                      lineHeight: '32px',
                    }}
                  >
                    {market ? shortString(market?.name, 18) : ''}
                  </Typography>
                </Tooltip>
                {!mediumScreen ? (
                  <>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0px',
                        color: (theme as any).palette.terciary[700],
                        fontSize: '28px',
                        fontWeight: 400,
                        lineHeight: '32px',
                      }}
                    >
                      {market ? shortString(market?.symbol.toUpperCase(), 15) : ''}
                    </Typography>
                    <ButtonFavorite
                      idFavorite={market.name}
                      addFavoriteItem={{
                        address: market?.networks?.bnb?.address,
                        symbol: market?.symbol,
                        name: market?.name,
                        type: EPortfolioItemType.TOKEN,
                        network: ESupportedNetworks.BNB,
                      }}
                      favoriteIcon={<EulerIconStar1 size="m" />}
                      favoriteIconStarred={
                        <Box
                          sx={{
                            width: '24px',
                            height: '24px',
                            '& > svg > path': {
                              fill: '#ffc12b',
                              fillRule: 'inherit',
                            },
                          }}
                        >
                          <EulerIconStar1 size="m" />
                        </Box>
                      }
                    />
                  </>
                ) : null}
                {account ? (
                  <EulerAddTokenToWallet
                    address={market?.networks?.bnb?.address}
                    symbol={market?.symbol}
                    decimals={18}
                  />
                ) : null}
              </Grid>
              {mediumScreen ? (
                <Grid item display="flex">
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: '0px',
                      color: (theme as any).palette.terciary[700],
                      fontSize: '28px',
                      fontWeight: 400,
                      lineHeight: '32px',
                    }}
                  >
                    {market ? shortString(market?.symbol.toUpperCase(), 15) : ''}
                  </Typography>
                  <ButtonFavorite
                    idFavorite={market.name}
                    addFavoriteItem={{
                      address: market?.networks?.bnb?.address,
                      symbol: market?.symbol,
                      name: market?.name,
                      type: EPortfolioItemType.TOKEN,
                      network: ESupportedNetworks.BNB,
                    }}
                    favoriteIcon={<EulerIconStar1 size="m" />}
                    favoriteIconStarred={
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          '& > svg > path': {
                            fill: '#ffc12b',
                            fillRule: 'inherit',
                          },
                        }}
                      >
                        <EulerIconStar1 size="m" />
                      </Box>
                    }
                  />
                </Grid>
              ) : null}
              {market?.networks?.bnb?.address ? (
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  width={smallScreen ? '100%' : 'inherit'}
                  overflow={smallScreen ? 'hidden' : 'auto'}
                >
                  <MarketAddress address={market?.networks?.bnb?.address} />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid
            item
            xs={mobileScreen ? 12 : null}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme.spacing(3),
              paddingLeft: '8px !important',
              [theme.breakpoints.up(1560)]: {
                width: '100%',
                maxWidth: '500px',
              },
              [theme.breakpoints.between(1200, 1560)]: {
                flex: 2,
              },
              [theme.breakpoints.down(1200)]: {
                justifyContent: 'center',
                paddingLeft: '32px !important',
              },
            }}
          >
            {!mobileScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  width: '1px',
                  height: '54px',
                  color: (theme as any).palette.terciary[100],
                  paddingLeft: theme.spacing(1),
                }}
              />
            ) : null}
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'column',
                flexGrow: 1,
                gap: theme.spacing(2),
                [theme.breakpoints.down(1200)]: {
                  maxWidth: '350px',
                },
              }}
            >
              <Grid display="flex" flexDirection="row" gap={2} width="100%">
                <Typography
                  sx={{
                    display: 'flex',
                    fontSize: '28px',
                    fontWeight: 600,
                    lineHeight: '32px',
                    color: (theme as any).palette.terciary[700],
                  }}
                >
                  {`$ ${getBigNumberCurrencyLabel(market?.price_usd?.cg)}`}
                </Typography>
                <Chip
                  label={market?.price_change_percentage_24h?.cg ? `${market.price_change_percentage_24h.cg}%` : 'N/A'}
                  sx={{
                    color:
                      market?.price_change_percentage_24h?.cg >= 0
                        ? (theme as any).palette.success[800]
                        : (theme as any).palette.error[800],
                    backgroundColor:
                      market?.price_change_percentage_24h?.cg >= 0
                        ? (theme as any).palette.success[300]
                        : (theme as any).palette.error[300],
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '17px',
                    padding: `4px ${theme.spacing(1)}`,
                    borderRadius: '9px',
                    '& > span': {
                      padding: '0px',
                    },
                  }}
                />
              </Grid>
              <Grid display="flex" flexDirection="row" gap={2} width="100%">
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={linearProgressPercentage}
                  sx={{
                    width: '100%',
                    height: '4px',
                    borderRadius: theme.spacing(1),
                    [`&.${linearProgressClasses.colorPrimary}`]: {
                      backgroundColor: (theme as any).palette.neutral[100],
                    },
                    [`& .${linearProgressClasses.bar}`]: {
                      background: 'linear-gradient(270deg, #7DE0BB 0%, #4867F5 100%) !important',
                    },
                  }}
                />
              </Grid>
              <Grid display="flex" flexDirection="row" justifyContent="space-between" gap={2} width="100%">
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[700],
                  }}
                >
                  {getBigNumberCurrencyLabel(market?.low_24h?.cg)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[300],
                  }}
                >
                  24h range
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[700],
                  }}
                >
                  {getBigNumberCurrencyLabel(market?.high_24h?.cg)}
                </Typography>
              </Grid>
            </Grid>
            {!mobileScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  width: '1px',
                  height: '54px',
                  color: (theme as any).palette.terciary[100],
                }}
              />
            ) : null}
          </Grid>
          <Grid
            item
            xs={mobileScreen ? 12 : null}
            sx={{
              display: 'flex',
              flexDirection: smallScreen ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: smallScreen ? 'center' : 'flex-start',
              gap: theme.spacing(2),
              paddingLeft: '8px !important',
              [theme.breakpoints.between(1200, 1560)]: {
                flex: 0,
              },
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'column',
                paddingLeft: theme.spacing(1),
                gap: theme.spacing(2),
                [theme.breakpoints.down(700)]: {
                  justifyContent: 'center',
                },
              }}
            >
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[500],
                    textAlign: 'center',
                  }}
                >
                  Market Cap
                </Typography>
              </Grid>
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Tooltip
                  title={market?.market_cap?.cg ? `$ ${getBigNumberCurrencyLabel(market.market_cap.cg)}` : 'N/A'}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      lineHeight: '17px',
                      color: (theme as any).palette.terciary[700],
                      textAlign: 'center',
                    }}
                  >
                    {market?.market_cap?.cg
                      ? `$ ${intl.formatNumber(market.market_cap.cg, {
                          notation: 'compact',
                          minimumSignificantDigits: 3,
                          maximumSignificantDigits: 3,
                        })}`
                      : 'N/A'}
                  </Typography>
                </Tooltip>
              </Grid>
              {+marketCapVariationValue ? (
                <Grid display="flex" flexDirection="row" justifyContent="center" gap={2} width="100%">
                  <Tooltip title={getBigNumberCurrencyLabel(marketCapVariationValue)}>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 500,
                        lineHeight: '15px',
                        color:
                          market?.market_cap_change_24h?.cg < 0
                            ? (theme as any).palette.error[800]
                            : (theme as any).palette.success[800],
                      }}
                    >
                      {marketCapVariationLabel}
                    </Typography>
                  </Tooltip>
                </Grid>
              ) : null}
            </Grid>
            {!smallScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  width: '1px',
                  height: '54px',
                  color: (theme as any).palette.terciary[100],
                }}
              />
            ) : null}
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'column',
                paddingLeft: theme.spacing(1),
                gap: theme.spacing(2),
                [theme.breakpoints.down(700)]: {
                  justifyContent: 'center',
                },
              }}
            >
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[500],
                    textAlign: 'center',
                  }}
                >
                  Volume (24h)
                </Typography>
              </Grid>
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Tooltip
                  title={market?.volumen_24h?.cg ? `$ ${getBigNumberCurrencyLabel(market?.volumen_24h?.cg)}` : 'N/A'}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      lineHeight: '17px',
                      color: (theme as any).palette.terciary[700],
                      textAlign: 'center',
                    }}
                  >
                    {market?.volumen_24h?.cg
                      ? `$ ${intl.formatNumber(market.volumen_24h.cg, {
                          notation: 'compact',
                          minimumSignificantDigits: 3,
                          maximumSignificantDigits: 3,
                        })}`
                      : 'N/A'}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
            {!smallScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  width: '1px',
                  height: '54px',
                  color: (theme as any).palette.terciary[100],
                }}
              />
            ) : null}
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'column',
                paddingLeft: theme.spacing(1),
                gap: theme.spacing(2),
                [theme.breakpoints.down(700)]: {
                  justifyContent: 'center',
                },
              }}
            >
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '15px',
                    color: (theme as any).palette.terciary[500],
                    textAlign: 'center',
                  }}
                >
                  Circulating Supply
                </Typography>
              </Grid>
              <Grid display="flex" flexDirection="row" gap={2} width="100%" justifyContent="center">
                <Tooltip
                  title={
                    market?.circulating_supply?.cg || market?.circulating_supply?.cmc
                      ? `$ ${getBigNumberCurrencyLabel(
                          market?.circulating_supply?.cg || market?.circulating_supply?.cmc,
                        )}`
                      : 'N/A'
                  }
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      lineHeight: '17px',
                      color: (theme as any).palette.terciary[700],
                    }}
                  >
                    {market?.circulating_supply?.cg || market?.circulating_supply?.cmc
                      ? `$ ${intl.formatNumber(market?.circulating_supply?.cg || market?.circulating_supply?.cmc, {
                          notation: 'compact',
                          minimumSignificantDigits: 3,
                          maximumSignificantDigits: 3,
                        })}`
                      : 'N/A'}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
