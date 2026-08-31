import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';

const LIFESPAN = 8.64e7; // One day

interface IProps {
  title: string;
  description?: string | React.ReactNode;
  localStorageKey?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

export default function StorageBasedAlert(props: IProps) {
  const { title, severity = 'info', localStorageKey = 'ENS', description } = props;
  const [open, setOpen] = React.useState(true);

  const dateShown = localStorage.getItem(localStorageKey);

  if (dateShown && parseInt(dateShown, 10) + LIFESPAN > Date.now()) {
    return null;
  }

  const onClose = () => {
    setOpen(false);
    localStorage.setItem(localStorageKey, Date.now().toString());
  };

  return (
    <Collapse in={open}>
      <Alert severity={severity} onClose={onClose}>
        {title}
        {description}
      </Alert>
    </Collapse>
  );
}
