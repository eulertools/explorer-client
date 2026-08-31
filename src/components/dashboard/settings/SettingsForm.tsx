import { themeEulerOptions } from '@eulertools/ui';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import useSettings from 'src/hooks/useSettings';

const useStyles = makeStyles(() => ({
  themeToggle: {
    '& > button': {
      '& .MuiToggleButton-label': {
        minWidth: '62px',
      },
    },
  },
  title: {
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '12px',
  },
}));

interface ISettingsFormProps {
  handleClose?: () => void;
}

const SettingsForm: FC<ISettingsFormProps> = ({ handleClose }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settings, saveSettings } = useSettings();

  const handleSave = (_, newTheme): void => {
    if (newTheme) {
      const newSettingsValue = {
        ...settings,
        theme: newTheme,
      };
      saveSettings(newSettingsValue);
    }
  };

  return (
    <>
      {handleClose ? (
        <Grid style={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Grid>
      ) : null}
      <Box>
        <Typography color="textPrimary" className={classes.title}>{`${t('Theme')}`}</Typography>
        <Grid item xs={12} pt={2} pb={2} alignContent="center">
          <ToggleButtonGroup
            className={classes.themeToggle}
            value={settings.theme}
            exclusive
            onChange={handleSave}
            aria-label="theme"
            orientation="vertical"
            fullWidth
          >
            {themeEulerOptions.map((theme) => (
              <ToggleButton
                key={theme.key}
                value={theme.key}
                aria-label={`${theme.label.toLowerCase()} theme`}
                color="primary"
              >
                {theme.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Box>
    </>
  );
};

export default SettingsForm;
