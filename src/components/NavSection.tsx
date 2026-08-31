import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { matchPath } from 'react-router-dom';
import type { ListProps } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import NavItem from 'src/components/NavItem';

const useStyles = makeStyles((theme) =>
  createStyles({
    listSubHeader: {
      color: theme.palette.text.primary,
      fontSize: '0.75rem',
      lineHeight: 2.5,
      fontWeight: 700,
    },
  }),
);

interface Item {
  path?: string;
  icon?: React.ElementType;
  info?: ReactNode;
  children?: Item[];
  ready?: boolean;
  beta?: boolean;
  title: string;
  forceExactMatch?: boolean;
  disabled?: boolean;
}

interface NavSectionProps extends ListProps {
  items: Item[];
  pathname: string;
  title: string;
}

const renderNavItems = ({
  depth = 0,
  items,
  pathname,
}: {
  items: Item[];
  pathname: string;
  depth?: number;
}): JSX.Element => (
  <List disablePadding>
    {items
      .filter((item) => !item.disabled)
      .reduce(
        (acc, item) =>
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          reduceChildRoutes({
            acc,
            item,
            pathname,
            depth,
          }),
        [],
      )}
  </List>
);

const reduceChildRoutes = ({
  acc,
  pathname,
  item,
  depth,
}: {
  acc: JSX.Element[];
  pathname: string;
  item: Item;
  depth: number;
}): Array<JSX.Element> => {
  // const location = useLocation();
  const { title, ready = true, beta = false, forceExactMatch = true } = item;
  const key = `${title}-${depth}`;

  // let parentMatch = false;
  // if (location.pathname !== '/') {
  //   const locationSlice = location.pathname.slice(1);
  //   const locationFinal = locationSlice.slice(
  //     0,
  //     locationSlice.indexOf('/') === -1 ? locationSlice.length : locationSlice.indexOf('/'),
  //   );
  //   const itemPathSlice = item.path.slice(1);
  //   const itemPathFinal = itemPathSlice.slice(
  //     0,
  //     itemPathSlice.indexOf('/') === -1 ? itemPathSlice.length : itemPathSlice.indexOf('/'),
  //   );
  //   parentMatch = itemPathFinal.includes(locationFinal);
  // }

  const exactMatch = item.path
    ? !!matchPath(
        {
          path: item.path,
          end: forceExactMatch,
        },
        pathname,
      )
    : false;

  if (item.children) {
    const partialMatch = item.path
      ? !!matchPath(
          {
            path: item.path,
            end: false,
          },
          pathname,
        )
      : false;

    acc.push(
      <NavItem
        active={partialMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        path={item.path}
        title={title}
        ready={ready}
      >
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          pathname,
        })}
      </NavItem>,
    );
  } else {
    acc.push(
      <NavItem
        active={exactMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        path={item.path}
        title={title}
        ready={ready}
        beta={beta}
      />,
    );
  }

  return acc;
};

const NavSection: FC<NavSectionProps> = (props) => {
  const { items, pathname, title, ...other } = props;
  const classes = useStyles();

  return (
    <List
      subheader={
        <ListSubheader disableGutters disableSticky className={classes.listSubHeader}>
          {title}
        </ListSubheader>
      }
      {...other}
    >
      {renderNavItems({
        items,
        pathname,
      })}
    </List>
  );
};

NavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  title: PropTypes.string,
};

export default NavSection;
