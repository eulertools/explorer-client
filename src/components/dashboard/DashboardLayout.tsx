import { memo, useState } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import EnvironmentAlert from 'src/components/modal/dialogs/EnvironmentAlert';
import { getEnv } from 'src/utils/env';
import DashboardLegalFooter from './DashboardLegalFooter';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  fontFamily: "'Montserrat', 'Roboto', sans-serif",
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const DashboardLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 80,
  // Keep in sync with the sidebar
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '250px',
  },
}));

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch',
});

const DashboardLayout: FC = memo(() => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  const environment = getEnv();

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)} />
      <DashboardSidebar onMobileClose={(): void => setIsSidebarMobileOpen(false)} openMobile={isSidebarMobileOpen} />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            {/* Don't show on production or local */}
            {environment.includes('app.euler.tools') || environment.includes('localhost') ? null : <EnvironmentAlert />}
            <Outlet />
            <DashboardLegalFooter />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
});

export default DashboardLayout;
