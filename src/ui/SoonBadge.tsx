import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';

export const SoonBadge = () => {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      style={{
        backgroundColor: '#688eff',
        color: '#fff',
        marginRight: '1rem',
        fontSize: '0.8rem',
        fontStyle: 'italic',
      }}
      label={t('SOON')}
    />
  );
};
