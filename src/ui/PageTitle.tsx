import { Helmet } from 'react-helmet-async';
import { Typography } from '@material-ui/core';

export interface PageTitleProps {
  title?: string;
  pageTitle?: string;
}

export const PageTitle = ({ title, pageTitle }: PageTitleProps) => {
  const titleLabel = `${pageTitle || title} | Euler Tools`;

  return (
    <>
      <Helmet>
        <title>{titleLabel}</title>
        <meta name="twitter:title" content={titleLabel} />
      </Helmet>
      {title ? (
        <Typography color="textPrimary" mb={3} fontSize="24px" fontWeight={700}>
          {title}
        </Typography>
      ) : null}
    </>
  );
};
