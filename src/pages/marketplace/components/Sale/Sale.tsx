import { ExtendedTheme } from '@eulertools/ui';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  MarketplaceContext,
  initialModal,
  initialSaleSettings,
  initialPurchaseObject,
} from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { SaleCompleted } from 'src/pages/marketplace/components/Sale/SaleCompleted';
import { SaleContract } from 'src/pages/marketplace/components/Sale/SaleContract';
import { SaleForm } from 'src/pages/marketplace/components/Sale/SaleForm';
import { SaleNetwork } from 'src/pages/marketplace/components/Sale/SaleNetwork';
import { SaleType } from 'src/pages/marketplace/components/Sale/SaleType';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import slice, { getSales } from 'src/slices/tables/marketplace';
import { useDispatch, useSelector } from 'src/store';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    '& > div > div': {
      minWidth: 'auto',
    },
  },
  stepPaper: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    pl: 2,
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(2),
  },
  stepper: {
    padding: theme.spacing(2),
    '& > div > svg': {
      position: 'absolute',
      height: '3rem',
      width: '3rem',
      marginLeft: `-${theme.spacing(4)}`,
    },
  },
  stepCard: {
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {},
  },
  stepIcon: {
    '& > svg': {
      height: '3.5rem',
      width: '3.5rem',
    },
  },
  stepIconCompleted: {
    color: `${((theme as unknown) as ExtendedTheme).eulerActionGreen} !important`,
  },
  stepLabel: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  resumePaper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const Sale: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mySalesTableId = UITableID.marketplace_my_sale_list;
  const mySalesFilter = useSelector(selectFilterState(mySalesTableId));

  const { updateTab, saleSettings, updateSaleSettings, modal, updateModal, updateSaleTab } = useContext(
    MarketplaceContext,
  );

  const steps = [
    {
      key: 0,
      label: <Typography className={classes.stepLabel}>Select Sale Type</Typography>,
      text: 'Select Sale Type',
      component: <SaleType />,
    },
    {
      key: 1,
      label: <Typography className={classes.stepLabel}>Confirm Wallet & Network</Typography>,
      text: 'Confirm Wallet & Network',
      component: <SaleNetwork />,
    },
    {
      key: 2,
      label: <Typography className={classes.stepLabel}>Complete New Sale Form</Typography>,
      text: 'Complete New Sale form',
      component: <SaleForm />,
    },
    {
      key: 3,
      label: <Typography className={classes.stepLabel}>Review & Create Sale</Typography>,
      text: 'Review & Create Sale',
      component: <SaleContract />,
    },
  ];

  const handleNext = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const handleReset = () => {
    updateSaleSettings(initialSaleSettings);
    updateModal({ ...initialModal, showModal: true, activeModal: 'sale', kind: modal.kind, loading: false });
    dispatch(slice.actions.setSale(initialPurchaseObject));
  };

  const handleView = () => {
    updateSaleSettings(initialSaleSettings);
    updateModal(initialModal);
    dispatch(slice.actions.setSale(initialPurchaseObject));
    updateTab(1);
    updateSaleTab(1);
    dispatch(getSales(mySalesFilter.filter, mySalesTableId));
  };

  return (
    <Grid pt={1} container display="flex" justifyContent="space-between" spacing={2}>
      <Grid item xs={12} className={classes.mainGrid}>
        {!isMobile ? (
          <Stepper
            className={classes.stepper}
            activeStep={saleSettings.step}
            orientation="horizontal"
            alternativeLabel
            connector={<ArrowForwardIcon />}
          >
            {steps.map((step) => (
              <Step key={step.key}>
                <StepLabel
                  classes={{ iconContainer: classes.stepIcon }}
                  StepIconProps={{ classes: { completed: classes.stepIconCompleted } }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Paper square elevation={0} className={classes.stepPaper}>
            <Typography ml={2} fontWeight="bold">
              {steps.find((i) => i.key === saleSettings.step)?.text}
            </Typography>
          </Paper>
        )}
        <Card className={classes.stepCard}>
          {steps[saleSettings.step]?.component}
          {saleSettings.step < 2 ? (
            <Grid container mt={1} display="flex" flexDirection="column" alignItems="center">
              <Grid item mb={1} width="100%">
                <Divider orientation="horizontal" flexItem />
              </Grid>
              <Grid item mt={1} display="flex" gap={2}>
                {saleSettings.step !== 0 ? (
                  <Button variant="outlined" disabled={saleSettings.step === 0} onClick={handleBack}>
                    {t('BACK')}
                  </Button>
                ) : null}
                <Button variant="contained" onClick={handleNext} disabled={saleSettings.stepDisabled}>
                  {saleSettings.step === steps.length - 1 ? t('CREATE') : t('CONTINUE')}
                </Button>
              </Grid>
            </Grid>
          ) : null}
          {saleSettings.step === steps.length ? (
            <>
              <SaleCompleted />
              <Grid container mt={1} display="flex" flexDirection="column" alignItems="center">
                <Grid item mb={1} width="100%">
                  <Divider orientation="horizontal" flexItem />
                </Grid>
                <Grid item mt={1} display="flex" gap={2}>
                  <Button variant="outlined" onClick={handleReset}>
                    {t('CREATE A NEW SALE')}
                  </Button>
                  <Button variant="contained" onClick={handleView}>
                    {t('VIEW YOUR NEW SALE')}
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
};
