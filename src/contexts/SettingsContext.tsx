import { EULER_THEMES as THEMES } from '@eulertools/ui';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ESupportedNetworks } from 'src/types/blockchain';
import { Language, Languages } from 'src/types/language';
import { ESettingsCurrencies } from 'src/types/symbol';
import { loggerError } from 'src/utils/logger';

export const getTranslationResource = (key: string) =>
  fetch(`/locales/${key}/translation.json`)
    .then((res) => res.json())
    .then((data) => data);

interface Settings {
  compact?: boolean;
  direction?: 'ltr' | 'rtl';
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
  language?: Language;
  symbol?: ESettingsCurrencies;
  network?: ESupportedNetworks;
}

export interface SettingsContextValue {
  settings: Settings;
  saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
  children?: ReactNode;
}

const initialSettings: Settings = {
  compact: true,
  direction: 'ltr',
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: THEMES.LIGHT,
  language: Languages[0],
  symbol: ESettingsCurrencies.BUSD,
  network: ESupportedNetworks.BNB,
};

export const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = window.localStorage.getItem('settings');

    if (storedData) {
      const storedSettings = JSON.parse(storedData);

      settings = {
        compact: storedSettings.compact || true,
        direction: storedSettings.direction || 'ltr',
        responsiveFontSizes: storedSettings.responsiveFontSizes || true,
        roundedCorners: storedSettings.roundedCorners || true,
        theme:
          storedSettings.theme ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT),
        language: Languages[0],
        symbol: ESettingsCurrencies.BUSD,
        network: initialSettings.network,
      };
    } else {
      settings = {
        compact: true,
        direction: 'ltr',
        responsiveFontSizes: true,
        roundedCorners: true,
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT,
        language: Languages[0],
        symbol: ESettingsCurrencies.BUSD,
        network: initialSettings.network,
      };
    }
  } catch (err) {
    loggerError(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings: Settings): void => {
  window.localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => {},
});

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { children } = props;
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    async function initializeSettings() {
      const restoredSettings = restoreSettings();

      if (restoredSettings) {
        setSettings(restoredSettings);
      }

      const settingsLanguage = restoredSettings?.language?.value || Languages[0].value;

      const translationFileData = await getTranslationResource(settingsLanguage);
      i18next.addResourceBundle(settingsLanguage, 'translation', translationFileData);
      i18n.changeLanguage(settingsLanguage);

      // Load all the rest of translation files
      Languages.filter((l) => l.value !== settingsLanguage).forEach((language) => {
        getTranslationResource(language.value).then((data) => {
          i18next.addResourceBundle(language.value, 'translation', data);
        });
      });
    }

    initializeSettings();
  }, []);

  const saveSettings = (updatedSettings: Settings): void => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
    i18n.changeLanguage(updatedSettings.language.value);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
