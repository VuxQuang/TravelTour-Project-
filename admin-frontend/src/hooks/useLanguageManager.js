import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/config';

export const useLanguageManager = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Get available languages with translations
  const getAvailableLanguages = () => {
    return SUPPORTED_LANGUAGES.map(lang => ({
      ...lang,
      name: t(`language.${lang.code}`),
      isActive: lang.code === currentLanguage
    }));
  };

  // Change language with loading state
  const changeLanguage = async (langCode) => {
    if (!SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)) {
      console.warn(`Unsupported language: ${langCode}`);
      return;
    }

    setIsLoading(true);
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || 
           SUPPORTED_LANGUAGES[0];
  };

  // Check if language is supported
  const isLanguageSupported = (langCode) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === langCode);
  };

  // Initialize current language from i18n
  useEffect(() => {
    setCurrentLanguage(i18n.language || DEFAULT_LANGUAGE);
  }, [i18n.language]);

  return {
    currentLanguage,
    isLoading,
    availableLanguages: getAvailableLanguages(),
    changeLanguage,
    getCurrentLanguageInfo,
    isLanguageSupported,
    // Helper methods
    isVietnamese: currentLanguage === 'vi',
    isEnglish: currentLanguage === 'en',
    isJapanese: currentLanguage === 'ja',
  };
};
