import QRCode from 'qrcode.react';
import React from 'react';
import { useTheme } from '@material-ui/core/styles';

interface IProps {
  qrCodeValue: string;
  className?: string;
}

const QRCodeDisplay = ({ qrCodeValue, className }: IProps) => {
  const theme = useTheme();
  return (
    <QRCode
      value={qrCodeValue}
      size={128}
      bgColor={theme.palette.primary.contrastText}
      fgColor={theme.palette.primary.main}
      level="L"
      includeMargin={false}
      renderAs="svg"
      className={className}
      imageSettings={{
        src: '/static/logo.png',
        x: null,
        y: null,
        height: 24,
        width: 24,
        excavate: true,
      }}
    />
  );
};

export default QRCodeDisplay;
