/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ExtendedTheme } from '@eulertools/ui';
import React from 'react';
import { useNavigate } from 'react-router';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      cursor: 'pointer',
      color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);

export const EulerLink = (
  props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = React.useCallback(
    (e) => {
      e.preventDefault();
      if (props.onClick) props.onClick(e);
      if (props.href) {
        navigate(props.href);
      }
    },
    [props],
  );

  return (
    <a
      {...props}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`${classes.link} ${props.className || ''}`}
    >
      {props.children}
    </a>
  );
};
