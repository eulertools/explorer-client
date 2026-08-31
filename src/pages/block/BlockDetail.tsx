import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { AppSkeleton } from 'src/components/templates';
import BlockDetailOverview from 'src/pages/block/components/BlockDetailOverview';
import { EulerEntityTitle } from 'src/ui/EulerEntityTitle';
import { PageTitle } from 'src/ui/PageTitle';

const BlockDetail: FC = () => {
  const { t } = useTranslation();
  const { blockId } = useParams();

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Block Details" />
      <EulerEntityTitle title={t('Block')} extra={`#${blockId}`} />
      <BlockDetailOverview blockId={blockId} />
    </AppSkeleton>
  );
};

export default BlockDetail;
