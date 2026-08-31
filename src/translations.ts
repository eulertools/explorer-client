import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export default i18next.use(initReactI18next).init({
  resources: {},
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
  debug: false,
});
