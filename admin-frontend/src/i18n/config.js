// Dynamic i18n configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }, // Ví dụ thêm tiếng Nhật
];

export const DEFAULT_LANGUAGE = 'vi';

export const LANGUAGE_DETECTION_ORDER = [
  'localStorage', 
  'navigator', 
  'htmlTag'
];

export const LANGUAGE_CACHES = ['localStorage'];

// Dynamic resource loader
export const loadLanguageResources = async () => {
  const resources = {};
  
  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      // Dynamic import thay vì hard-code
      const translation = await import(`./locales/${lang.code}.json`);
      resources[lang.code] = {
        translation: translation.default
      };
    } catch (error) {
      console.warn(`Failed to load language: ${lang.code}`, error);
    }
  }
  
  return resources;
};

// Environment-based configuration
export const getI18nConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    fallbackLng: DEFAULT_LANGUAGE,
    debug: isDevelopment,
    detection: {
      order: LANGUAGE_DETECTION_ORDER,
      caches: LANGUAGE_CACHES,
    },
    interpolation: {
      escapeValue: false,
    },
    // Namespace support for better organization
    defaultNS: 'translation',
    ns: ['translation'],
    // Lazy loading support
    load: 'languageOnly',
    // Better error handling
    saveMissing: isDevelopment,
    missingKeyHandler: isDevelopment ? (lng, ns, key) => {
      console.warn(`Missing translation: ${lng}.${ns}.${key}`);
    } : undefined,
  };
};
