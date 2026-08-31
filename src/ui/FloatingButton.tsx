import React, { FC } from 'react';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import { useTheme } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/ForumRounded';

interface IProps {
  ariaLabel: string;
  color: 'inherit' | 'primary' | 'secondary' | 'default';
  onClick?: () => void;
}

const FloatingButton: FC<IProps> = ({ ariaLabel, color, children, onClick }) => {
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom in timeout={transitionDuration} unmountOnExit>
      <Fab sx={{ marginRight: '2px' }} aria-label={ariaLabel} color={color} onClick={onClick}>
        {children || <ChatIcon />}
      </Fab>
    </Zoom>
  );
};

export default FloatingButton;
