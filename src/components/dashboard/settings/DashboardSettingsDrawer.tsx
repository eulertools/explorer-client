import { FC, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsForm from 'src/components/dashboard/settings/SettingsForm';

const DashboardSettingsDrawer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon fontSize="small" />
      </IconButton>
      <Drawer
        anchor="right"
        onClose={handleClose}
        open={isOpen}
        PaperProps={{
          sx: {
            p: 4,
            width: 300,
          },
        }}
      >
        <SettingsForm handleClose={handleClose} />
      </Drawer>
    </>
  );
};

export default DashboardSettingsDrawer;
