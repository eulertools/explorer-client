import { themeEulerOptions } from '@eulertools/ui';
import { useMediaQuery, useTheme } from '@material-ui/core';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@material-ui/core/ToggleButtonGroup';
import useSettings from 'src/hooks/useSettings';

interface ThemeButtonGroupProps extends ToggleButtonGroupProps {
  breakpoint?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ThemeButtonGroup = (props: ThemeButtonGroupProps) => {
  const theme = useTheme();
  const { settings, saveSettings } = useSettings();

  const breakpoint = useMediaQuery(theme.breakpoints.down(props.breakpoint || 475));

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
    <ToggleButtonGroup
      value={settings.theme}
      exclusive
      fullWidth={breakpoint}
      onChange={handleSave}
      orientation={breakpoint ? 'vertical' : 'horizontal'}
      aria-label="theme"
      {...props}
    >
      {themeEulerOptions.map((option) => (
        <ToggleButton
          key={option.key}
          value={option.key}
          aria-label={`${option.label.toLowerCase()} theme`}
          color="primary"
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
