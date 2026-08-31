import { createEulerTheme, EulerThemeProvider, EULER_THEMES } from '@eulertools/ui';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Card, CardHeader, Divider, IconButton, ThemeProvider } from '@material-ui/core';
import useSettings from '../hooks/useSettings';
import MoonIcon from '../icons/Moon';
import SunIcon from '../icons/Sun';

interface DemoPreviewerProps {
  element: ReactNode;
  name: string;
}

const WidgetPreviewer: FC<DemoPreviewerProps> = (props) => {
  const { element, name, ...other } = props;
  const { settings } = useSettings();
  const [selectedTheme, setSelectedTheme] = useState(settings.theme);

  useEffect(() => {
    setSelectedTheme(settings.theme);
  }, [settings.theme]);

  const handleSwitch = () =>
    setSelectedTheme((prevSelectedTheme) => {
      if (prevSelectedTheme === EULER_THEMES.LIGHT) {
        if (settings.theme === EULER_THEMES.LIGHT) {
          return EULER_THEMES.DARK;
        }

        return settings.theme;
      }

      return EULER_THEMES.LIGHT;
    });

  const theme = createEulerTheme({
    ...settings,
    theme: selectedTheme,
  });

  return (
    <Card variant="outlined" sx={{ mb: 8 }} {...other}>
      <CardHeader
        action={
          <IconButton onClick={handleSwitch}>
            {selectedTheme === 'LIGHT' ? <MoonIcon fontSize="small" /> : <SunIcon fontSize="small" />}
          </IconButton>
        }
        title={name}
      />
      <Divider />
      <ThemeProvider theme={theme}>
        <EulerThemeProvider theme={theme}>{element}</EulerThemeProvider>
      </ThemeProvider>
    </Card>
  );
};

WidgetPreviewer.propTypes = {
  element: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default WidgetPreviewer;
