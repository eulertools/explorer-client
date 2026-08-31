import { useEulerTheme } from '@eulertools/ui';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import { selectAddressDetail } from 'src/selectors/address';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

const AddressDetailInfo = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const { addressId } = useParams();
  const addressDetail = useSelector(selectAddressDetail);
  const [BUSDBalance, setBUSDBalance] = useState('');
  const [WBNBBalance, setWBNBBalance] = useState('');

  const largeScreen = useMediaQuery(theme.breakpoints.up(1404));
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (addressDetail) {
      const totalBUSD = getBigNumberCurrencyLabel(addressDetail.total);
      const totalWBNB = getBigNumberCurrencyLabel(addressDetail.balance);

      setBUSDBalance(totalBUSD);
      setWBNBBalance(totalWBNB);
    }
  }, [addressDetail]);

  if (!addressDetail) return null;

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid
          container
          color="terciary.700"
          paddingY={theme.spacing(2)}
          sx={{
            display: 'flex',
            justifyContent: smallScreen ? 'start' : 'space-between',
          }}
        >
          <Grid item xs={smallScreen ? 12 : null} display="flex" flexDirection={smallScreen ? 'column' : 'row'}>
            <Box>
              <Typography fontSize={24} fontWeight={600}>
                Address
              </Typography>
              <HashCopyToClipboard value={addressId} color="terciary-700" iconColor="terciary-700">
                <Typography component="span" fontSize={13} fontWeight={500} textOverflow="ellipsis" overflow="hidden">
                  {addressId}
                </Typography>
              </HashCopyToClipboard>
            </Box>
          </Grid>
          <Grid
            item
            xs={smallScreen ? 12 : null}
            display="flex"
            flexDirection={smallScreen ? 'column' : 'row'}
            gap={3}
            mr={2}
            mt={largeScreen ? 0 : 2}
            alignItems={smallScreen ? 'start' : 'center'}
          >
            {largeScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  borderRight: `1px solid ${eulerTheme.palette.terciary[100]}`,
                  marginLeft: theme.spacing(3),
                }}
              />
            ) : null}
            <Grid>
              <Typography fontSize={16} fontWeight={600}>
                {t('Balance')}
              </Typography>
              <Typography fontSize={13} fontWeight={500}>
                {BUSDBalance ? `${BUSDBalance} BUSD` : 'Not Available'}
              </Typography>
            </Grid>
            {!smallScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  borderRight: `1px solid ${eulerTheme.palette.terciary[100]}`,
                }}
              />
            ) : null}
            <Grid>
              <Typography fontSize={16} fontWeight={600}>
                {t('BNB Balance')}
              </Typography>
              <Typography fontSize={13} fontWeight={500}>
                {WBNBBalance ? `${WBNBBalance} BNB` : 'Not Available'}
              </Typography>
            </Grid>
            {!smallScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  borderRight: `1px solid ${eulerTheme.palette.terciary[100]}`,
                }}
              />
            ) : null}
            <Grid>
              <Typography fontSize={16} fontWeight={600}>
                {t('Blocks validated')}
              </Typography>
              <Typography fontSize={13} fontWeight={500}>
                {t('Not Available')}
              </Typography>
            </Grid>
            {!smallScreen ? (
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{
                  borderRight: `1px solid ${eulerTheme.palette.terciary[100]}`,
                }}
              />
            ) : null}
            <Grid>
              <Typography fontSize={16} fontWeight={600}>
                {t('My name tag')}
              </Typography>
              <Typography fontSize={13} fontWeight={500}>
                {t('Not Available')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

const AddressDetailInfoWrapper = () => (
  <CoinDataProvider>
    <AddressDetailInfo />
  </CoinDataProvider>
);

export default AddressDetailInfoWrapper;
