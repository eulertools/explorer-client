import React from 'react';
import { GridCellParams } from '@material-ui/data-grid';
import { EulerCellPrice } from './EulerCellPrice';

interface EulerCellQuantityProps extends GridCellParams {
  currency?: string;
  customFontWeight?: number;
}

export const EulerCellQuantity = (props: EulerCellQuantityProps) => <EulerCellPrice {...props} currency="" />;
