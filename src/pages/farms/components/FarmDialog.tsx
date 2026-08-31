/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid, { GridProps } from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import { AvatarThumbnail, FarmIcon } from 'src/components/TokenPairAvatars';
import { IFarmsDTO } from 'src/types/yield';
import { EulerAddress, EulerAddressRenderTypes, EulerAddressTypes } from 'src/ui/EulerAddress';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { getPlatformSrc, getTokenSrc } from 'src/utils/avatar';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';

interface ConfirmDialogProps {
  farm: IFarmsDTO | null;
  onClose: () => void;
}

const FarmDialog = ({ farm, onClose }: ConfirmDialogProps) => {
  const { t } = useTranslation();

  const { token, name, provider, tvl, yield: _yield, earns, extra } = farm || {};
  const apy = getBigNumberCurrencyLabel(_yield?.apy || 0);

  return farm ? (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="farm-dialog-title"
      aria-describedby="farm-dialog-description"
    >
      <DialogTitle id="farm-dialog-title">
        <Box display="flex" alignItems="center" marginTop={1}>
          <FarmIcon farm={token || name} />
          <Typography component="span" paddingLeft={1} fontWeight={700} fontSize={18}>
            {name}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          size="medium"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '18px' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <FarmGridTitle title={t('Token')} />
          <FarmGridContent>
            <DialogContentText id="farm-dialog-description" color="textPrimary">
              {token?.toUpperCase()}
            </DialogContentText>
          </FarmGridContent>
          {farm.link ? (
            <>
              <FarmGridTitle title={t('Link')} />
              <FarmGridContent>
                <Link color="primary" component="a" href={farm.link} target="_blank" rel="noopener noreferrer">
                  <Typography>{farm.link}</Typography>
                </Link>
              </FarmGridContent>
            </>
          ) : null}
          {provider ? (
            <>
              <FarmGridTitle title={t('Platform')} />
              <FarmGridContent display="flex" alignItems="center" marginBottom={1}>
                <AvatarThumbnail alt={provider} src={getPlatformSrc(provider)} />
                <TruncatedTooltipText
                  value={
                    <Typography paddingLeft={1} variant="body2" textOverflow="ellipsis" overflow="hidden">
                      {provider.toUpperCase()}
                    </Typography>
                  }
                  title={provider}
                />
              </FarmGridContent>
            </>
          ) : null}
          {tvl ? (
            <>
              <FarmGridTitle title={t('TVL')} />
              <FarmGridContent marginBottom={1}>
                <Typography color="textPrimary" textOverflow="ellipsis" overflow="hidden">
                  {getBigNumberCurrencyLabel(tvl.usd || 0)} BUSD
                </Typography>
                <Typography component="span" color="textSecondary">
                  {tvl.amount ? `(${tvl.amount})` : null}
                </Typography>
              </FarmGridContent>
            </>
          ) : null}
          {extra?.pricePerFullShare ? (
            <>
              <FarmGridTitle title={t('Share Price')} />
              <FarmGridContent>
                <Typography color="textPrimary" textOverflow="ellipsis" overflow="hidden">
                  {getBigNumberCurrencyLabel(extra.pricePerFullShare || 0)} BUSD
                </Typography>
              </FarmGridContent>
            </>
          ) : null}
          {_yield ? (
            <>
              <FarmGridTitle title={t('Yield')} />
              <FarmGridContent>
                <TruncatedTooltipText
                  value={
                    <Typography textOverflow="ellipsis" overflow="hidden">
                      {apy}%
                    </Typography>
                  }
                  title={`${apy}%`}
                />
              </FarmGridContent>
            </>
          ) : null}
          {earns?.length ? (
            <>
              <FarmGridTitle title={t('Earns')} />
              <FarmGridContent>
                {earns.map((v) => (
                  <Box key={v} marginRight={1} display="flex" alignItems="center">
                    <Typography variant="body2" color="textPrimary" paddingRight={1}>
                      {v?.toUpperCase()}
                    </Typography>
                    <AvatarThumbnail alt={v} src={getTokenSrc(v)} size="small" />
                  </Box>
                ))}
              </FarmGridContent>
            </>
          ) : null}
          {extra?.transactionToken ? (
            <>
              <FarmGridTitle title={t('Token Address')} />
              <FarmGridContent>
                <EulerAddress
                  address={extra.transactionToken}
                  addressType={EulerAddressTypes.token}
                  addressRender={EulerAddressRenderTypes.truncate_right}
                  showSeeDetailLink
                />
              </FarmGridContent>
            </>
          ) : null}
          {extra?.transactionAddress ? (
            <>
              <FarmGridTitle title={t('Transaction Address')} />
              <FarmGridContent>
                <EulerAddress
                  address={extra.transactionAddress}
                  addressType={EulerAddressTypes.address}
                  addressRender={EulerAddressRenderTypes.truncate_right}
                  showSeeDetailLink
                />
              </FarmGridContent>
            </>
          ) : null}
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null;
};

interface IFarmGridTitle {
  title: string;
}

const FarmGridTitle = ({ title }: IFarmGridTitle) => (
  <Grid item xs={12} sm={3}>
    <DialogContentText>{title}:</DialogContentText>
  </Grid>
);

const FarmGridContent: React.FC<GridProps> = ({ children, ...gridProps }) => (
  <Grid item xs={12} sm={9} {...gridProps}>
    {children}
  </Grid>
);

export default FarmDialog;
