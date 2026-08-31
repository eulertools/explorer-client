import { FC } from 'react';
import { Card } from '@material-ui/core';

interface TransakProps {}

export const TransakWidget: FC<TransakProps> = () => (
  <Card style={{ height: 680, overflow: 'hidden', padding: '0px' }}>
    <iframe
      height="700"
      title="Transak On/Off Ramp Widget"
      src="https://global.transak.com?apiKey=73cccb9f-db94-41ab-aa60-0470d6fb729d"
      frameBorder="no"
      // @ts-ignore
      allowTransparency="true"
      // @ts-ignore
      allowFullScreen=""
      defaultCryptoCurrency="BNB"
      // @ts-ignore
      style={{ display: 'block', width: '100%' }}
    />
  </Card>
);
