import clsx from 'clsx';
import React, { FC } from 'react';
import { GridColumnHeaderParams } from '@material-ui/data-grid';
import { useStyle } from './styles';

interface MNyGridColumnHeaderParams extends GridColumnHeaderParams {
  headerClassName: string;
}

export const EulerRenderHeader: FC<MNyGridColumnHeaderParams> = ({ headerClassName = 'header', colDef }) => {
  const classes = useStyle();
  return (
    <span className={clsx(classes[headerClassName], classes.overflowEllipsis, classes[colDef.headerAlign || 'center'])}>
      {colDef.headerName}
    </span>
  );
};
