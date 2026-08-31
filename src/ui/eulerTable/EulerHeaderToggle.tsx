import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import { GridColumnHeaderParams } from '@material-ui/data-grid';
import { useStyle } from './styles';

interface EulerRenderToggleTimeProps extends GridColumnHeaderParams {
  toggle: () => void;
  headerClassName?: string;
}
export const EulerHeaderToggleTime = (params: EulerRenderToggleTimeProps) => {
  const classes = useStyle();
  const { t } = useTranslation();
  const handleToggle = React.useCallback(
    (e) => {
      e.stopPropagation();
      params.toggle();
    },
    [params],
  );
  return (
    <span className={clsx(classes[params.headerClassName || 'header'], classes.overflowEllipsis)}>
      <Tooltip
        title={t('Toggle time display')}
        className={clsx({ [classes.headerLink]: params.headerClassName === undefined })}
      >
        <a onClickCapture={handleToggle}>{params.colDef.headerName}</a>
      </Tooltip>
    </span>
  );
};
