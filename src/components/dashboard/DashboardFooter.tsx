import { FC } from 'react';
import { Box, IconButton, Toolbar, useTheme } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import MediumIcon from '../../icons/Medium';

const DashboardFooter: FC = () => {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        height: 64,
        zIndex: theme.zIndex.drawer + 100,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 1px 2px 1px ${theme.palette.divider} inset`,
      }}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <Box>
        <IconButton href="https://t.me/eulertools" target="_blank">
          <TelegramIcon color="primary" style={{ margin: '0 5px' }} />
        </IconButton>
        <IconButton href="https://twitter.com/eulertools" target="_blank">
          <TwitterIcon color="primary" style={{ margin: '0 5px' }} />
        </IconButton>
        <IconButton href="https://medium.com/@euler.tools" target="_blank">
          <MediumIcon color="primary" style={{ margin: '0 5px' }} />
        </IconButton>
        <IconButton href="https://github.com/eulertools" target="_blank">
          <GitHubIcon color="primary" style={{ margin: '0 5px' }} />
        </IconButton>
      </Box>
    </Toolbar>
  );
};

export default DashboardFooter;
