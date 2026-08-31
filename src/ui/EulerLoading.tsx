import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface EulerLoadingProps {
  size?: 's' | 'm';
  loadingLabel?: string;
}

export const EulerLoading = (props: EulerLoadingProps) => {
  const { size = 's', loadingLabel } = props;
  const viewBox = size === 's' ? '0 0 220 220' : ' 0 0 512 512';
  const cx = size === 's' ? '110' : '256';
  const r = size === 's' ? 110 : 256;
  return (
    <Box width="100%" display="grid" justifyContent="center" position="relative">
      <div id="loader-wrapper">
        <svg viewBox={viewBox} width={`${r * 2}`} height={`${r * 2}`} id="loader">
          <linearGradient id="loaderLinearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="5%" stopColor="#28bcfd" />
            <stop offset="100%" stopColor="#1d78ff" />
          </linearGradient>
          <g>
            <circle cx={cx} cy={cx} r={`${r * 0.75}`} fill="none" stroke="url(#loaderLinearColors)" />
          </g>
          <g>
            <circle cx={cx} cy={cx} r={`${r * 0.6}`} fill="none" stroke="url(#loaderLinearColors)" />
          </g>
          <g>
            <circle cx={cx} cy={cx} r={`${r * 0.5}`} fill="none" stroke="url(#loaderLinearColors)" />
          </g>
          <g>
            <circle cx={cx} cy={cx} r={`${r * 0.4}`} fill="none" stroke="url(#loaderLinearColors)" />
          </g>
          <circle
            id="loader-logo"
            cx={cx}
            cy={cx}
            r={`${r * 0.33}`}
            fill="url(#loaderImage)"
            stroke="none"
            strokeWidth="0"
          />

          <defs>
            <pattern id="loaderImage" height="100%" width="100%" patternContentUnits="objectBoundingBox">
              <image href="/loader.png" preserveAspectRatio="none" width="1" height="1" />
            </pattern>
          </defs>
        </svg>

        <div className="loader-section section-left" />
        <div className="loader-section section-right" />
      </div>
      {loadingLabel ? (
        <Typography
          position="absolute"
          color="textPrimary"
          top={`calc(50% + ${size === 's' ? 90 : 205}px)`}
          width="100%"
          textAlign="center"
        >
          {loadingLabel}
        </Typography>
      ) : null}
    </Box>
  );
};
