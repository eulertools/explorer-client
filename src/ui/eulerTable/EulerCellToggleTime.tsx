import React from 'react';
import { GridCellParams } from '@material-ui/data-grid';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { getAge, localeDate } from 'src/utils/moment';

export enum TimeDisplayType {
  ago = 'ago',
  time = 'time',
}
interface EulerCellToggleTimeProps extends GridCellParams {
  displayType: TimeDisplayType;
}

export const EulerCellToggleTime = (props: EulerCellToggleTimeProps) => {
  const { value, displayType } = props;
  if (displayType === TimeDisplayType.ago) return <TruncatedTooltipText value={getAge(value as string)} />;
  return <TruncatedTooltipText value={localeDate(value as string)} />;
};
