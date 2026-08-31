import { useEulerTheme } from '@eulertools/ui';
import BigNumber from 'bignumber.js';
import { FC, CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { ITransactionDetailsItem } from 'src/pages/portfolios/components/portfolioDetails/types';
import { EulerAddress, EulerAddressRenderTypes, EulerAddressTypes } from 'src/ui/EulerAddress';
import { getBigNumberCurrencyLabel, uint256ToBNBCurrency } from 'src/utils/bigNumber';
import { getAge, localeDate } from 'src/utils/moment';
import TokensTransferred from './TokensTransferred';

interface ITransactionOverviewProps {
  transaction: ITransactionDetailsItem;
}

const GridRow: FC = ({ children }) => (
  <Grid pl={3} pr={3} container spacing={2} style={{ marginTop: 0.5 }}>
    {children}
  </Grid>
);

interface IGridPropertyProps {
  style?: CSSProperties;
}

const GridProperty: FC<IGridPropertyProps> = ({ children, style = {} }) => (
  <Grid item xs={4} sm={3}>
    <Typography fontWeight={600} color="terciary.700" style={style} fontSize={13}>
      {children}
    </Typography>
  </Grid>
);

const FieldsDivider = () => <Divider light style={{ marginTop: '10px' }} />;

const GridSimpleValue: FC = ({ children }) => (
  <Grid item xs={8}>
    <Typography fontWeight={500} color="terciary.700" fontSize={13}>
      {children}
    </Typography>
  </Grid>
);

const TransactionOverview: FC<ITransactionOverviewProps> = ({ transaction }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const { settings } = useSettings();

  const [displayAge, setDisplayAge] = useState(true);

  return (
    <Box mt={3}>
      <Card elevation={0} sx={{ paddingBottom: theme.spacing(6) }}>
        <Grid pl={3} pr={3} container spacing={2} mt={2}>
          <GridProperty>{t('Transaction Hash')}</GridProperty>
          <Grid item display="flex" xs={8} sm={9}>
            <HashCopyToClipboard value={transaction.hash}>
              <Typography
                component="span"
                textOverflow="ellipsis"
                overflow="hidden"
                color="terciary.700"
                fontSize={13}
                fontWeight={500}
              >
                {transaction.hash}
              </Typography>
            </HashCopyToClipboard>
          </Grid>
        </Grid>
        <FieldsDivider />
        <GridRow>
          <GridProperty style={{ lineHeight: '32px' }}>{t('Status')}</GridProperty>
          <Grid item>
            {transaction.status === 1 ? (
              <Chip
                style={{
                  backgroundColor: eulerTheme.palette.success[300],
                  color: eulerTheme.palette.success[800],
                  borderRadius: theme.spacing(1),
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                label="Success"
              />
            ) : (
              <>
                {transaction.status === 0 ? (
                  <Chip
                    style={{
                      backgroundColor: eulerTheme.palette.error[300],
                      color: eulerTheme.palette.error[700],
                      borderRadius: theme.spacing(1),
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                    label="Fail"
                  />
                ) : (
                  <Chip
                    style={{
                      backgroundColor: eulerTheme.palette.warning[300],
                      color: eulerTheme.palette.warning[900],
                      borderRadius: theme.spacing(1),
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                    label="Pending"
                  />
                )}
              </>
            )}
          </Grid>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Block')}</GridProperty>
          <Grid item>
            <Link
              component={RouterLink}
              to={`/${settings.network}/block/${transaction.block_number}`}
              fontSize={13}
              fontWeight={500}
              color={eulerTheme.palette.primary[400]}
            >
              {transaction.block_number}
            </Link>
          </Grid>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Timestamp')}</GridProperty>
          <GridSimpleValue>
            <Typography
              component="span"
              onClick={() => setDisplayAge((prev) => !prev)}
              style={{ cursor: 'pointer' }}
              fontSize={13}
              fontWeight={500}
            >
              {displayAge
                ? getAge(new Date(transaction.block_timestamp * 1000).toISOString())
                : localeDate(new Date(transaction.block_timestamp * 1000).toISOString())}
            </Typography>
          </GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('From')}</GridProperty>
          <Grid item xs={8} sm={9} display="flex">
            <Typography textOverflow="ellipsis" overflow="hidden" fontSize={13} fontWeight={500} color="terciary.700">
              {transaction.from}
            </Typography>
            <EulerAddress
              address={transaction.from}
              addressType={EulerAddressTypes.address}
              addressRender={EulerAddressRenderTypes.icons}
              hashColor="terciary.700"
              showModal
            />
          </Grid>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('To')}:</GridProperty>
          <Grid item xs={8} sm={9} display="flex">
            <Typography textOverflow="ellipsis" overflow="hidden" fontSize={13} fontWeight={500} color="terciary.700">
              {transaction.to}
            </Typography>
            <EulerAddress
              address={transaction.to}
              addressType={EulerAddressTypes.address}
              addressRender={EulerAddressRenderTypes.icons}
              hashColor="textPrimary"
              showModal
            />
          </Grid>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Value')}</GridProperty>
          <GridSimpleValue>{uint256ToBNBCurrency(transaction.value)} BNB</GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Transaction Fee')}</GridProperty>
          <GridSimpleValue>
            {getBigNumberCurrencyLabel(new BigNumber(transaction.gas_used).multipliedBy(transaction.gas_price))} BNB
          </GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        {transaction.tokens_transfers?.length ? (
          <>
            <GridRow>
              <GridProperty>
                {t('Tokens Transferred')} ({transaction.tokens_transfers?.length}):
              </GridProperty>
              <TokensTransferred tokensTransferred={transaction.tokens_transfers} />
            </GridRow>
            <FieldsDivider />
          </>
        ) : null}
        <GridRow>
          <GridProperty>{t('Gas Limit')}</GridProperty>
          <GridSimpleValue>{getBigNumberCurrencyLabel(transaction.gas_limit)}</GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Gas Used By Transaction')}</GridProperty>
          <GridSimpleValue>{getBigNumberCurrencyLabel(transaction.gas_used)}</GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Gas Price')}</GridProperty>
          <GridSimpleValue>{getBigNumberCurrencyLabel(transaction.gas_price, false, 12, true)} BNB</GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        <GridRow>
          <GridProperty>{t('Nonce')}</GridProperty>
          <GridSimpleValue>{transaction.nonce}</GridSimpleValue>
        </GridRow>
        <FieldsDivider />
        {/* <GridRow>
          <GridProperty>{t('Position In The Block')}</GridProperty>
          <GridSimpleValue>{transaction.transaction_index}</GridSimpleValue>
        </GridRow> */}
        {/* <FieldsDivider /> */}
      </Card>
    </Box>
  );
};

export default TransactionOverview;
