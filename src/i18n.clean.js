import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// RTL languages
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

// Language detection order
const detectionOptions = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
  checkWhitelist: true
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: detectionOptions,
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    },
    supportedLngs: ['en', 'fr', 'ar'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    cleanCode: true,
    keySeparator: '.',
    nsSeparator: ':',
    saveMissing: true,
    saveMissingTo: 'all',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key}`);
      }
      return key;
    },
    initImmediate: true
  });

// Handle RTL language changes
const updateDocumentDirection = (lng) => {
  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

// Set initial direction
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

// Set initial language and direction
const initialLanguage = i18n.language || window.localStorage.getItem('i18nextLng') || 'en';
updateDocumentDirection(initialLanguage);

export default i18n;
