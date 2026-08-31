import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { shortAddress } from 'src/utils/stringUtils';

const pathsToIgnore = {
  blockchain: true,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
  },
  link: {
    textTransform: 'capitalize',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 110,
  },
}));

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function BreadCrumbNav() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);
  const modifiedPathnames = pathnames.filter((x) => !pathsToIgnore[x]);

  if (modifiedPathnames.length < 3) return null;

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={12}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const textToDisplay = value.length > 50 ? shortAddress(value) : value;
            if (pathsToIgnore[value]) return null;
            return last || index === 0 ? (
              <Typography color="textPrimary" className={classes.link} key={to}>
                {textToDisplay}
              </Typography>
            ) : (
              <LinkRouter color="textPrimary" className={classes.link} to={to} key={to}>
                {textToDisplay}
              </LinkRouter>
            );
          })}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}
