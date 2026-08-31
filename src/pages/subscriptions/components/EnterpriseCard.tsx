import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { selectSubscriptionModalSettings } from 'src/selectors/subscriptionModal';
import { UserSubscriptionType } from 'src/slices/user/account';
import { useSelector } from 'src/store';
import { useStyles } from '../styles';
import { CardRow } from './CardRow';
import { enterpriseConfig } from './enterpriseConfig';

export const EnterpriseCard: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const planDetails = useSelector(selectSubscriptionModalSettings).find(
    (d) => d.name === UserSubscriptionType.advanced,
  );
  return (
    <Card className={classes.card}>
      <CardContent>
        <Box
          style={{
            background: 'linear-gradient(90deg, #FFCE75 0%, #FFB224 100%)',
          }}
          className={classes.topBG}
        />
        <Box className={classes.header}>
          <Box className={classes.title} style={{ color: '#FFB224' }}>
            {t('SUBSCRIPTIONS.ENTERPRISE.TITLE')}
          </Box>
          <Box className={classes.price}>{t('SUBSCRIPTIONS.ENTERPRISE.TALK')}</Box>
          <Box className={classes.info}>sales@euler.tools</Box>
          <Box className={classes.desc}>{t('SUBSCRIPTIONS.ENTERPRISE.DESCRIPTION')}</Box>
        </Box>
        <Box className={classes.details}>
          <CardRow config={enterpriseConfig} subscriptionValues={planDetails} />
        </Box>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          className={classes.selectButton}
          style={{
            background: 'linear-gradient(90deg, #FFCE75 0%, #FFB224 100%)',
          }}
          variant="contained"
          component={Link}
          href="mailto:sales@euler.tools"
        >
          {t('SUBSCRIPTIONS.CONTACT_US_BTN')}
        </Button>
      </CardActions>
    </Card>
  );
};
