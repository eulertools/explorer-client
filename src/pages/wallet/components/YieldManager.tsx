import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FarmDetails from 'src/pages/wallet/components/FarmDetails';
import { selectYield } from 'src/selectors/yield';
import { getWalletFarms, IYield } from 'src/slices/entities/yield';
import { EulerAlert } from 'src/ui/EulerAlert';
import { EulerLoading } from 'src/ui/EulerLoading';

interface YieldManagerProps {
  address?: string;
}

export const YieldManager = ({ address }: YieldManagerProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading, farmsByAddress, error }: IYield = useSelector(selectYield);

  useEffect(() => {
    if (!farmsByAddress[address]) {
      dispatch(getWalletFarms(address));
    }
  }, [address]);

  if (error) {
    return <EulerAlert type="info" message={error} customIcon />;
  }

  if (loading || !farmsByAddress[address]) {
    return <EulerLoading />;
  }

  const { platforms } = farmsByAddress[address];
  const allWalletPlatforms = Object.values(platforms);

  return (
    <Box>
      {allWalletPlatforms.length ? (
        allWalletPlatforms.map((p) => (
          // Change this afterwards
          <Box key={p[0].farm.provider}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography color="textPrimary">{p[0]?.farm.provider?.toUpperCase()}</Typography>
              </Grid>
              {p.map((f) => (
                <Grid item key={f.farm.id} xs={12} sm={6} lg={4}>
                  <FarmDetails farm={f} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      ) : (
        <Typography color="textPrimary">{t('YIELD.NO_INFO')}</Typography>
      )}
    </Box>
  );
};
