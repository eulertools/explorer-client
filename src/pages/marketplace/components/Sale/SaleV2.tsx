import { ExtendedTheme, useEulerTheme } from '@eulertools/ui';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useWalletConnected from 'src/hooks/useWalletConnected';
import {
  MarketplaceContext,
  initialModal,
  initialSaleSettings,
} from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { SaleCompletedV2 } from 'src/pages/marketplace/components/Sale/SaleCompletedV2';
import { SaleContractV2 } from 'src/pages/marketplace/components/Sale/SaleContractV2';
import { SaleInfo } from 'src/pages/marketplace/components/Sale/SaleInfo';
import { SaleNetworkV2 } from 'src/pages/marketplace/components/Sale/SaleNetworkV2';

export const SaleV2: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const walletConnected = useWalletConnected();

  const { saleSettings, updateSaleSettings, updateModal, isBalance } = useContext(MarketplaceContext);

  const steps = [
    {
      key: 0,
      label: <Typography>Set wallet</Typography>,
      text: 'Set wallet',
      component: <SaleNetworkV2 />,
    },
    {
      key: 1,
      label: <Typography>Sale info</Typography>,
      text: 'Sale info',
      component: <SaleInfo />,
    },
    {
      key: 2,
      label: <Typography>Payment info</Typography>,
      text: 'Payment info',
      component: <SaleContractV2 />,
    },
  ];

  const handleNext = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    updateSaleSettings((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const handleClose = () => {
    updateSaleSettings(initialSaleSettings);
    updateModal({ ...initialModal, showModal: false });
  };

  return (
    <Box
      sx={{
        display: 'grid',
        flexDirection: 'column',
        alignContent: 'space-between',
        minHeight: '538px',
        paddingBottom: theme.spacing(2),
      }}
    >
      {saleSettings.saleCompleted ? (
        <SaleCompletedV2 />
      ) : (
        <>
          {!isMobile ? (
            <Box>
              <Stepper
                sx={{
                  padding: theme.spacing(3),
                  '& > div > svg': {
                    position: 'absolute',
                  },
                  marginBottom: theme.spacing(3),
                  background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                  borderRadius: theme.spacing(1),
                }}
                activeStep={saleSettings.step}
                orientation="horizontal"
                connector={
                  <StepConnector
                    sx={{
                      '&.Mui-disabled > span': {
                        borderColor: (theme as any).palette.neutral[300],
                        borderTopStyle: 'dashed',
                      },
                      '&.Mui-active > span': {
                        borderColor: (theme as any).palette.secondary[300],
                        borderTopStyle: 'solid',
                      },
                    }}
                  />
                }
              >
                {steps.map((step) => (
                  <Step
                    key={step.key}
                    sx={{
                      '&.MuiStep-completed': {
                        '& > span > span > svg': {
                          color: (theme as any).palette.secondary[400],
                        },
                      },
                    }}
                  >
                    <StepLabel
                      sx={{
                        // Current step icon.
                        '& > span > span > p': {
                          fontSize: '13px',
                          fontWeight: 600,
                          lineHeight: '17px !important',
                          color: (theme as any).palette.terciary[800],
                        },
                        // Current step icon number.
                        '& > span > svg > text': {
                          fontSize: '11px',
                          fontWeight: 600,
                          lineHeight: '15px',
                          fill: (theme as any).palette.neutral[0],
                        },
                        // Future non active steps.
                        '&.Mui-disabled': {
                          '& > span > span > p': {
                            fontSize: '13px',
                            fontWeight: 600,
                            lineHeight: '17px',
                            color: (theme as any).palette.neutral[500],
                          },
                          '& > span > svg': {
                            color: (theme as any).palette.neutral[0],
                            boxShadow: '1px 1px 1px rgb(0 0 0 / 4%)',
                            borderRadius: theme.spacing(8),
                            '& > text': {
                              fontSize: '11px',
                              fontWeight: 600,
                              lineHeight: '15px',
                              fill: (theme as any).palette.primary[400],
                            },
                          },
                        },
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              {steps[saleSettings.step]?.component}
            </Box>
          ) : (
            <>
              <Paper
                square
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 50,
                  pl: 2,
                  backgroundColor: theme.palette.background.default,
                  marginBottom: theme.spacing(2),
                }}
              >
                <Typography ml={2} fontWeight="bold">
                  {steps.find((i) => i.key === saleSettings.step)?.text}
                </Typography>
              </Paper>
              {steps[saleSettings.step]?.component}
            </>
          )}

          {saleSettings.step < 1 ? (
            <Grid item mt={1} display="flex" flexDirection="column" alignItems="center">
              <Grid item mt={3} display="flex" gap={2} xs={12} width="100%">
                {saleSettings.step <= steps.length - 1 ? (
                  <Button
                    onClick={handleClose}
                    sx={{
                      boxShadow: 'none',
                      border: 'none',
                      borderRadius: theme.spacing(1.25),
                      width: '100%',
                      background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                      color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {t('Cancel')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleBack}
                    sx={{
                      boxShadow: 'none',
                      border: 'none',
                      borderRadius: theme.spacing(1.25),
                      width: '100%',
                      background: ((theme as unknown) as ExtendedTheme).palette.primary[50],
                      color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {t('Back')}
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={saleSettings.stepDisabled || !isBalance || walletConnected !== 1}
                  sx={{
                    background: eulerTheme.palette.primary[400],
                    boxShadow: 'none',
                    borderRadius: theme.spacing(1.25),
                    width: '100%',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {saleSettings.step === steps.length - 1 ? t('Post ad') : t('Continue')}
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </>
      )}
    </Box>
  );
};
