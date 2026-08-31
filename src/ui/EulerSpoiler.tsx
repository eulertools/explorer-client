import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export interface IEulerSpoilerProps {
  content: string;
  link?: string;
  characters?: number;
}

export const EulerSpoiler: FC<IEulerSpoilerProps> = ({ content, characters, link }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const handleViewMore = () => {
    setShowDetails((prevState) => !prevState);
  };

  const Content = link ? (
    <Typography color="textPrimary">
      {content.slice(0, characters)}
      <Link target="_blank" href={link}>
        ...{t('view more')}
      </Link>
    </Typography>
  ) : (
    <Typography color="textPrimary">
      {content.slice(0, showDetails ? content.length : characters)}
      <Typography color="primary" onClick={handleViewMore}>
        ...{t('view more')}
      </Typography>
    </Typography>
  );

  return Content;
};
