import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { selectAccountSubscription } from 'src/selectors/account';
import { useSelector } from 'src/store';

interface ICustomToolbarProps {
  addButtonLabel: string;
  onAddButtonClick: () => void;
  onViewAll: () => void;
  extraContent?: JSX.Element | string;
  viewAll: boolean;
}

const ItemCardHeader: FC<ICustomToolbarProps> = ({
  onViewAll,
  onAddButtonClick,
  addButtonLabel,
  extraContent,
  viewAll,
}) => {
  const { t } = useTranslation();

  const subscription = useSelector(selectAccountSubscription);
  const { selected } = useSelector((state) => state.portfolios);

  const totalEntitiesAllowed = subscription.permissions?.portfolioEntities ?? 20;
  const isAddButtonEnabled = (selected?.items?.length || 0) < totalEntitiesAllowed || false;

  return (
    <Grid container display="flex" justifyContent="space-between" paddingX={1} paddingY={2}>
      <Grid item display="flex">
        {extraContent}
      </Grid>
      <Grid item display="flex" justifyContent="space-between" marginTop={1}>
        {isAddButtonEnabled ? (
          <Button size="small" variant="outlined" onClick={onAddButtonClick}>
            <AddIcon fontSize="small" />
            <Typography variant="body2" marginLeft={1}>
              {addButtonLabel}
            </Typography>
          </Button>
        ) : null}
        {onViewAll ? (
          <>
            {isAddButtonEnabled ? <Divider orientation="vertical" style={{ margin: '0px 12px' }} flexItem /> : null}
            <Button onClick={onViewAll} style={{ minWidth: 95 }}>
              <Typography variant="body2">{viewAll ? t('COLLAPSE') : t('VIEW ALL')}</Typography>
            </Button>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default ItemCardHeader;
