import { EulerIconArrow3 } from '@eulertools/ui';
import { useFormikContext } from 'formik';
import React, { FC, useContext } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import gtm from 'src/lib/gtm';
import { SwapperContext } from '../context';
import { swapperStyles } from '../styles';

const FlipTokens: FC = () => {
  const classes = swapperStyles();

  const { fromToken, toToken, updateFromToken, updateToToken, routeInfo } = useContext(SwapperContext);

  const { setFieldValue } = useFormikContext<{
    fromTokenAmount: number;
  }>();

  const onFlipTokens = React.useCallback(() => {
    gtm.push({ event: 'user_click_flip_tokens', category: 'Swapper', action: 'User click flip tokens' });
    updateToToken(fromToken);
    updateFromToken(toToken);
  }, [toToken, fromToken]);

  return (
    <Box className={classes.flipTokenContainer}>
      <IconButton
        title="Flip tokens"
        color="primary"
        aria-label="flip"
        size="medium"
        onClickCapture={() => {
          onFlipTokens();
          setFieldValue('fromTokenAmount', routeInfo.toTokenAmount, false);
        }}
        className={classes.flipButton}
      >
        <EulerIconArrow3 size="m" colorLight="primary-400" colorDark="primary-400" />
      </IconButton>
    </Box>
  );
};

export default FlipTokens;
