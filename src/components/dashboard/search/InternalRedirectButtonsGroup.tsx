import _isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';
import { IButtonsVisibility } from './types';

interface IProps {
  buttonsVisibility: IButtonsVisibility;
  id: string;
  closeDrawer: () => void;
}

const InternalRedirectButtonsGroup = memo(
  ({ buttonsVisibility, id, closeDrawer }: IProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { settings } = useSettings();

    const allInvisible = Object.values(buttonsVisibility).every((v) => v === false);

    function onNavigateToAddress() {
      navigate(`/${settings.network}/address/${id}`);
      closeDrawer();
    }
    function onNavigateToWallet() {
      navigate(`/${settings.network}/wallet/${id}`);
      closeDrawer();
    }
    function onNavigateToBlock() {
      navigate(`/${settings.network}/block/${id}`);
      closeDrawer();
    }

    function onNavigateToTransaction() {
      navigate(`/${settings.network}/tx/${id}`);
      closeDrawer();
    }

    if (allInvisible) {
      return null;
    }

    return (
      <>
        <Box display="flex" justifyContent="center" marginTop={2}>
          {buttonsVisibility.wallet ? (
            <Button variant="contained" onClick={onNavigateToWallet} style={{ marginRight: theme.spacing(2) }}>
              Go to Wallet
            </Button>
          ) : null}
          {buttonsVisibility.transaction ? (
            <Button variant="contained" onClick={onNavigateToTransaction}>
              Go to Transaction
            </Button>
          ) : null}
          {buttonsVisibility.block ? (
            <Button variant="contained" onClick={onNavigateToBlock}>
              Go to Block
            </Button>
          ) : null}
          {buttonsVisibility.address ? (
            <Button variant="contained" onClick={onNavigateToAddress}>
              Go to Address
            </Button>
          ) : null}
        </Box>
      </>
    );
  },
  (prevProps, nextProps) => _isEqual(prevProps, nextProps),
);

export default InternalRedirectButtonsGroup;
