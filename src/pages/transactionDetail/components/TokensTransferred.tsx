import React, { FC, useMemo, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AvatarThumbnail } from 'src/components/TokenPairAvatars';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { ITokenTransfer } from 'src/pages/portfolios/components/portfolioDetails/types';
import { getTokenData } from 'src/slices/tables/tokens';
import { EulerAddress, EulerAddressTypes } from 'src/ui/EulerAddress';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface IAddressLinkProps {
  to: string;
}

export const AddressLink: FC<IAddressLinkProps> = ({ children, to }) => (
  <Link to={to} component={RouterLink}>
    {children}
  </Link>
);

interface ITokensTransferredProps {
  tokensTransferred: ITokenTransfer[];
}

const TokensTransferred: FC<ITokensTransferredProps> = ({ tokensTransferred }) => {
  const { t } = useTranslation();

  const { chain } = useContext(ConfigurationContext);

  const [symbolsMap, setSymbolsMap] = useState({});

  const transfers = useMemo(() => [...tokensTransferred].sort((a, b) => Number(a.log_index) - Number(b.log_index)), [
    tokensTransferred,
  ]);

  useEffect(() => {
    const fetchSymbols = async () => {
      const symbols = {};
      const responses = await Promise.all(transfers.map((tx) => getTokenData(tx.token_address, chain)));
      responses.forEach((response) => {
        if (response && response.symbol) {
          symbols[response.address.toLowerCase()] = response.symbol;
        }
      });
      setSymbolsMap(symbols);
    };
    fetchSymbols();
  }, [transfers]);

  return (
    <Grid item xs={8} md={9} color="terciary.700" fontSize={13} fontWeight={500}>
      <Grid item aria-label="token-transfers">
        {transfers.map((tkn) => (
          <Grid item>
            <Grid key={tkn.to_address} paddingBottom={2} container>
              <Grid item display="flex" gap={2} xs={12} md={6} lg={3}>
                <Typography color="terciary.700" fontSize={13} fontWeight={600} alignSelf="center">
                  {t('From')}
                </Typography>
                <EulerAddress
                  address={tkn.from_address}
                  addressType={EulerAddressTypes.address}
                  hashColor="textPrimary"
                  showModal
                />
              </Grid>
              <Grid item display="flex" gap={2} pl={3} xs={12} md={6} lg={3}>
                <Typography color="terciary.700" fontSize={13} fontWeight={600} alignSelf="center">
                  {t('To')}
                </Typography>
                <EulerAddress
                  address={tkn.to_address}
                  addressType={EulerAddressTypes.address}
                  hashColor="textPrimary"
                  showModal
                />
              </Grid>
              <Grid item display="flex" gap={2} pl={3} xs={12} md={6} lg={3}>
                <Typography color="terciary.700" fontSize={13} fontWeight={600} alignSelf="center">
                  {t('For')}
                </Typography>
                <Typography
                  display="flex"
                  color="terciary.700"
                  fontSize={13}
                  fontWeight={500}
                  alignSelf="center"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {getBigNumberCurrencyLabel(tkn.value)}
                </Typography>
              </Grid>
              <Grid item display="flex" gap={2} pl={3} xs={12} md={6} lg={1}>
                {symbolsMap[tkn.token_address] ? (
                  <>
                    <AvatarThumbnail address={tkn.token_address} />
                    <Typography fontSize={13} fontWeight={600} color="terciary.700" alignSelf="center">
                      {symbolsMap[tkn.token_address]}
                    </Typography>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default TokensTransferred;
