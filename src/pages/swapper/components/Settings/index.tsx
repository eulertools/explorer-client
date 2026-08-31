import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { swapperStyles } from '../../styles';
import GasContainer from './Gas';
import LiquiditySourcesContainer from './LiquiditySources';
import SlippageToleranceContainer from './Slippage';

enum EUnstakeSteps {
  MAIN = 'MAIN',
  SELECT_LIQUIDITY_SOURCES = 'SELECT_LIQUIDITY_SOURCES',
}

interface IProps extends DialogProps {
  onClose: () => void;
}

const SettingsDialog: React.FC<IProps> = ({ onClose, ...rest }) => {
  const { t } = useTranslation();
  const classes = swapperStyles();

  // const { settings } = useContext(SwapperContext);

  const [flowStep, setFlowStep] = useState<EUnstakeSteps>(EUnstakeSteps.MAIN);

  function onCloseDialog() {
    onClose();
  }

  // function onLiquiditySourcesClick() {
  //   setFlowStep(EUnstakeSteps.SELECT_LIQUIDITY_SOURCES);
  // }

  function onReturnToAllSettings() {
    setFlowStep(EUnstakeSteps.MAIN);
  }

  // const { excludedLiquiditySources, liquiditySourcesList } = settings;

  // const totalLiquiditySources = React.useMemo(() => {
  //   const excludedCount = excludedLiquiditySources.length;

  //   if (excludedCount) {
  //     return liquiditySourcesList.length - excludedCount;
  //   }

  //   return 'All';
  // }, [excludedLiquiditySources]);

  return (
    <Dialog {...rest} onClose={onCloseDialog} maxWidth="sm">
      <DialogTitle
        sx={{
          paddingTop: (theme) => theme.spacing(3),
          paddingBottom: (theme) => theme.spacing(2),
        }}
      >
        <Box display="flex" alignItems="center">
          <Box className={classes.settingsTitle} flexGrow={1}>
            {t('Advanced Settings')}
          </Box>
          <Box>
            <IconButton onClick={onCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: (theme) => theme.spacing(0, 3, 2, 3),
        }}
      >
        {flowStep === EUnstakeSteps.MAIN ? (
          <Box>
            <GasContainer />
            <SlippageToleranceContainer />
            {/* For now remove liquidity sources */}
            {/* <Divider />
            <Box
              mt={2}
              className={`${classes.pointer} ${classes.colorOnHover}`}
              display="flex"
              justifyContent="space-between"
              onClick={onLiquiditySourcesClick}
            >
              <Typography color="textPrimary">Liquidity Sources</Typography>
              <Typography variant="subtitle1">{totalLiquiditySources}</Typography>
            </Box> */}
          </Box>
        ) : null}
        {flowStep === EUnstakeSteps.SELECT_LIQUIDITY_SOURCES ? (
          <LiquiditySourcesContainer onBackClick={onReturnToAllSettings} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
