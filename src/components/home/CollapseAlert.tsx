import React from 'react';
import Alert, { AlertProps } from '@material-ui/core/Alert';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ChevronDown from 'src/icons/ChevronDown';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      padding: 0,
      marginRight: 12,
      marginTop: 4,
      '&:hover': {
        backgroundColor: 'unset',
        opacity: 0.5,
      },
    },
  }),
);

interface IProps extends AlertProps {
  title: string;
  description: string | React.ReactNode;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

export default function CollapseAlert(props: IProps) {
  const { title, severity = 'info', description } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const toggleCollapse = () => {
    setOpen((curr) => !curr);
  };

  return (
    <Alert
      severity={severity}
      action={
        <IconButton className={classes.button} onClick={toggleCollapse}>
          {open ? <CloseIcon fontSize="small" /> : <ChevronDown />}
        </IconButton>
      }
      {...props}
    >
      <Typography fontWeight={500}>{title}</Typography>
      <Collapse in={open}>{description}</Collapse>
    </Alert>
  );
}
