import PropTypes from 'prop-types';
import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import useSettings from 'src/hooks/useSettings';
import Logo from './Logo';

interface MainSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const MainSidebar: FC<MainSidebarProps> = (props) => {
  const { settings } = useSettings();
  const { onMobileClose, openMobile } = props;
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  return (
    <Hidden lgUp>
      <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
        PaperProps={{
          sx: {
            backgroundColor: 'background.default',
            width: 280,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <RouterLink to="/">
              {settings.theme === 'DARK' ? (
                <Logo format="eulertools-navbar-logo-mode-night" heightValue={49} />
              ) : (
                <Logo format="eulertools-navbar-logo" heightValue={49} />
              )}
            </RouterLink>
          </Box>
          <Box sx={{ p: 2 }}>
            <Button
              color="primary"
              fullWidth
              component="a"
              href="https://euler.tools"
              size="small"
              target="_blank"
              variant="contained"
            >
              LEARN MORE
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Hidden>
  );
};

MainSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default MainSidebar;
