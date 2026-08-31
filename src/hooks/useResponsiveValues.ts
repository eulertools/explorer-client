import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ResponseValuesValue {
  isXS: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 *  https://material-ui.com/customization/breakpoints/
    xs, extra-small: 0px
    sm, small: 600px
    md, medium: 960px
    lg, large: 1280px
    xl, extra-large: 1920px
 */
export const useResponsiveValues = (): ResponseValuesValue => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const sm = useMediaQuery(theme.breakpoints.down('md'));
  const md = useMediaQuery(theme.breakpoints.down('lg'));
  const lg = useMediaQuery(theme.breakpoints.up('md'));

  return {
    isXS: xs,
    isSM: sm && !xs,
    isMD: md && !sm,
    isLG: lg || (!md && !sm && !xs),
    isMobile: xs || sm,
    isTablet: md && !xs && !sm,
    isDesktop: lg || (!md && !sm && !xs),
  };
};
