import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import React from 'react';
import useSettings from 'src/hooks/useSettings';

const globalCache = createIntlCache();

export const useIntl = () => {
  const settings = useSettings();
  const [instance, setInstance] = React.useState<IntlShape<string>>(
    createIntl({ locale: settings.settings.language.value }, globalCache),
  );
  const prevLocale = React.useRef(null);

  React.useEffect(() => {
    if (prevLocale.current !== settings.settings.language.value) {
      const newInstance = createIntl({ locale: settings.settings.language.value }, globalCache);

      setInstance(newInstance);
      prevLocale.current = settings.settings.language.value;
    }
  }, [settings.settings.language.value]);

  return instance;
};

// Some APIs return scientific notation '1.3e-3'
export const getReadableCurrency = (value: number) => {
  const intl = useIntl();

  if (!value) {
    return null;
  }

  const eNotation = value.toString().lastIndexOf('e');
  const eValue = value.toString().slice(eNotation + 1);
  const period = value.toString().lastIndexOf('.') || 0;
  if (+eValue < -7) {
    return 0;
  }
  if (+eValue < 0) {
    return intl.formatNumber(value, {
      minimumFractionDigits: Math.abs(+eValue),
    });
  }
  if (+eValue > 4 || period >= 7) {
    return intl.formatNumber(value, {
      notation: 'compact',
    });
  }
  return intl.formatNumber(value);
};
