import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';

const TradeIcon: FC<SvgIconProps> = ({ width, height, color = 'rgb(62, 62, 62)' }) => (
  <svg width={width || 24} height={height || 24} viewBox="-3.5 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.99 6L0 10L3.99 14V11H11V9H3.99V6ZM18 4L14.01 0V3H7V5H14.01V8L18 4Z" fill={color} />
  </svg>
);

export default TradeIcon;
