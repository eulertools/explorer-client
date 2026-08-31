import { useWeb3React } from '@web3-react/core';
import { FC, useEffect, useState } from 'react';
import { IconButton } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { PortfolioDetailsContextProvider } from 'src/contexts/PortfolioDetailsContext';
import PriceNotificationModal from './PriceNotificationModal';

interface IPriceNotificationProps {
  subscribed?: boolean;
  currentPrice: string;
  tokenHash?: string;
  symbol?: string;
}

const PriceNotification: FC<IPriceNotificationProps> = ({
  subscribed,
  currentPrice,
  tokenHash = null,
  symbol = null,
}) => {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);

  useEffect(() => {
    setSub(subscribed);
  }, [subscribed]);

  const handleOpen = () => {
    setOpen(true);
  };

  const setSubscribed = () => {
    setSub(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <NotificationsIcon fontSize="small" color={sub ? 'primary' : 'disabled'} />
      </IconButton>
      <PriceNotificationModal
        tokenHash={tokenHash}
        symbol={symbol}
        open={open}
        handleClose={handleClose}
        currentPrice={currentPrice}
        setSubscribed={setSubscribed}
      />
    </>
  );
};

const PriceNotificationWrapper = ({ subscribed = false, currentPrice, tokenHash = null, symbol = null }) => {
  const { account } = useWeb3React();

  return (
    <PortfolioDetailsContextProvider account={account}>
      <PriceNotification symbol={symbol} currentPrice={currentPrice} tokenHash={tokenHash} subscribed={subscribed} />
    </PortfolioDetailsContextProvider>
  );
};

export default PriceNotificationWrapper;
