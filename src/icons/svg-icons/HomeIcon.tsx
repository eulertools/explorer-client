import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';

const HomeIcon: FC<SvgIconProps> = ({ width, height, color }) => (
  <svg width={width || '24'} height={height || '24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={color || '#42526e'} />
  </svg>
);

export default HomeIcon;
