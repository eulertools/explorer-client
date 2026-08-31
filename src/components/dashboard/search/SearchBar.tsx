import { FC, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import SearchBarInput from 'src/components/dashboard/search/SearchBarInput';
import SearchDrawer from 'src/components/dashboard/search/SearchDrawer';

const SearchBar: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);
  };

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  return (
    <>
      <Box width="100%" display="flex" justifyContent="center" onClick={isMobile ? handleDrawerOpen : null}>
        <SearchBarInput />
      </Box>
      <SearchDrawer isOpen={drawerOpen} closeDrawer={handleDrawerClose} />
    </>
  );
};

export default SearchBar;
