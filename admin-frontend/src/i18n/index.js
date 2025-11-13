import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadLanguageResources, getI18nConfig } from './config';

// Dynamic initialization
const initializeI18n = async () => {
  const resources = await loadLanguageResources();
  const config = getI18nConfig();
  
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      ...config,
    });
    
  return i18n;
};

// Initialize and export
const i18nInstance = initializeI18n();

// Export both the promise and the i18n instance
export default i18nInstance;
export { i18n };

// Also export the initialized i18n instance for direct use
export { i18n as i18nInstance };