import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import axios from 'src/lib/axios';
import { getAvatarSrc } from 'src/utils/avatar';
import { loggerInfo } from 'src/utils/logger';

interface IProps {
  address: string;
  symbol: string;
  decimals: number;
}

const EulerAddTokenToWallet = ({ address, symbol, decimals }: IProps) => {
  const addToken = React.useCallback(async () => {
    const image = getAvatarSrc(address);

    let imageExists = true;

    try {
      await axios.baseFetchClient.head(image);
    } catch {
      // Swallow error, we can't have all the token logos of all chains. It's ok son.
      imageExists = false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image: imageExists ? image : undefined,
          },
        },
      });
    } catch (error) {
      loggerInfo(error);
    }
  }, []);

  return (
    <Tooltip title={`Add ${symbol} to Wallet`}>
      <IconButton aria-label={`Add ${symbol} to Wallet`} onClick={addToken}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Tooltip>
  );
};

export default EulerAddTokenToWallet;
