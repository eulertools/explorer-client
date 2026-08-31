import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import TelegramLogo from 'src/assets/icons/Telegram.svg';
import useAuth from 'src/hooks/useAuth';
import { selectAccount } from 'src/selectors/account';
import { useSelector } from 'src/store';
import { UserAvatar } from 'src/ui/UserAvatar';

const useStyles = makeStyles((theme) => ({
  mainCard: {
    height: '100%',
  },
  cancelIcon: {
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
  },
  avatarBorder: {
    padding: theme.spacing(1),
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: '50%',
  },
  divider: {
    width: '75%',
    margin: '0px auto',
  },
}));

const AccountSummarySettings: FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { user } = useAuth();
  const account = useSelector(selectAccount);

  const subName = useMemo(() => account?.subscription?.name, [account]);

  return (
    <Card className={classes.mainCard}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Box className={classes.avatarBorder}>
            <UserAvatar size="large" withoutActions />
          </Box>
          <Typography color="textSecondary" fontWeight={500} paddingTop={2}>
            {t('Your plan')}: {subName ? subName.charAt(0).toLocaleUpperCase() + subName.slice(1) : 'N/A'}
          </Typography>
          {user.telegram_user_id ? (
            <>
              <Box marginBottom={2} width="100%">
                <Divider className={classes.divider} />
              </Box>
              <Typography color="textSecondary" variant="body2" paddingBottom={1} marginTop={2}>
                {t('Connected Telegram User')}:
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center">
                <img width={24} height={24} src={TelegramLogo} alt="telegram" />
                <Typography color="textSecondary" variant="body2" paddingLeft={1}>
                  {user.telegram_user_id}
                </Typography>
              </Box>
            </>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountSummarySettings;
