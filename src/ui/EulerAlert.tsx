import { FC } from 'react';
import Alert from '@material-ui/core/Alert';
import Box from '@material-ui/core/Box';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

interface IEulerAlertProps {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string | React.ReactNode;
  customIcon?: boolean;
}

export const EulerAlert: FC<IEulerAlertProps> = ({ type, message, customIcon = false }) => {
  let icon = null;
  switch (type) {
    case 'error':
      icon = <CloseOutlinedIcon />;
      break;
    case 'info':
      icon = <AnnouncementOutlinedIcon />;
      break;
    default:
      icon = null;
      break;
  }
  return (
    <Box>
      {customIcon ? (
        <Alert icon={icon} severity={type}>
          {message}
        </Alert>
      ) : (
        <Alert severity={type}>{message}</Alert>
      )}
    </Box>
  );
};
