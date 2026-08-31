import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { IModalSubscriptionSetting } from 'src/slices/user/subscriptionModal';
import { SoonBadge } from 'src/ui/SoonBadge';
import { useStyles } from '../styles';

export interface ICardRowConfig {
  label: string;
  soon?: boolean;
  title?: boolean;
}

interface CardRowProps {
  config: (t, d) => ICardRowConfig[];
  subscriptionValues: IModalSubscriptionSetting;
}

export const CardRow = (props: CardRowProps) => {
  const { config, subscriptionValues } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const replaceData = {
    wallets: subscriptionValues.details.wallets > 9999 ? t('Unlimited') : subscriptionValues.details.wallets,
    portfolios: subscriptionValues.details.portfolios > 9999 ? t('Unlimited') : subscriptionValues.details.portfolios,
    portfolioEntities:
      subscriptionValues.details.portfolioEntities > 9999
        ? t('Unlimited')
        : subscriptionValues.details.portfolioEntities,
    staking_portfolios:
      subscriptionValues.details.staking.portfolios > 9999
        ? t('Unlimited')
        : subscriptionValues.details.staking.portfolios,
    staking_portfolioEntities:
      subscriptionValues.details.staking.portfolioEntities > 9999
        ? t('Unlimited')
        : subscriptionValues.details.staking.portfolioEntities,
  };

  return (
    <>
      {config(t, replaceData).map((detail) =>
        detail.title ? (
          <Typography
            key={String(detail.label)}
            display="flex"
            alignItems="center"
            padding="0.5rem 0"
            fontStyle="italic"
            fontWeight={600}
            fontSize="1rem"
            lineHeight={1.5}
            textAlign="center"
          >
            {detail.label}
          </Typography>
        ) : (
          <Box key={String(detail.label)} className={classes.detailRow}>
            {detail.soon ? <SoonBadge /> : <CheckCircleIcon className={classes.checkIcon} />} {detail.label}
          </Box>
        ),
      )}
    </>
  );
};
