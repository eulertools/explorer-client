import type { FC } from 'react';

interface LogoProps {
  format: string;
  heightValue?: string | number;
}

const Logo: FC<LogoProps> = (props) => {
  // eslint-disable-next-line react/prop-types
  const { format, heightValue = '52px' } = props;
  return <img alt="Logo" src={`/static/${format}.svg`} height={heightValue} />;
};

export default Logo;
