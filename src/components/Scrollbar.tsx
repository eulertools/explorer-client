import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { isMobile } from 'react-device-detect';
import PerfectScrollbar from 'react-perfect-scrollbar';
import type { ScrollBarProps as PerfectScrollbarProps } from 'react-perfect-scrollbar';
import { Box } from '@material-ui/core';

interface ScrollbarProps extends PerfectScrollbarProps {}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>((props, ref) => {
  const { children, ...other } = props;

  if (isMobile) {
    return (
      <Box ref={ref} sx={{ overflowX: 'auto' }}>
        {children}
      </Box>
    );
  }

  return (
    <PerfectScrollbar
      // @ts-ignore
      ref={ref}
      {...other}
    >
      {children}
    </PerfectScrollbar>
  );
});

Scrollbar.propTypes = {
  children: PropTypes.node,
};

export default Scrollbar;
