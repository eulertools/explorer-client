import clsx from 'clsx';
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

export const useStyles = makeStyles(() =>
  createStyles({
    cell: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
    },
  }),
);

interface TruncatedTooltipTextProps {
  value: string | number | React.ReactNode;
  title?: string | number;
  className?: string;
  forceTooltip?: boolean;
}

export const TruncatedTooltipText = ({ value, title, className, forceTooltip = true }: TruncatedTooltipTextProps) => {
  const textElementRef = useRef<HTMLSpanElement>();
  const [canHover, setCanHover] = useState(false);

  const classes = useStyles();

  const compareSize = () => {
    const compare = textElementRef.current
      ? textElementRef.current.scrollWidth > textElementRef.current.clientWidth
      : false;
    setCanHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);

    return () => {
      window.removeEventListener('resize', compareSize);
    };
  }, []);

  return (
    <Tooltip
      PopperProps={{
        popperOptions: {
          placement: 'bottom',
        },
      }}
      title={title || value}
      disableHoverListener={typeof forceTooltip === 'boolean' ? !forceTooltip : !canHover}
    >
      <span ref={textElementRef} className={clsx(classes.cell, className)}>
        {value}
      </span>
    </Tooltip>
  );
};
