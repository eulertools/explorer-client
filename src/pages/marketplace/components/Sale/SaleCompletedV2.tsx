import { ExtendedTheme } from '@eulertools/ui';
import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/core/Alert';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import StorefrontOutlinedIcon from '@material-ui/icons/StorefrontOutlined';
import ShareIcon from 'src/icons/svg-icons/ShareIcon';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { selectMarketplace } from 'src/selectors/marketplace';
import { getSale } from 'src/slices/tables/marketplace';
import { useDispatch, useSelector } from 'src/store';

const useStyles = makeStyles((theme) => ({
  marketIcon: {
    backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    padding: theme.spacing(3),
    borderRadius: '50%',
    color: theme.palette.primary.main,
    fontSize: '8rem',
  },
  continueButton: {
    margin: theme.spacing(2, 0, 2, 0),
    backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    borderRadius: theme.spacing(1),
  },
  detailsButton: {
    color: theme.palette.primary.main,
  },
}));

export const SaleCompletedV2 = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { sale: saleData } = useSelector(selectMarketplace);
  const { sale } = useContext(MarketplaceContext);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSale(sale.id));
  }, [sale]);

  const toggleCollapse = () => {
    setOpen((curr) => !curr);
  };

  const handleClick = () => {
    navigator.clipboard.writeText(`${window.location.toString()}/${saleData?.identifier}`);
    setOpen(true);
  };

  return (
    <Grid container display="flex" justifyContent="space-between" gap={1} my={5}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <StorefrontOutlinedIcon className={classes.marketIcon} />
      </Grid>
      <Grid item xs={12} mb={5} display="flex" justifyContent="center">
        <Typography fontWeight={700} color={theme.palette.action.active} fontSize={20} mt={5}>
          Your ad was posted!
        </Typography>
      </Grid>
      {open ? (
        <Grid item xs={12} mt={2} justifyContent="center">
          <Collapse in={open}>
            <Alert onClose={toggleCollapse} sx={{ border: 1, borderColor: 'success.main' }}>
              Link coppied
            </Alert>
          </Collapse>
        </Grid>
      ) : null}
      <Grid item xs={12} justifyContent="center">
        <Button
          size="large"
          variant="text"
          className={classes.continueButton}
          fullWidth
          endIcon={<ShareIcon />}
          onClick={handleClick}
        >
          {t('Share')}
        </Button>
        <Button size="large" variant="text" fullWidth className={classes.detailsButton}>
          View Details
        </Button>
      </Grid>
    </Grid>
  );
};
